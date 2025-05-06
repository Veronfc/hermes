<template>
	<button @click="$emit('button-click')">
		<slot></slot>
	</button>
</template>

<script lang="ts" setup></script>

<style scoped>
	button {
		@apply flex cursor-pointer items-center gap-2 rounded border border-accent-border bg-accent px-4 py-1 font-body text-lg text-bg-start duration-150;
	}

	.button-main {
		&:hover {
			@apply border-border bg-border text-text-primary;
		}
	}

	.button-secondary {
		@apply border-accent bg-transparent text-accent;

		&:hover {
			@apply bg-accent text-text-primary;
		}
	}
</style>
