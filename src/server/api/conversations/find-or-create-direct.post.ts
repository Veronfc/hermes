import prisma from "~/server/lib/prisma";
import { serverSupabaseUser } from "#supabase/server";
import { findOrCreateDirectSchema } from "~/server/validation/conversations";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

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

	const result = await readValidatedBody(event, (body) =>
		findOrCreateDirectSchema.safeParse(body)
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

	const memberId = user!.id;
	const otherMemberId = result.data.otherMemberId;

	if (memberId === otherMemberId) {
		throw createError({
			statusCode: 400,
			statusMessage: "You can not start a conversation with yourself"
		});
	}

	const conversation = await prisma.conversation.findFirst({
		where: {
			type: "direct",
			AND: [
				{
					members: {
						some: {
							user_id: memberId
						}
					}
				},
				{
					members: {
						some: {
							user_id: otherMemberId
						}
					}
				}
			]
		},
		select: {
			id: true
		}
	});

	if (conversation) {
		return { conversationId: conversation.id };
	}

	try {
		const newConversation = await prisma.conversation.create({
			data: {
				type: "direct",
				members: {
					create: [
						{
							user_id: memberId
						},
						{
							user_id: otherMemberId
						}
					]
				}
			}
		});

		return { conversationId: newConversation.id };
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
