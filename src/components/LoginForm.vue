<script setup lang="ts">
	import { useAuthStore } from "~/stores/useAuthStore";

	const auth = useAuthStore();

	const { handleSubmit, errors } = useForm({
		validationSchema: toTypedSchema(loginSchema)
	});

	const { value: email } = useField("email");
	const { value: password } = useField("password");

	const onSubmit = handleSubmit(async (values) => {
		try {
			await auth.login(values.email, values.password);
			navigateTo("/conversations");
		} catch (error) {
			alert(error);
			//TODO: use toast
		}
	});
</script>

<template>
	<div class="modal login">
		<span class="modal-title">Welcome back</span>
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
