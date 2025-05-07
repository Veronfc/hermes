<script lang="ts" setup>
	const user = useSupabaseUser();

	watch(
		user,
		() => {
			if (user.value) {
				setTimeout(() => {
					return navigateTo("/");
				}, 3000)
			} else {
				navigateTo("/")
			}
		},
		{ immediate: true }
	);
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
		@apply font-body text-text-secondary pt-4;
	}
</style>
