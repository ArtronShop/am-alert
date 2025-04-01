import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getNotificationsByRoomId, getRoomById } from '../../../../action';

export const load: PageServerLoad = async ({ params }) => {
    const roomId = +params.slug;
    if (!roomId) {
        throw redirect(302, "/");
    }

    const roomInfo = await getRoomById(roomId);
    /* if (!roomInfo) {
        throw redirect(302, "/");
    } */

    const notificationList = await getNotificationsByRoomId(roomId);

    return {
        roomInfo,
        notificationList,
    };
};
