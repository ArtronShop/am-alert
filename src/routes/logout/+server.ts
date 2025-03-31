import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, cookies}) => {
    cookies.delete("auth", { path: "/" });

    const goUrl = url.searchParams.get("go") || "/";

    return redirect(302, goUrl);
}
