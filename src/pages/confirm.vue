<script lang="ts" setup>
	const supabase = useSupabaseClient();
	const code = useRoute().query.code?.toString();

	try {
		const user = useSupabaseUser();
		navigateTo("/conversations");
	} catch {}

	if (!code) {
		navigateTo("/conversations");
	}

	const { error } = await supabase.auth.exchangeCodeForSession(code!);

	if (error) {
		alert("Database error");
		console.error(
			`Message: ${error.message}\nCode: ${error.code}\nName: ${error.name}`
		);
	} else {
		setTimeout(() => {
			return navigateTo("/conversations");
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
