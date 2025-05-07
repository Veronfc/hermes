<template>
	<NuxtPage />
</template>

<script lang="ts" setup></script>

<style>
	.page {
		@apply flex h-svh w-svw items-center justify-center bg-gradient-to-br from-bg-start via-bg-mid to-bg-end;
	}

	.modal {
		@apply flex flex-col items-center justify-center rounded-2xl border border-border bg-modal p-12 duration-300;

		&:hover {
			@apply -translate-x-2 -translate-y-2;
			filter: drop-shadow(0.5rem 0.5rem 0 black);
		}
	}

	.form-title {
		@apply font-title text-3xl tracking-wider text-text-primary !important;
	}

	.link {
		@apply cursor-pointer text-accent duration-150;

		&:hover {
			@apply underline;
		}
	}

	.icon-main {
		@apply text-bg-start !important;
	}

	.icon-secondary {
		@apply text-accent !important;
	}

	button:hover > .icon-main {
		@apply text-text-primary !important;
	}

	button:hover > .icon-secondary {
		@apply text-text-primary !important;
	}
</style>
