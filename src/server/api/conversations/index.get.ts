import { serverSupabaseUser } from "#supabase/server";
import prisma from "~/server/lib/prisma";

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

	let conversations;

	try {
		conversations = await prisma.conversation.findMany({
			where: {
				members: {
					some: {
						user_id: user!.id
					}
				}
			},
			include: {
				members: {
					where: {
						user_id: {
							not: user!.id
						}
					},
					include: {
						user: {
							select: {
								id: true,
								username: true
							}
						}
					},
					omit: {
						id: true,
						user_id: true,
						conversation_id: true,
						joined_at: true
					}
				}
			},
			omit: {
				created_at: true
			},
			orderBy: {
				updated_at: "desc"
			}
		});
	} catch (error) {
		throw createError({
			statusCode: 500,
			statusMessage: "A server error has occurred"
		});
	}

	return conversations;
});
