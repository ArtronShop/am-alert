import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq, inArray, desc, and } from 'drizzle-orm';
import { usersTable, roomsTable, subscriptionTable, notificationTable } from './db/schema';

const db = drizzle(process.env.DATABASE_URL!);

// Users
export async function createUser(value: typeof usersTable.$inferInsert) {
    const newRow = await db.insert(usersTable).values(value).returning({ id: usersTable.id });
    
    return newRow[0].id;
}

export async function getUserByEmail(email: string) {
    const rows = await db.select().from(usersTable).where(eq(usersTable.email, email));

    return rows?.[0] || null;
}

export async function getUserById(id: number) {
    const rows = await db.select().from(usersTable).where(eq(usersTable.id, id));

    return rows?.[0] || null;
}

export async function updateUser(id: number, value: typeof usersTable.$inferSelect) {
    await db.update(usersTable).set(value).where(eq(usersTable.id, id));

    return true;
}

// Delete user not support now !

// Room
export async function createRoom(value: typeof roomsTable.$inferInsert) {
    const newRow = await db.insert(roomsTable).values(value).returning({ id: roomsTable.id });
    
    return newRow[0].id;
}

export async function updateRoomToken(roomId: number, token: string) {
    await db.update(roomsTable).set({ token }).where(eq(roomsTable.id, roomId));
    
    return true;
}

export async function getRoomById(roomId: number) {
    const rows = await db.select().from(roomsTable).where(eq(roomsTable.id, roomId));

    return rows?.[0] || null;
}

export async function getRoomsById(roomId: number[]) {
    const rows = await db.select().from(roomsTable).where(inArray(roomsTable.id, roomId));

    return rows;
}

export async function getRoomsByOwner(owner: number) {
    const rows = await db.select().from(roomsTable).where(eq(roomsTable.owner, owner));

    return rows;
}

export async function updateRoom(roomId: number, value: typeof roomsTable.$inferSelect) {
    await db.update(roomsTable).set(value).where(eq(roomsTable.id, roomId));

    return true;
}

export async function deleteRoom(roomId: number) {
    await db.delete(roomsTable).where(eq(roomsTable.id, roomId));

    return true;
}

export async function deleteRoomByIdAndOwner(roomId: number, owner: number) {
    await db.delete(roomsTable).where(and(eq(roomsTable.id, roomId), eq(roomsTable.owner, owner)));

    return true;
}

// Subscription
export async function createSubscription(value: typeof subscriptionTable.$inferInsert) {
    const newRow = await db.insert(subscriptionTable).values(value).returning({ id: subscriptionTable.id });
    
    return newRow[0].id;
}

export async function getSubscriptionByRoomId(roomId: number) {
    const rows = await db.select().from(subscriptionTable).where(eq(subscriptionTable.roomId, roomId));

    return rows;
}

export async function deleteSubscription(id: number) {
    await db.delete(subscriptionTable).where(eq(subscriptionTable.id, id));

    return true;
}

// Notification
export async function createNotification(value: typeof notificationTable.$inferInsert) {
    const newRow = await db.insert(notificationTable).values(value).returning({ id: notificationTable.id });
    
    return newRow[0].id;
}

export async function getNotificationsByRoomId(roomId: number) {
    const rows = await db.select().from(notificationTable).where(eq(notificationTable.roomId, roomId));

    return rows;
}

export async function getLastNotificationsByRoomId(roomId: number) {
    const rows = await db.select().from(notificationTable).where(eq(notificationTable.roomId, roomId)).orderBy(desc(notificationTable.createAt)).limit(1);

    return rows?.[0] || null;
}

export async function deleteNotificationByRoomId(roomId: number) {
    await db.delete(notificationTable).where(eq(notificationTable.roomId, roomId));

    return true;
}

export async function deleteNotification(id: number) {
    await db.delete(notificationTable).where(eq(notificationTable.id, id));

    return true;
}

// TODO: Add delete notification over 3 month

