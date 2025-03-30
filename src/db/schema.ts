import { integer, pgTable, varchar, json, timestamp, text } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    email: varchar({ length: 255 }).notNull().unique(),
    password: varchar({ length: 72 }).notNull(),
    name: varchar({ length: 255 }),
});

export const roomsTable = pgTable("rooms", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 30 }).notNull(),
    cover: varchar({ length: 500 }),
    owner: integer().notNull().references(() => usersTable.id, { onDelete: "cascade" }),
    token: varchar({ length: 255 }),
});

export const subscriptionTable = pgTable("subscription", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    roomId: integer().notNull().references(() => roomsTable.id, { onDelete: "cascade" }),
    subscription: json(),
    expire: timestamp()
});

export const notificationTable = pgTable("notification", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    roomId: integer().notNull().references(() => roomsTable.id, { onDelete: "cascade" }),
    message: text(),
    assets: json(),
    createAt: timestamp().defaultNow(),
});

