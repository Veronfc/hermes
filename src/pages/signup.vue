<script lang="ts" setup>
	const user = useSupabaseUser();
</script>

<template>
	<div class="page">
		<SignupForm v-if="!user" />
		<LoggedIn v-else />
	</div>
</template>

<style></style>
