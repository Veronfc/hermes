<script lang="ts" setup>
	const user = useSupabaseUser();
</script>

<template>
	<div class="page">
		<LoggedIn v-if="user" />
		<LoginForm v-else />
	</div>
</template>

<style></style>
