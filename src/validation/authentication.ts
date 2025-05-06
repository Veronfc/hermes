import { z } from "zod";

export const signupSchema = z.object({
	email: z
		.string({ required_error: "Please enter an email address" })
		.min(1, { message: "Please enter an email address" })
		.email({ message: "Please enter a valid email address" }),
	password: z
		.string({ required_error: "Please enter a password" })
		.min(8, { message: "Password must be at least 8 characters" }),
	username: z
		.string({ required_error: "Please enter a username" })
		.min(5, { message: "Username must be at least 5 characters" })
		.max(30, { message: "Username must be at most 30 characters" })
});

export const loginSchema = z.object({
	email: z
		.string({ required_error: "Please enter an email address" })
		.min(1, { message: "Please enter an email address" })
		.email({ message: "Please enter a valid email address" }),
	password: z
		.string({ required_error: "Please enter a password" })
		.min(8, { message: "Password must be at least 8 characters" })
});
