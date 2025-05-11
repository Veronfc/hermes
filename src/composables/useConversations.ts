export const useConversations = async () => {
	return useFetch<Conversation[]>(
		"/api/conversations",
		{
			method: "get",
			key: "user-conversations",
			server: true,
			lazy: false
		}
	);

  type Conversation = {
		id: string;
		updated_at: Date;
		type: string;
		messages: [
			{
				content: string;
				created_at: Date;
			}
		];
		members: [
			{
				user: {
					id: string;
					username: string;
				};
			}
		];
	};
}