import { json } from '@sveltejs/kit';
import type { RequestEvent, RequestHandler } from './$types';
import { createNotification, getRoomById  } from '../../../../action';
import type { roomsTable } from '../../../../db/schema';

const tokenValidate = (roomToken: string, authorization: string) => {
    if (!authorization?.startsWith("Bearer ")) {
        return false;
    }

    const authToken = authorization?.replace("Bearer ", "");
    
    return authToken === roomToken;
}

interface RequestEventWithRoomInfo extends RequestEvent {
    roomInfo: typeof roomsTable.$inferSelect;
}

interface RequestHandlerWithRoomInfo {
    (event: RequestEventWithRoomInfo): Promise<Response> | Response;
}

const withAuth = (next: RequestHandlerWithRoomInfo) => async (event: RequestEvent) => {
    const { request, params} = event;
    
    const roomId = +params.slug;

    const roomInfo = await getRoomById(roomId);
    if (!roomInfo) {
        return json({ error: "room id invalid" }, { status: 404 });
    }

    const authorization = request.headers.get("authorization") || "";
    if (!tokenValidate(roomInfo?.token || "", authorization)) {
        return json({ error: "invalid token" }, { status: 401 });
    }

    return next(({ ...event, roomInfo }) as RequestEventWithRoomInfo);
};

export const GET: RequestHandler = withAuth(async ({ roomInfo }) => {
	return json(roomInfo);
});

interface AssetsProps {
    image?: string;
}

export const POST: RequestHandler = withAuth(async ({ request, roomInfo }) => {
    const { message, image }: { message: string; image?: string } = await request.json();
    if (!message) {
        return json({ error: "invalid 'message' object" }, { status: 401 });
    }

    let assets: AssetsProps = {};
    if (image) {
        assets.image = image;
    }

    const notificationId = createNotification({
        roomId: roomInfo.id, 
        message, 
        assets
    });

    // TODO: send push notification to user

	return json({ ok: true, notificationId });
});
