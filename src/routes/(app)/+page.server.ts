import type { PageServerLoad } from './$types';
import { verifyToken } from "../../auth";
import { getUserById } from "../../action";
import { usersTable } from '../../db/schema';
import type { UserInfoProps } from '../../types';

export const load: PageServerLoad = async ({ cookies }) => {
	let userInfo: UserInfoProps | null = null;

	const token = cookies.get("auth") || "";
	if (token) {
		const jwtPayload = await verifyToken(token);
		if (jwtPayload) {
			const rawUserInfo = await getUserById(+jwtPayload?.userId);
			userInfo = {
				id: rawUserInfo.id,
				email: rawUserInfo.email,
				name: rawUserInfo.name || ""
			};
		}
	}

	return {
		userInfo
	};
};
