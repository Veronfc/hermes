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
		@apply font-title text-2xl tracking-wider text-text-primary !important;
	}

	.error-message {
		@apply inline-block self-center text-center font-body text-sm text-red-500 !important;
	}

	.input-label {
		@apply relative flex flex-col gap-1;

		label {
			@apply pointer-events-none absolute flex translate-x-3 translate-y-2 flex-col font-body text-text-secondary duration-300;
		}

		input {
			@apply w-60 rounded bg-input px-3 py-2 font-body text-text-primary caret-text-primary;
		}

		input:is(:focus, :valid) + label {
			@apply -translate-y-7 translate-x-1 text-sm text-text-secondary;
		}
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
