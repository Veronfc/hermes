<script setup lang="ts">
	definePageMeta({
		middleware: "check-login"
	});
	const {user, isAuthenticated} = useAuth();
</script>

<template>
	<div class="page">
		<span v-if="isAuthenticated">{{
			`Email: ${user?.email}\nUsername: ${user?.user_metadata.username}`
		}}</span>
		<span v-else>Not logged in</span>
	</div>
</template>

<style scoped>
	span {
		@apply font-body text-text-primary;
	}
</style>
