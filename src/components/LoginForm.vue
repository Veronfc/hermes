<script setup lang="ts">
	const supabase = useSupabaseClient();

	const { handleSubmit, errors } = useForm({
		validationSchema: toTypedSchema(loginSchema)
	});

	const { value: email } = useField("email");
	const { value: password } = useField("password");

	const passwordFieldType = ref("password")
	const showPassword = ref(false)

	watch(showPassword, () => {
		if (showPassword.value) passwordFieldType.value = "text"
		else passwordFieldType.value = "password"
	})

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
		<span class="form-title">Welcome back</span>
		<form @submit="login">
			<section>
				<div class="input-label">
					<input name="email" v-model="email" :class="{invalid: errors.email}" required />
					<label>Email</label>
					<span class="error-message" v-if="errors.email">{{ errors.email }}</span>
				</div>
				<div class="input-label">
					<input name="password" :type="passwordFieldType" v-model="password" class="password" :class="{invalid: errors.password}" autocomplete="off" required />
					<label>Password</label>
					<button @click.prevent="showPassword = !showPassword"  title="Toggle password visibility">
						<icon name="mdi:eye-outline" class="toggle" v-show="showPassword"></icon>
						<icon name="mdi:eye-off-outline" class="toggle" v-show="!showPassword"></icon>
					</button>

					<span class="error-message" v-if="errors.password">{{ errors.password }}</span>
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
