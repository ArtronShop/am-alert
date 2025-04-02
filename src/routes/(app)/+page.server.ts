import { getRoomsByOwner } from '../../action';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { userInfo } = locals;
	let roomList = null;
	if (userInfo) {
		roomList = await getRoomsByOwner(userInfo?.id);
	}
    return {
        userInfo,
		roomList,
    };
};