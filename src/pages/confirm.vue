<script lang="ts" setup>
	const {isAuthenticated, loginWithCode} = useAuth();
	const code = useRoute().query.code?.toString();

	if (isAuthenticated) navigateTo("/conversations");

	if (!code) navigateTo("/conversations");

	try {
		await loginWithCode(code!);

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
