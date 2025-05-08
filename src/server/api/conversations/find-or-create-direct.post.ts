import prisma from "~/server/lib/prisma";
import { serverSupabaseUser } from "#supabase/server";
import { findOrCreateDirectSchema } from "~/server/validation/conversations";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export default defineEventHandler(async (event) => {
	let user = null;

	try {
		user = await serverSupabaseUser(event);
	} catch (error) {
		setResponseStatus(event, 401);
		return { message: "You must be logged in to view conversations" };
	}

	const result = await readValidatedBody(event, (body) =>
		findOrCreateDirectSchema.safeParse(body)
	);

	if (!result.success) {
		const errors = result.error.issues
			.map((issue) => `${issue.path.join(".")} - ${issue.message}`)
			.join("; ");

		setResponseStatus(event, 400);
		return { message: errors };
	}

	const memberId = user!.id;
	const otherMemberId = result.data.otherMemberId;

	if (memberId === otherMemberId) {
		setResponseStatus(event, 400);
		return { message: "You can not start a conversation with yourself" };
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
		setResponseStatus(event, 200);
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

		setResponseStatus(event, 200);
		return { conversationId: newConversation.id };
	} catch (error) {
		if (error instanceof PrismaClientKnownRequestError) {
			setResponseStatus(event, 500);
			return { message: error.message };
		}
	}

	setResponseStatus(event, 500);
	return { message: "A server error has occurred" };
});
