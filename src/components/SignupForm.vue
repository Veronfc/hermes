<script lang="ts" setup>
	const supabase = useSupabaseClient();

	const confirm = ref("");
	const confirmMessage = ref("");
	const valid = ref(false);
	const success = ref(false);

	//TODO: Display errors for each input
	const { handleSubmit, errors } = useForm({
		validationSchema: toTypedSchema(signupSchema)
	});

	const { value: email } = useField("email");
	const { value: password } = useField("password");
	const { value: username } = useField("username");

	watch([password, confirm], ([password, confirm]) => {
		if (password !== confirm) {
			confirmMessage.value = "Passwords do not match";
			valid.value = false;
		} else {
			confirmMessage.value = "";
			valid.value = true;
		}
	});

	const signup = handleSubmit(async (values) => {
		if (!valid.value) {
			//TODO: Display passwords not matching error
			alert(confirmMessage.value);
			return;
		}

		const response = await useFetch(
			`/api/check-username?username=${values.username}`
		);

		if (response.data.value) {
			//TODO: Display username already in use error
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
			//TODO: Display email addresss already in use error
			alert("Please enter a different email address");
			return;
		}

		if (error) {
			//TODO: Display other database errors
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
					<input name="email" v-model="email" required />
					<label>Email</label>
				</div>
				<div class="input-label">
					<input name="username" v-model="username" required />
					<label>Username</label>
				</div>
			</section>
			<section>
				<div class="input-label">
					<!--TODO: Add password visibility toggle-->
					<input name="password" type="password" v-model="password" required />
					<label>Password</label>
				</div>
				<div class="input-label">
					<!--TODO: Add password visibility toggle-->
					<input name="confirm" type="password" v-model="confirm" required />
					<label>Confirm password</label>
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
