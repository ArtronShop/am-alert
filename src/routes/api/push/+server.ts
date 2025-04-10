import { json } from '@sveltejs/kit';
import type { RequestEvent, RequestHandler } from './$types';
import { createNotification, getRoomById, getSubscriptionByRoomId  } from '../../../action';
import type { roomsTable } from '../../../db/schema';
import PushNotifications from 'node-pushnotifications';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const tokenDecode = (authorization: string) => {
    if (!authorization?.startsWith("Bearer ")) {
        return null;
    }

    const authToken = authorization?.replace("Bearer ", "");
    
    if (!jwt.verify(authToken, process.env.API_JWT_SECRET!)) {
        return null;
    }

    return jwt.decode(authToken) as any;
}

interface AssetsProps {
    image?: string;
}

export const POST: RequestHandler = async ({ request }) => {
    const authorization = request.headers.get("authorization") || "";
    const authInfo: ({ roomId: number, owner: string } | null) = tokenDecode(authorization);
    if (!authInfo) {
        return json({ error: "invalid token" }, { status: 401 });
    }
    const { roomId } = authInfo;

    const roomInfo = await getRoomById(roomId);
    if (!roomInfo) {
        return json({ error: "room id invalid" }, { status: 404 });
    }
    
    const { message, image }: { message: string; image?: string } = await request.json();
    if (!message) {
        return json({ error: "invalid 'message' object" }, { status: 401 });
    }

    let assets: AssetsProps = {};
    if (image) {
        assets.image = image;
    }

    const notificationId = await createNotification({
        roomId, 
        message, 
        assets
    });

    // Send push notification to user
    const subscription = (await getSubscriptionByRoomId(roomId)).map(a => a.subscription) as PushNotifications.RegistrationId[];

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
        url: `${process.env.PUBLIC_URL}/room/${roomId}`,
    } as any).then(result => {
        console.log("ok", result, result?.[0]?.message);
    }).catch(e => {
        console.error(e);
    });

	return json({ ok: true, roomId, notificationId });
};
