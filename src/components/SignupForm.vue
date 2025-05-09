<script lang="ts" setup>
	const supabase = useSupabaseClient();

	const confirm = ref("");
	const confirmMessage = ref("");
	const success = ref(false);
	const loading = ref(false);

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

	const signup = handleSubmit(async (values) => {
		if (confirmMessage.value) {
			alert(confirmMessage.value);
			return;
		}

		const response = await $fetch("/api/users/check-username", {
			method: "post",
			query: {
				username: values.username
			}
		});

		if (response) {
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
		<span class="modal-title">Confirm email address</span>
		<span
			>We have sent a verification email to {{ email }}.<br />
			Please click on the confirmation link to confirm your email and
			login.</span
		>
	</div>
	<div class="modal signup" v-else>
		<span class="modal-title">Create account</span>
		<form @submit="signup">
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
					<NuxtLink to="/login" class="link"
						>Login here</NuxtLink
					></span
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
