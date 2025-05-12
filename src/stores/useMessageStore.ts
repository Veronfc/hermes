import type { Message } from "@prisma/client";
import { logError } from "~/utils/errorHandler";
export const useMessageStore = defineStore("messages", () => {
	const messages = ref<Message[]>([]);
	const conversationId = ref("");

	const selectConversation = async (id: string) => {
		conversationId.value = id;
		messages.value = [];
		await fetchMessages();
	};

	const fetchMessages = async () => {
		try {
			const response = await $fetch<Message[]>("/api/messages", {
				method: "get",
				query: {
					conversationId: conversationId.value
				}
			});
			messages.value = response;
		} catch (error) {
			logError(error);
		}
	};

	const sendMessage = async (content: string) => {
		try {
			const response = await $fetch<Message>("/api/messages", {
				method: "post",
				body: {
					conversationId: conversationId.value,
					content: content
				}
			});

			updateMessages(response);
		} catch (error) {
			logError(error);
		}
	};

	const updateMessages = (message: Message) => {
		messages.value.push(message);
	};

	return {
		conversationId,
		messages,
		selectConversation,
		sendMessage,
		fetchMessages,
		updateMessages
	};
});
