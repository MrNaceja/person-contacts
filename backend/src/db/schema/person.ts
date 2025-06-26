import { relations } from 'drizzle-orm';
import { integer, pgTable, varchar } from 'drizzle-orm/pg-core';
import { contacts } from '@db/schema/contact';

export const persons = pgTable('persons', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    cpf: varchar({ length: 14 }).unique().notNull()
})

export const personsRelationWithContacts = relations(persons, ({ many }) => ({
    contacts: many(contacts)
}))