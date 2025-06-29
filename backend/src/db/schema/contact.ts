import { integer, pgEnum, pgTable, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { persons } from '@db/schema/person';

export const contactTypeEnum = pgEnum('contact_type', ['phone', 'email'])

export const contacts = pgTable('contacts', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    type: contactTypeEnum().notNull(),
    description: varchar({ length: 255 }).notNull(),
    person: integer('person_id').references(() => persons.id, { onDelete: 'cascade' }).notNull()
})

export const contactsRelationWithPerson = relations(contacts, ({ one }) => ({
    person: one(persons, {
        fields: [contacts.person],
        references: [persons.id]
    })
}))