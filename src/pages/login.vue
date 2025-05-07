<script lang="ts" setup>
	const user = useSupabaseUser();
</script>

<template>
	<div class="page">
		<LoginForm v-if="!user" />
		<LoggedIn v-else />
	</div>
</template>

<style></style>
