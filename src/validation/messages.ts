import { z } from "zod";

export const sendMessageSchema = z.object({
	content: z
		.string({ required_error: "Please enter a message to send" })
		.nonempty({ message: "Please enter a message to send" })
		.max(2500, {
			message: "Message content is too long. Maximum 2500 characters."
		})
});
