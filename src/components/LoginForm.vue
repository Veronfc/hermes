<script setup lang="ts">
	const supabase = useSupabaseClient();

	//TODO: Display errors for each input
	const { handleSubmit, errors } = useForm({
		validationSchema: toTypedSchema(loginSchema)
	});

	const { value: email } = useField("email");
	const { value: password } = useField("password");

	const login = handleSubmit(async (values) => {
		const { data, error } = await supabase.auth.signInWithPassword({
			email: values.email,
			password: values.password
		});

		if (error) {
			//TODO: Display email not confirmed error
			if (error.code === "email_not_confirmed") {
				alert(
					"Email not verified.\nPlease click on the confirmation link in the verification email sent to you."
				);
				return;
			}

			//TODO: Display email does not exist or incorrect password error
			if (error.code === "invalid_credentials") {
				alert("Incorrect email address or password.");
				return;
			}

			//TODO: Display other database errors
			alert("Database error");
			console.error(
				`Message: ${error.message}\nCode: ${error.code}\nName: ${error.name}`
			);
			return;
		}

		navigateTo("/");
	});
</script>

<template>
	<div class="modal login">
		<span class="form-title">Welcome back</span>
		<form @submit="login">
			<section>
				<div class="input-label">
					<input name="email" v-model="email" required />
					<label>Email</label>
				</div>
				<div class="input-label">
					<!--TODO: Add password visibility toggle-->
					<input name="password" type="password" v-model="password" required />
					<label>Password</label>
				</div>
			</section>
			<section>
				<HButton class="button-main">Login</HButton>
				<div class="line"></div>
				<span
					>Don't have an account?
					<NuxtLink to="/signup" class="link">Sign up here</NuxtLink></span
				>
			</section>
		</form>
	</div>
</template>

<style scoped>
	.login {
		form {
			@apply flex flex-col gap-12 pt-12;

			section {
				@apply flex items-center justify-center gap-4;

				.line {
					@apply h-8 w-[.125rem] bg-text-secondary;
				}

				span {
					@apply font-body text-text-primary;
				}
			}
		}
	}
</style>
