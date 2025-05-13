<script lang="ts" setup>
	const {signup} = useAuth();
	const confirm = ref("");
	const confirmMessage = ref("");
	const success = ref(false);

	const { handleSubmit, errors } = useForm({
		validationSchema: toTypedSchema(signupSchema)
	});

	const { value: email } = useField("email");
	const { value: password } = useField("password");
	const { value: username } = useField("username");

	watch([password, confirm], ([password, confirm]) => {
		if (password !== confirm) {
			confirmMessage.value = "Passwords do not match";
		} else {
			confirmMessage.value = "";
		}
	});

	const onSubmit = handleSubmit(async (values) => {
		if (confirmMessage.value) {
			alert(confirmMessage.value);
			return;
		}

		try {
			await signup(values.email, values.password, values.username);
			success.value = true;
		} catch (error) {
			alert(error);
			//TODO: Add toast notification for errors
		}
	});
</script>
<template>
	<div class="modal confirm" v-if="success">
		<span class="modal-title">Confirm email address</span>
		<span
			>A verification email has been sent to {{ email }}.<br /><br />
			Please click on the confirmation link to confirm your email and
			login.</span
		>
	</div>
	<div class="modal signup" v-else>
		<span class="modal-title">Create account</span>
		<form @submit="onSubmit">
			<section>
				<HInput
					input-name="email"
					v-model="email"
					label="Email"
					:error-condition="errors.email"
					:input-required="true"
					:is-password="false" />
				<HInput
					input-name="username"
					v-model="username"
					label="Username"
					:error-condition="errors.username"
					:input-required="true"
					:is-password="false" />
			</section>
			<section>
				<HInput
					input-name="password"
					v-model="password"
					label="Password"
					:error-condition="errors.password"
					:input-required="true"
					:is-password="true" />
				<HInput
					input-name="confirm"
					v-model="confirm"
					label="Confirm password"
					:error-condition="confirmMessage"
					:input-required="true"
					:is-password="true" />
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
