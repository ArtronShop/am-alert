import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getLastNotificationsByRoomId, getRoomsById  } from '../../../action';

export const GET: RequestHandler = async ({ url }) => {
    const idsParam = url.searchParams.get('ids');
    if (!idsParam) {
        return json([]);
    }

    const idList = idsParam.split(',').map(Number);

    let roomsInfo = await Promise.all((await getRoomsById(idList)).map(async (roomInfo) => ({ ...roomInfo, lastNotification: await getLastNotificationsByRoomId(roomInfo.id) })));
    roomsInfo = roomsInfo.map(a => ({ ...a, token: null })); // Remove token

	return json(roomsInfo);
};

