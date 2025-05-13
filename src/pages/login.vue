<script lang="ts" setup>
	const {isAuthenticated} = useAuth();
</script>

<template>
	<div class="page">
		<LoginForm v-if="!isAuthenticated" />
		<LoggedIn v-else />
	</div>
</template>

<style></style>
