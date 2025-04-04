import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getRoomsById  } from '../../../action';

export const GET: RequestHandler = async ({ url }) => {
    const idsParam = url.searchParams.get('ids');
    if (!idsParam) {
        return json([]);
    }

    const idList = idsParam.split(',').map(Number);

    const roomsInfo = await getRoomsById(idList);

	return json(roomsInfo);
};

