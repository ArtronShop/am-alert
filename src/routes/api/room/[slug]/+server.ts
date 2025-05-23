import { json } from '@sveltejs/kit';
import type { RequestEvent, RequestHandler } from './$types';
import { createNotification, getRoomById, getSubscriptionByRoomId  } from '../../../../action';
import type { roomsTable } from '../../../../db/schema';
import PushNotifications from 'node-pushnotifications';
import 'dotenv/config';

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

    const notificationId = await createNotification({
        roomId: roomInfo.id, 
        message, 
        assets
    });

    // Send push notification to user
    const subscription = (await getSubscriptionByRoomId(roomInfo.id)).map(a => a.subscription) as PushNotifications.RegistrationId[];

    const push = new PushNotifications({
        web: {
            vapidDetails: {
                subject: "mailto:" + process.env.ADMIN_EMAIL!,
                publicKey: process.env.PUBLIC_VAPID_KEY!,
                privateKey: process.env.PRIVATE_VAPID_KEY!,
            },
            gcmAPIKey: "gcmkey",
            TTL: 2419200,
            contentEncoding: "aes128gcm",
            headers: {},
        },
        isAlwaysUseFCM: false,
    });

    push.send(subscription, {
        message,
        image: image || (roomInfo.cover && (process.env.PUBLIC_URL + roomInfo.cover)) || null,
        url: `${process.env.PUBLIC_URL}/room/${roomInfo.id}`,
    } as any).then(result => {
        console.log("ok", result, result?.[0]?.message);
    }).catch(e => {
        console.error(e);
    });

	return json({ ok: true, notificationId });
});
