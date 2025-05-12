import { z } from "zod";

export const findOrCreateDirectSchema = z.object({
	otherMemberId: z
		.string({ required_error: "Other Conversation Member ID required" })
		.uuid({ message: "Not a valid UUID" })
		.nonempty({ message: "Other Conversation Member ID required" })
});

export const checkMemberSchema = z.object({
	conversationId: z
		.string({ required_error: "Conversation ID required" })
		.uuid({ message: "Not a valid UUID" })
		.nonempty({ message: "Conversation ID required" })
});
