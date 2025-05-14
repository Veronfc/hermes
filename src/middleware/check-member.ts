export default defineNuxtRouteMiddleware(async (to, from) => {
	const {isAuthenticated} = useAuth()
	const conversationId = to.params.id as string;

	if (!isAuthenticated) return navigateTo("/login");

	const { data, error } = await useFetch("/api/conversations/check-member", {
		method: "get",
		query: {
			conversationId
		}
	});

	if (!data.value) {
		return navigateTo("/conversations");
	}

	if (error.value) {
		logError(error.value);
	}
});
