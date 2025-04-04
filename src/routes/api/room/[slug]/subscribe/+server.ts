import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createSubscription, deleteSubscription  } from '../../../../../action';

export const POST: RequestHandler = async ({ params, request }) => {
    const roomId = +params.slug;
    const subscription = await request.json();
    if (!roomId) {
        return json({ error: "room id invalid" }, { status: 404 });
    }

    const subscriptionId = await createSubscription({
        roomId,
        subscription,
    });

	return json({ ok: true, subscriptionId });
}

export const DELETE: RequestHandler = async ({ request }) => {
    const { subscriptionId } = await request.json();

    await deleteSubscription(subscriptionId);

    return json({ ok: true });
}
