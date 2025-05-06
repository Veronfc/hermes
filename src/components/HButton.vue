<template>
	<button @click="$emit('button-click')">
		<slot></slot>
	</button>
</template>

<script lang="ts" setup></script>

<style scoped>
	button {
		@apply flex cursor-pointer items-center gap-2 rounded border border-border bg-accent px-4 py-1 font-body text-lg text-bg-start duration-150;
	}

	.button-main {
		&:hover {
			@apply border-border bg-border text-text-primary;
		}
	}

	.button-secondary {
		@apply bg-transparent;

		&:hover {
			@apply bg-accent;
		}
	}
</style>
