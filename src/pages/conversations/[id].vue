<script setup lang="ts">
	definePageMeta({
		layout: "conversations",
		middleware: ["check-login", "check-member"]
	});
</script>

<template>
	<div class="page conversation">
		<Messages />
	</div>
</template>

<style scoped>
	.conversation {
		@apply w-full !important;
	}
</style>
