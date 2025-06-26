import { pgTable, varchar, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: uuid().primaryKey().defaultRandom(),
    email: varchar({ length: 255 }).notNull().unique(),
    password: varchar({ length: 255 }).notNull()
})