import type { Message } from "@prisma/client";

const fetchMessages = async (conversationId: string) => {
	try {
		return await $fetch<Message[]>("/api/messages", {
			method: "GET",
			query: {
				conversationId: conversationId
			}
		});
	} catch (error) {
		logError(error);
		throw error;
	}
};

export const useMessages = (conversationId: Ref<string>) => {
	const queryClient = useQueryClient();

	const fetchAll = useQuery<Message[]>({
		queryKey: ["messages", conversationId.value],
		queryFn: () => fetchMessages(conversationId.value),
		enabled: !!conversationId.value,
		refetchOnWindowFocus: false,
		staleTime: 1000 * 30,
		meta: {
			isPartial: false
		},
		refetchOnMount: (query) => {
			return query.meta?.isPartial === true
		}
	});

	const sendMessage = useMutation({
		mutationFn: async (content: string) => {
			const response = await $fetch<Message>("/api/messages", {
				method: "POST",
				body: { conversationId: conversationId.value, content }
			});
			return response;
		},
		onSuccess: (newMessage) => {
			queryClient.setQueryData<Message[]>(
				["messages", conversationId.value],
				(cached) => (cached ? [...cached, newMessage] : [newMessage])
			);

			queryClient.invalidateQueries({ queryKey: ["conversations"] });
		},
		onError: logError
	});

	const updateCache = (message: Message) => {
		queryClient.setQueryData<Message[]>(["messages", conversationId.value], (cached = []) => [...cached, message])
	}

	return {
		messages: fetchAll.data,
		isLoading: fetchAll.isLoading,
		isError: fetchAll.isError,
		sendMessage: sendMessage.mutateAsync,
		isSending: sendMessage.isPending,
		updateCache,
		refetchMessages: fetchAll.refetch
	};
};
