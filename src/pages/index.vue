<script setup lang="ts">
	import { useAuthStore } from "~/stores/useAuthStore";

	definePageMeta({
		middleware: "check-login"
	});
	const auth = useAuthStore();
</script>

<template>
	<div class="page">
		<span v-if="auth.user">{{
			`Email: ${auth.user?.email}\nUsername: ${auth.user?.user_metadata.username}`
		}}</span>
		<span v-else>Not logged in</span>
	</div>
</template>

<style scoped>
	span {
		@apply font-body text-text-primary;
	}
</style>
