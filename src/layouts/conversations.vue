<script lang="ts" setup>
	import type { RealtimeChannel } from "@supabase/realtime-js";
	import type { Message } from "@prisma/client";

	const { user } = useAuth();
	const { conversations, isLoading } = useConversations();
	const route = useRoute()
	const conversationId = computed(() => <string | undefined>route.params.id)
	const { updateCache: updateConversationCache } = useConversations();
	const supabase = useSupabaseClient();
	const queryClient = useQueryClient()

	let channel: RealtimeChannel;

	const subscribeToConversation = async () => {
		channel = supabase
			.channel("messages")
			.on(
				"postgres_changes",
				{
					event: "INSERT",
					schema: "public",
					table: "messages"
				},
				async (payload) => {
					const message = payload.new as Message;
					if (
						message.conversation_id === conversationId.value &&
						message.sender_id !== user.value?.id
					) {
						updateMessageCache(message.conversation_id)(message)
					} 
					else if (message.sender_id !== user.value?.id) {
						const queryKey = ['messages', message.conversation_id]

						const cachedMessages = queryClient.getQueryData<Message[]>(queryKey)
						const meta = queryClient.getQueryCache().find({queryKey})?.meta

						if (cachedMessages && !meta?.isPartial) {
							queryClient.setQueryData(queryKey, [...cachedMessages, message])
						} else {
							queryClient.invalidateQueries({queryKey})
						}
					}
					updateConversationCache(
						message.conversation_id,
						message.content,
						message.sender_id
					);
				}
			)
			.subscribe((status) => {
				console.log("Channel status", status);
			});
	};

	const updateMessageCache = (conversationId: string) => {
		const {updateCache} = useMessages(ref(conversationId))
		return updateCache
	}

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

	onMounted(() => {
		subscribeToConversation();
	});

	onUnmounted(() => {
		channel?.unsubscribe();
	});
</script>

<template>
	<div class="main">
		<div class="list">
			<NuxtLink
				class="conversation"
				v-for="conversation in conversations"
				:key="conversation.id"
				:to="`/conversations/${conversation.id}`">
				<span class="username" :key="conversation.members[0].user.id">
					{{ conversation.members[0].user.username }}
				</span>
				<div class="message-content" v-if="conversation.last_message">
					<Icon
						name="mdi-call-made"
						v-if="conversation.last_sender_id === user?.id"
						class="call-icon"></Icon>
					<Icon name="mdi:call-received" v-else class="call-icon"></Icon>
					<span class="message">
						{{ conversation.last_message }}
					</span>
					<span class="time">
						{{ convertUtcToLocal(conversation.updated_at) }}
					</span>
				</div>
			</NuxtLink>
			<Icon class="loader" name="svg-spinners:180-ring" v-if="isLoading"></Icon>
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
				@apply box-border flex flex-col justify-center rounded-2xl border border-border bg-input p-2 px-3 font-body text-text-primary opacity-75;

				&:hover {
					@apply border-accent-border;
				}

				.username {
					@apply text-center font-body text-xl tracking-widest;
				}

				.message-content {
					@apply flex flex-row items-center gap-2;

					.call-icon {
						@apply text-accent;
					}

					.message {
						@apply truncate;
					}

					.time {
						@apply pt-1 text-xs text-text-secondary;
					}
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
