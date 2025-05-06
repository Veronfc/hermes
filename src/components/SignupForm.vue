<script lang="ts" setup>
	const supabase = useSupabaseClient();

	const confirm = ref("");
	const confirmMessage = ref("");
	const valid = ref(false);

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
	//TODO: display error messages
	
	const signup = handleSubmit(async (values) => {
		if (!valid.value) {
			alert(confirmMessage.value);
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
	
		if (error) {
			alert("Database error")
			console.error(
			`Message: ${error.message}\nCause: ${error.cause}\nCode: ${error.code}\nName: ${error.name}\nStatus: ${error.status}\nStack: ${error.stack}`)
			return;
		};

		alert("Account created")
	});
</script>
<template>
	<div class="modal signup">
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
					<input name="password" type="password" v-model="password" required />
					<label>Password</label>
				</div>
				<div class="input-label">
					<input
						name="confirm"
						type="password"
						v-model="confirm"
						required />
					<label>Confirm password</label>
				</div>
			</section>
			<section>
				<HButton class="button-main"
					>Sign up<Icon name="mdi:account-plus" class="icon-main"></Icon
				></HButton>
				<div class="line"></div>
				<span
					>Already have account?
					<NuxtLink class="link">Login here</NuxtLink></span
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
					@apply text-text-primary;
				}
			}
		}
	}
</style>
