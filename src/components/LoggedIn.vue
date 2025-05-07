<script setup lang="ts">
	const user = useSupabaseUser();
	const supabase = useSupabaseClient();
</script>

<template>
	<div class="modal logged-in">
		<span class="modal-title">You're already logged in</span>
		<span>Logged in as: {{ user?.user_metadata.username }}</span>
		<div class="buttons">
			<HButton @button-click="navigateTo('/')" class="button-main"
				>Go home</HButton
			>
			<HButton @button-click="supabase.auth.signOut()" class="button-secondary"
				>Log out</HButton
			>
		</div>
	</div>
</template>

<style scoped>
	.logged-in {
		@apply gap-2;

		span {
			@apply font-body text-text-secondary;
		}

		.buttons {
			@apply box-border flex items-center justify-center gap-10 pt-8;
		}
	}
</style>
