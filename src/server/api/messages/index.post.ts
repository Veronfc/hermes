import prisma from "~/server/lib/prisma";
import { sendMessageSchema } from "~/server/validation/messages";
import { serverSupabaseUser } from "#supabase/server";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export default defineEventHandler(async (event) => {
	let user = null;

	try {
		user = await serverSupabaseUser(event);
	} catch (error) {
		setResponseStatus(event, 401);
		return { message: "You must be logged in to send messages" };
	}

	const result = await readValidatedBody(event, (body) =>
		sendMessageSchema.safeParse(body)
	);

	if (!result.success) {
		const errors = result.error.issues
			.map((issue) => `${issue.path.join(".")} - ${issue.message}`)
			.join("; ");

		setResponseStatus(event, 400);
		return { message: errors };
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
			setResponseStatus(event, 403);
			return { message: "You're are not a member of this conversation" };
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
		if (error instanceof PrismaClientKnownRequestError) {
			setResponseStatus(event, 500);
			return { message: error.message };
		}
	}

	setResponseStatus(event, 500);
	return { message: "A server error has occurred" };
});
