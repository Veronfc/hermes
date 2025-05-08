<script setup lang="ts">
	const supabase = useSupabaseClient();

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
			if (error.code === "email_not_confirmed") {
				alert(
					"Email not verified.\nPlease click on the confirmation link in the verification email sent to you."
				);

				const { error: resendError } = await supabase.auth.resend({
					type: "signup",
					email: values.email,
					options: {
						emailRedirectTo: "http://localhost:3000/confirm"
					}
				});

				if (resendError) {
					alert("Database error.\n\nPlease try again in a minute.");
					console.error(
						`Message: ${resendError.message}\nCode: ${resendError.code}\nName: ${resendError.name}`
					);

					return;
				}

				return;
			}

			if (error.code === "invalid_credentials") {
				alert("Incorrect email address or password.");

				return;
			}

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
		<span class="modal-title">Welcome back</span>
		<form @submit="login">
			<section>
				<HInput
					input-name="email"
					v-model="email"
					label="Email"
					:error-condition="errors.email"
					:input-required="true"
					:is-password="false" />
				<HInput
					input-name="password"
					v-model="password"
					label="Password"
					:error-condition="errors.password"
					:input-required="true"
					:is-password="true" />
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
			@apply flex flex-col gap-8 pt-12;

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
