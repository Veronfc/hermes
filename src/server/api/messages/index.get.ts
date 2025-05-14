import prisma from "~/server/lib/prisma";
import { serverSupabaseUser } from "#supabase/server";
import { getMessagesSchema } from "~/server/validation/messages";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export default defineEventHandler(async (event) => {
	try {
		const user = await serverSupabaseUser(event);
	} catch (error) {
		throw createError({
			statusCode: 401,
			statusMessage: "You're not logged in"
		});
	}

	const result = await getValidatedQuery(event, (query) =>
		getMessagesSchema.safeParse(query)
	);

	if (!result.success) {
		const errors = result.error.issues
			.map((issue) => `${issue.path.join(".")} - ${issue.message}`)
			.join("; ");

		throw createError({
			statusCode: 400,
			statusMessage: errors
		});
	}

	const conversationId = result.data.conversationId;

	try {
		const messages = await prisma.message.findMany({
			where: {
				conversation_id: conversationId
			},
			orderBy: {
				created_at: "asc"
			}
		});

		return messages;
	} catch (error) {
		if (error instanceof PrismaClientKnownRequestError) {
			throw createError({
				statusCode: 500,
				statusMessage: error.message
			});
		}
	}

	throw createError({
		statusCode: 500,
		statusMessage: "A server error has occured"
	});
});
