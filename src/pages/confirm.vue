<script lang="ts" setup>
	import { useAuthStore } from "~/stores/useAuthStore";
	const auth = useAuthStore();
	const code = useRoute().query.code?.toString();

	if (auth.isAuthenticated) navigateTo("/conversations");

	if (!code) navigateTo("/conversations");

	try {
		await auth.loginWithCode(code!);

		setTimeout(() => {
			navigateTo("/conversations");
		}, 3000);
	} catch (error) {
		//TODO: use toast
		alert(error);
	}
</script>

<template>
	<div class="page">
		<div class="modal">
			<span class="modal-title">Email confirmed</span>
			<span>You will be redirected shortly...</span>
		</div>
	</div>
</template>

<style scoped>
	span:nth-child(2) {
		@apply pt-4 font-body text-text-secondary;
	}
</style>
