import prisma from "~/server/lib/prisma";
import { serverSupabaseUser } from "#supabase/server";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { checkMemberSchema } from "~/server/validation/conversations";

export default defineEventHandler(async (event) => {
	let user = null;

	try {
		user = await serverSupabaseUser(event);
	} catch (error) {
		throw createError({
			statusCode: 401,
			statusMessage: "You're not logged in"
		});
	}

	const result = await getValidatedQuery(event, (query) =>
		checkMemberSchema.safeParse(query)
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
		const member = await prisma.conversationMember.findUniqueOrThrow({
			where: {
				user_id_conversation_id: {
					user_id: user!.id,
					conversation_id: conversationId
				}
			}
		});

		return Boolean(member);
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
		statusMessage: "A server error has occurred"
	});
});
