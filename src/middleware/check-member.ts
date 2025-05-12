import { FetchError } from "ofetch";
import { useAuthStore } from "~/stores/useAuthStore";

export default defineNuxtRouteMiddleware(async (to, from) => {
	const auth = useAuthStore();
	const conversationId = to.params.id as string;

	if (!auth.isAuthenticated) return navigateTo("/login");

	try {
		const response = await $fetch("/api/conversations/check-member", {
			method: "get",
			query: {
				conversationId
			}
		});

		if (!response) {
			return navigateTo("/conversations");
		}
	} catch (error) {
		if (error instanceof FetchError) {
			throw createError({
				statusCode: 500,
				statusMessage: error.statusMessage
			});
		}
	}
});
