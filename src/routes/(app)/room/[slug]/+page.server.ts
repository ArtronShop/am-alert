import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getNotificationsByRoomId, getRoomById, deleteRoomByIdAndOwner, deleteRoom, deleteNotification, deleteNotificationByRoomId } from '../../../../action';

export const load: PageServerLoad = async ({ params }) => {
    const roomId = +params.slug;
    if (!roomId) {
        throw redirect(302, "/");
    }

    const roomInfo = await getRoomById(roomId);
    if (!roomInfo) {
        throw redirect(302, "/");
    }

    const notificationList = await getNotificationsByRoomId(roomId);

    return {
        roomInfo,
        notificationList,
        publicVapidKey: process.env.PUBLIC_VAPID_KEY!
    };
};

export const actions = {
    delete: async ({ params, locals }) => {
        const { userInfo } = locals;
        if (!userInfo) {
            throw redirect(302, "/login");
        }

        const roomId = +params.slug;
        if (roomId) {
            const roomInfo = await getRoomById(roomId);

            // Check user are owner this room
            if (roomInfo.owner !== userInfo.id) {
                return fail(403, { error: "you not owner this room" });
            }

            // Delete all notification in this room
            await deleteNotificationByRoomId(roomId);

            // Delete room
            await deleteRoom(roomId);
        }

        redirect(302, "/");

        return { success: true };
    }
} satisfies Actions;
