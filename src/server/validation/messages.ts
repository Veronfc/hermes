import { z } from "zod";

export const postMessageSchema = z.object({
	conversationId: z
		.string({ required_error: "Conversation ID required" })
		.uuid({ message: "Not a valid UUID" })
		.nonempty({ message: "Conversation ID required" }),
	content: z
		.string({ required_error: "Please enter a message to send" })
		.nonempty({ message: "Please enter a message to send" })
		.max(2500, {
			message: "Message content is too long. Maximum 2500 characters"
		})
});

export const getMessagesSchema = z.object({
	conversationId: z
		.string({ required_error: "Conversation ID required" })
		.uuid({ message: "Not a valid UUID" })
		.nonempty({ message: "Conversation ID required" })
});
