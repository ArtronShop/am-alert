import { getLastNotificationsByRoomId, getRoomsByOwner } from '../../action';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { userInfo } = locals;
	let roomList = null;
	if (userInfo) {
		roomList = await Promise.all((await getRoomsByOwner(userInfo?.id)).map(async (roomInfo) => ({ ...roomInfo, lastNotification: await getLastNotificationsByRoomId(roomInfo.id) })));
	}
	console.log(roomList);
    return {
        userInfo,
		roomList,
    };
};