import prisma from "~/server/lib/prisma";
import { sendMessageSchema } from "~/server/validation/messages";
import { serverSupabaseUser } from "#supabase/server";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import {H3Error} from 'h3'

export default defineEventHandler(async (event) => {
	let user = null;

	try {
		user = await serverSupabaseUser(event);
	} catch (error) {
		throw createError({
			statusCode: 401,
			statusMessage: "You must be logged in to send messages"
		})
	}

	const result = await readValidatedBody(event, (body) =>
		sendMessageSchema.safeParse(body)
	);

	if (!result.success) {
		const errors = result.error.issues
			.map((issue) => `${issue.path.join(".")} - ${issue.message}`)
			.join("; ");

		throw createError({
			statusCode: 400,
			statusMessage: errors
		})
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
			})
		}

		await prisma.message.create({
			data: {
				conversation_id: conversationId,
				sender_id: senderId,
				content: content
			}
		});

		setResponseStatus(event, 201);
		return { message: "Message sent successfully" };
	} catch (error) {
		if (error instanceof H3Error) {
			if (error.statusCode === 403) {
				throw error
			}
		}
		
		if (error instanceof PrismaClientKnownRequestError) {
			throw createError({
				statusCode: 500,
				statusMessage: error.message
			})
		}
	}

	throw createError({
		statusCode: 500,
		statusMessage: "A server error has occurred"
	})
});
