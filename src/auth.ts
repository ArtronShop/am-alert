import 'dotenv/config';
import bcrypt from "bcrypt";
import { createRoom, createUser, getUserByEmail } from "./action";
import jwt from "jsonwebtoken";

const JWT_SECRET: string = process.env.JWT_SECRET!;

async function hashPassword(password: string) {
    const saltRounds = 10; // Higher = more secure but slower
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

async function verifyPassword(plainPassword: string, hashedPassword: string) {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
}

export const signUp = async (email: string, password: string, name: string) => {
    const passwordHash = await hashPassword(password);
    const userId = await createUser({ email, password: passwordHash, name });
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1y" });

    return token;
}

export const signIn = async (email: string, password: string) => {
    const userInfo = await getUserByEmail(email);
    if (!userInfo) {
        return null;
    }

    if (!verifyPassword(password, userInfo.password)) {
        return null;
    }

    const token = jwt.sign({ userId: userInfo.id }, JWT_SECRET, { expiresIn: "1y" });

    return token;
}

export const verifyToken = async (token: string) => {
    try {
        const payload = jwt.verify(token, JWT_SECRET) as any;
        return payload;
    } catch(e) {
        console.warn("JWT verify fail", e);
    }

    return null;
}
