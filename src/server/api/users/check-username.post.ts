import prisma from "~/server/lib/prisma";

export default defineEventHandler(async (event) => {
	const username = getQuery(event).username?.toString();

	const usernameExists = await prisma.user.findUnique({
		where: {
			username: username
		}
	});

	if (usernameExists) {
		return true;
	}

	return false;
});
