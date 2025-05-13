<script setup lang="ts">
	definePageMeta({
		layout: "conversations",
		middleware: ["check-login", "check-member"]
	});

	import type { RealtimeChannel } from "@supabase/realtime-js";
	import type { Message } from "@prisma/client";

	const route = useRoute()
	const conversationId = computed(() => <string>route.params.id);
	const { user } = useAuth();
	const { updateCache: updateMessageCache } = useMessages(conversationId)
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
						updateMessageCache(message)
					} 
					else if (message.sender_id !== user.value?.id) {
						queryClient.setQueryData<Message[]>(
							["messages", message.conversation_id],
							(cached) => {return cached ? [...cached, message] : [message]}
						)

						queryClient.setQueryDefaults(['messages', message.conversation_id], {
							meta: {isPartial: true}
						})
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

	onMounted(() => {
		subscribeToConversation();
	});

	onUnmounted(() => {
		channel.unsubscribe();
	});
</script>

<template>
	<div class="page conversation">
		<Messages />
	</div>
</template>

<style scoped>
	.conversation {
		@apply w-full !important;
	}
</style>
