<script lang="ts" setup>
	const supabase = useSupabaseClient();

	const confirm = ref("");
	const confirmMessage = ref("");
	const success = ref(false);

	const { handleSubmit, errors } = useForm({
		validationSchema: toTypedSchema(signupSchema)
	});

	const { value: email } = useField("email");
	const { value: password } = useField("password");
	const { value: username } = useField("username");

	const passwordFieldType = ref("password")
	const showPassword = ref(false)

	watch(showPassword, () => {
		if (showPassword.value) passwordFieldType.value = "text"
		else passwordFieldType.value = "password"
	})

	watch([password, confirm], ([password, confirm]) => {
		if (password !== confirm) {
			confirmMessage.value = "Passwords do not match";
		} else {
			confirmMessage.value = "";
		}
	});

	const signup = handleSubmit(async (values) => {
		if (!confirmMessage.value) {
			alert(confirmMessage.value);
			return;
		}

		const response = await useFetch(
			`/api/check-username?username=${values.username}`
		);

		if (response.data.value) {
			alert("Please enter a different username");
			return;
		}

		const { data, error } = await supabase.auth.signUp({
			email: values.email,
			password: values.password,
			options: {
				data: {
					username: values.username
				},
				emailRedirectTo: "http://localhost:3000/confirm"
			}
		});

		if (
			data.session === null &&
			error === null &&
			data.user?.identities?.length === 0
		) {
			alert("Please enter a different email address");
			return;
		}

		if (error) {
			alert("Database error");
			console.error(
				`Message: ${error.message}\nCode: ${error.code}\nName: ${error.name}`
			);
			return;
		}

		success.value = true;
	});
</script>
<template>
	<div class="modal confirm" v-if="success">
		<span class="form-title">Confirm email address</span>
		<span
			>We have sent a verification email to {{ email }}.<br />
			Please click on the confirmation link to confirm your email and
			login.</span
		>
	</div>
	<div class="modal signup" v-else>
		<span class="form-title">Create account</span>
		<form @submit="signup">
			<section>
				<div class="input-label">
					<input name="email" v-model="email" :class="{invalid: errors.email}" required />
					<label>Email</label>
					<span class="error-message" v-if="errors.email">{{ errors.email }}</span>
				</div>
				<div class="input-label">
					<input name="username" v-model="username" :class="{invalid: errors.username}" required />
					<label>Username</label>
					<span class="error-message" v-if="errors.username">{{ errors.username }}</span>
				</div>
			</section>
			<section>
				<div class="input-label">
					<input name="password" :type="passwordFieldType" v-model="password" class="password" :class="{invalid: errors.password}" autocomplete="off" required />
					<label>Password</label>
					<span class="error-message" v-if="errors.password">{{ errors.password }}</span>
					<button @click.prevent="showPassword = !showPassword"  title="Toggle password visibility">
						<icon name="mdi:eye-outline" class="toggle" v-show="showPassword"></icon>
						<icon name="mdi:eye-off-outline" class="toggle" v-show="!showPassword"></icon>
					</button>
				</div>
				<div class="input-label">
					<input name="confirm" :type="passwordFieldType" v-model="confirm" class="password" :class="{invalid: confirmMessage}" autocomplete="off" required />
					<label>Confirm password</label>
					<span class="error-message" v-if="confirmMessage">{{ confirmMessage }}</span>
					<button @click.prevent="showPassword = !showPassword"  title="Toggle password visibility">
						<icon name="mdi:eye-outline" class="toggle" v-show="showPassword"></icon>
						<icon name="mdi:eye-off-outline" class="toggle" v-show="!showPassword"></icon>
					</button>
				</div>
			</section>
			<section>
				<HButton class="button-main">Sign up</HButton>
				<div class="line"></div>
				<span
					>Already have account?
					<NuxtLink to="/login" class="link">Login here</NuxtLink></span
				>
			</section>
		</form>
	</div>
</template>

<style>
	.signup {
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

	.confirm {
		@apply w-96 gap-4;

		span {
			@apply text-center font-body text-text-primary;
		}
	}
</style>
