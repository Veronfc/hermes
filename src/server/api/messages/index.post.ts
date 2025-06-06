import prisma from "~/server/lib/prisma";
import { postMessageSchema } from "~/server/validation/messages";
import { serverSupabaseUser } from "#supabase/server";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { H3Error } from "h3";

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
		postMessageSchema.safeParse(body)
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

	const senderId = user!.id;
	const { conversationId, content } = result.data;

	try {
		const conversationMember = await prisma.conversationMember.findUnique({
			where: {
				user_id_conversation_id: {
					user_id: senderId,
					conversation_id: conversationId
				}
			},
			select: {
				conversation_id: true
			}
		});

		if (!conversationMember) {
			throw createError({
				statusCode: 403,
				statusMessage: "You're are not a member of this conversation"
			});
		}

		const message = await prisma.message.create({
			data: {
				conversation_id: conversationId,
				sender_id: senderId,
				content: content
			}
		});

		await prisma.conversation.update({
			where: {
				id: conversationId
			},
			data: {
				last_message: content,
				last_sender_id: senderId
			}
		});

		return message;
	} catch (error) {
		if (error instanceof H3Error) {
			if (error.statusCode === 403) {
				throw error;
			}
		}

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
