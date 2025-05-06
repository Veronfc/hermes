<script setup lang="ts">
	const user = useSupabaseUser();
</script>

<template>
	<div class="page">
		<span v-if="user">{{
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
