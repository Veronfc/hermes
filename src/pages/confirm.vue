<script lang="ts" setup>
	const user = useSupabaseUser();

	watch(
		user,
		() => {
			if (user.value) {
				return navigateTo("/");
			}
		},
		{ immediate: true }
	);
</script>

<template>
	<div class="page">Waiting for login...</div>
</template>

<style></style>
