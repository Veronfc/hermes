<script lang="ts" setup>
import { useConversationStore } from '~/stores/useConversationStore';

	const conversationStore = useConversationStore()

	const convertUtcToLocal = (timestamp?: Date) => {
		if (!timestamp) {
			return;
		}

		const utc = new Date(timestamp);
		const today = new Date();

		if (utc.getDate() !== today.getDate()) {
			return utc.toLocaleString("en-GB", {
				hour12: false,
				dateStyle: "medium"
			});
		}

		return utc.toLocaleString("en-GB", {
			hour12: false,
			timeStyle: "short"
		});
	};
</script>

<template>
	<div class="main">
		<div class="list">
			<NuxtLink
				class="conversation"
				v-for="conversation in conversationStore.conversations"
				:key="conversation.id"
				:to="`/conversations/${conversation.id}`">
				<span class="username" :key="conversation.members[0].user.id">
					{{ conversation.members[0].user.username }}
				</span>
				<span class="message">
					{{ conversation.last_message }}
				</span>
				<span class="time">
					{{ convertUtcToLocal(conversation.updated_at) }}
				</span>
			</NuxtLink>
			<Icon class="loader" name="svg-spinners:180-ring" v-if="conversationStore.isLoading"></Icon>
		</div>
		<slot />
	</div>
</template>

<style scoped>
	.main {
		@apply flex h-full w-full flex-row;

		.list {
			@apply relative flex min-w-[20rem] max-w-[20rem] flex-col gap-4 bg-modal p-4;

			.conversation {
				@apply box-border flex h-24 flex-col justify-center rounded-2xl border border-border bg-input p-4 py-2 font-body text-text-primary opacity-75;

				&:hover {
					@apply border-accent-border;
				}

				.username {
					@apply font-title tracking-widest;
				}

				.message {
					@apply truncate;
				}

				.time {
					@apply border-t pt-1 text-right text-xs text-text-secondary;
				}
			}

			.router-link-active,
			.router-link-exact-active {
				@apply border-2 border-accent-border opacity-100;
			}
		}

		.loader {
			@apply absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 text-text-primary !important;
		}
	}
</style>
