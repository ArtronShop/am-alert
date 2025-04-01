import type { Handle } from '@sveltejs/kit';
import { verifyToken } from "./auth";
import { getUserById } from "./action";

export const handle: Handle = async ({ event, resolve }) => {
    const { cookies } = event;

	const token = cookies.get("auth") || "";
	if (token) {
		const jwtPayload = await verifyToken(token);
		if (jwtPayload) {
			const rawUserInfo = await getUserById(+jwtPayload?.userId);
			event.locals.userInfo = {
				id: rawUserInfo.id,
				email: rawUserInfo.email,
				name: rawUserInfo.name || ""
			};
		}
	}

    return await resolve(event);
};
