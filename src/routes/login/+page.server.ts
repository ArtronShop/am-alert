import { signIn, signUp } from '../../auth';
import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
    login: async ({ cookies, request }) => {
        const data = await request.formData();
        const email = (data.get('email') || "") as string;
        const password = (data.get('password') || "") as string;
        const remember = Boolean(data.get('remember'));

        const token = await signIn(email, password);
        if (!token) {
            return fail(400, { incorrect: "อีเมล์หรือรหัสผ่านไม่ถูกต้อง" });
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
    },
    register: async ({ cookies, request }) => {
        const data = await request.formData();
        const email = (data.get('email') || "") as string;
        const password = (data.get('password') || "") as string;
        const re_password = (data.get('re-password') || "") as string;
        const name = (data.get('name') || "") as string;

        if (password !== re_password) {
            return fail(400, { incorrect: "รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน" });
        }

        const token = await signUp(email, password, name);

        cookies.set("auth", token, {
            path: "/"
        });

        redirect(303, "/");

        return { success: true };
    }
} satisfies Actions;
