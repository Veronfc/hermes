import { serverSupabaseUser } from "#supabase/server";
import prisma from "~/server/lib/prisma";

export default defineEventHandler(async (event) => {
	let user = null;

	try {
		user = await serverSupabaseUser(event);
	} catch (error) {
		setResponseStatus(event, 401);
		return { message: "You must be logged in to view conversations" };
	}

	const conversations = await prisma.conversation.findMany({
		where: {
			members: {
				some: {
					user_id: user!.id
				}
			}
		},
		include: {
			messages: {
				orderBy: {
					created_at: "desc"
				},
				take: 1,
				select: {
					content: true,
					created_at: true
				}
			},
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
			updated_at: 'desc'
		}
	});

	return conversations;
});
