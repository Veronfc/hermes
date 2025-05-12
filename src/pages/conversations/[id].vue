<script setup lang="ts">
	definePageMeta({
		layout: "conversations",
		middleware: ["check-login", "check-member"]
	});

	import type { RealtimeChannel } from "@supabase/realtime-js";
	import type { Message } from "@prisma/client";
	import { useConversationStore } from "~/stores/useConversationStore";
	import { useMessageStore } from "~/stores/useMessageStore";

	const conversationId = useRoute().params.id as string;
	const conversationStore = useConversationStore();
	const messageStore = useMessageStore();
	const supabase = useSupabaseClient();

	let channel: RealtimeChannel;

	const subscribeToConversation = async () => {
		channel = supabase
			.channel(`conversation:${conversationId}`)
			.on(
				"postgres_changes",
				{
					event: "INSERT",
					schema: "public",
					table: "messages"
				},
				async (payload) => {
					const message = payload.new as Message;
					await messageStore.sendMessage(message.content);
					conversationStore.updateConversation(conversationId, message.content);
				}
			)
			.subscribe((status) => {
				console.log("Channel status", status);
			});
	};

	onBeforeMount(() => {
		messageStore.selectConversation(conversationId);
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
