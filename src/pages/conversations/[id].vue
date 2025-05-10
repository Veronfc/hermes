<script setup lang="ts">
	import type { RealtimeChannel } from "@supabase/realtime-js";
	import type { Message } from "@prisma/client";

	const conversationId = useRoute().params.id.toString();
	const supabase = useSupabaseClient();

	const messages = ref<Message[]>([]);
	let channel: RealtimeChannel;

	const { data: previousMessages, error } = await supabase
		.from("messages")
		.select("*")
		.eq("conversation_id", conversationId)
		.order("created_at");

	if (previousMessages) {
		messages.value = previousMessages as Message[];
	} else {
		console.error(error);
	}

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
				(payload) => {
					const message = payload.new as Message;
					messages.value.push(message);
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
	<div class="page">
		<Messages :conversation-id="conversationId" :messages="messages" />
	</div>
</template>

<style scoped></style>
