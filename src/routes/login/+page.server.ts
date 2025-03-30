import { signIn } from '../../auth';
import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
    default: async ({ cookies, request }) => {
        const data = await request.formData();
        const email = (data.get('email') || "") as string;
        const password = (data.get('password') || "") as string;
        const remember = Boolean(data.get('remember'));

        const token = await signIn(email, password);
        if (!token) {
            return fail(400, { incorrect: true });
        }

        let expires = new Date(Date.now() + 60 * 60 * 1000); // Default 1 hour
        if (remember) {
            expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // Default 1 year
        }

        cookies.set("auth", token, {
            path: "/",
            expires,
        });

        redirect(303, "/");

        return { success: true };
    }
} satisfies Actions;
