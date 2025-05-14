import type { Conversation } from "~/types/uiConversation";

const fetchConversations = async () => {
	try {
		return await $fetch<Conversation[]>("/api/conversations");
	} catch (error) {
		logError(error);
		throw error;
	}
};

export const useConversations = () => {
	const queryClient = useQueryClient();

	const fetchAll = useQuery({
		queryKey: ["conversations"],
		queryFn: fetchConversations,
		staleTime: 1000 * 60,
		refetchOnWindowFocus: false,
		retry: 1
	});

	const findOrCreate = useMutation({
		mutationFn: async (otherMemberId: string) => {
			const response = await $fetch<{ conversationId: string }>(
				"/api/conversations/find-or-create-direct",
				{
					method: "POST",
					body: { otherMemberId }
				}
			);
			return response.conversationId;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["conversations"] });
		},
		onError: logError
	});

	const updateCache = (
		conversationId: string,
		lastMessage: string,
		lastSenderId: string
	) => {
		const cached = queryClient.getQueryData<Conversation[]>(["conversations"]);
		if (!cached) return;

		queryClient.setQueryData<Conversation[]>(["conversations"], () =>
			cached.map((conversation) =>
				conversation.id === conversationId
					? {
							...conversation,
							last_message: lastMessage,
							last_sender_id: lastSenderId,
							updated_at: new Date()
						}
					: conversation
			)
		);
	};

	return {
		conversations: fetchAll.data,
		isLoading: fetchAll.isLoading,
		isError: fetchAll.isError,
		findOrCreateConversation: findOrCreate.mutateAsync,
		updateCache,
		refetchConversations: fetchAll.refetch
	};
};
