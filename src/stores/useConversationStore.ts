import { logError } from "~/utils/errorHandler";

export const useConversationStore = defineStore("conversations", () => {
	type Conversation = {
		id: string;
		updated_at: Date;
		type: string;
		last_message?: string;
		members: [
			{
				user: {
					id: string;
					username: string;
				};
			}
		];
	};

	const conversations = ref<Conversation[]>([]);
	const isLoading = ref(false);

	const findOrCreateConversation = async (otherMemberId: string) => {
		try {
			const response = await $fetch(
				"/api/conversations/find-or-create-direct",
				{
					method: "post",
					body: {
						otherMemberId
					}
				}
			);

			return response.conversationId;
		} catch (error) {
			logError(error);
		}
	};

	const fetchConversations = async () => {
		if (conversations.value.length) return;
		isLoading.value = true;
		try {
			conversations.value = await $fetch<Conversation[]>("/api/conversations", {
				method: "get"
			});
		} catch (error) {
			logError(error);
		} finally {
			isLoading.value = false;
		}
	};

	const updateConversation = (conversationId: string, lastMessage: string) => {
		const index = conversations.value.findIndex(
			(conversation) => conversation.id === conversationId
		);

		if (index !== -1) {
			conversations.value[index] = {
				...conversations.value[index],
				last_message: lastMessage,
				updated_at: new Date()
			};
		}
	};

	return {
		conversations,
		isLoading,
		fetchConversations,
		updateConversation,
		findOrCreateConversation
	};
});
