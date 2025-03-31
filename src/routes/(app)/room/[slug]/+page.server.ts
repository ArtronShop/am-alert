import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getNotificationsByRoomId, getRoomById } from '../../../../action';

export const load: PageServerLoad = async ({ params }) => {
    const roomId = +params.slug;
    if (!roomId) {
        return redirect(302, "/");
    }

    const roomInfo = await getRoomById(roomId);
    const notificationList = await getNotificationsByRoomId(roomId);

    return {
        roomInfo,
        notificationList,
    };
};
