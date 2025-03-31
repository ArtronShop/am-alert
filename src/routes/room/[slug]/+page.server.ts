import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getNotificationsByRoomId, getRoomById, getUserById } from '../../../action';
import type { UserInfoProps } from '../../../types';
import { verifyToken } from '../../../auth';

export const load: PageServerLoad = async ({ params, cookies }) => {
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

    const roomId = +params.slug;
    if (!roomId) {
        return redirect(302, "/");
    }

    const roomInfo = await getRoomById(roomId);
    const notificationList = await getNotificationsByRoomId(roomId);

    return {
        userInfo,
        roomInfo,
        notificationList,
    };
};
