import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { createRoom, updateRoomToken } from '../../../action';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

export const load: PageServerLoad = async ({ url, locals }) => {
    const { userInfo } = locals;
    if (!userInfo) {
        throw redirect(302, "/login?go=" + encodeURIComponent(url.toString()));
    }

    return { };
};


export const actions = {
    default: async ({ request, locals }) => {
        const { userInfo } = locals;
        if (!userInfo) {
            redirect(302, "/login");
        }

        const data = await request.formData();

        const name = (data.get('room-name') || "") as string;
        if (!name) {
            return fail(400, { incorrect: "name can't empty" });
        }

        let coverPath: string | null = null;
        const coverFile = data.get('cover-image') as File;
        if (coverFile) {
            // ✅ Allowed file types
            const allowedTypes = ['image/png', 'image/jpeg', 'image/gif'];
            const allowedExtensions = ['.png', '.jpg', '.jpeg', '.gif'];

            // Get MIME type and extension
            const fileType = coverFile.type; // MIME type (e.g., image/png)
            const fileExtension = path.extname(coverFile.name).toLowerCase(); // File extension

            // Check file size: 1MB = 1 * 1024 * 1024 bytes
            const MAX_SIZE = 1 * 1024 * 1024; // 1MB

            // ❌ Reject if file exceeds size limit
            if (coverFile.size > MAX_SIZE) {
                return fail(400, { incorrect: "File size exceeds 1MB. Please upload a smaller file." });
            }

            // ❌ Reject if not in allowed types
            if (!allowedTypes.includes(fileType) || !allowedExtensions.includes(fileExtension)) {
                return fail(400, { incorrect: "Invalid file type. Only .gif, .png, .jpg files are allowed." });
            }

            // ✅ Generate random filename
            const randomName = crypto.randomBytes(16).toString("hex");
            const fileName = `${randomName}${fileExtension}`;
            const filePath = path.join("static/uploads", fileName);

            // Save file to disk
            const arrayBuffer = await coverFile.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            await fs.writeFile(filePath, buffer);

            coverPath = "/uploads/" + fileName;
        }

        const roomId = await createRoom({ 
            name,
            cover: coverPath, 
            token: null,
            owner: userInfo.id
        });

        const token = jwt.sign({ roomId, owner: userInfo.email }, process.env.API_JWT_SECRET!);

        await updateRoomToken(roomId, token);

        redirect(302, "/room/" + roomId);

        return { success: true };
    }
} satisfies Actions;
