<script lang="ts" setup>
	const route = useRoute();
	const tokenHash = route.query.token_hash?.toString();
	const supabase = useSupabaseClient();
	const user = useSupabaseUser();

	if (!tokenHash || user) {
		navigateTo("/");
	}

	//FIXME: Fix auto-login on email confirmation
	const { error } = await supabase.auth.verifyOtp({
		token_hash: tokenHash!,
		type: "email"
	});

	if (error) {
		alert("Database error");
		console.error(
			`Message: ${error.message}\nCode: ${error.code}\nName: ${error.name}`
		);
	} else {
		setTimeout(() => {
			return navigateTo("/");
		}, 3000);
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
