import { contacts } from '@db/schema/contact';
import { BaseDAL } from '@dal/index';
import { eq } from 'drizzle-orm';

export type Contact = typeof contacts.$inferSelect

class ContactsDAL extends BaseDAL {

    async findById(id: Contact['id']) {
        return await this.db.query.contacts.findFirst({
            where: eq(contacts.id, id)
        })
    }

    async create({ type, description, person }: Omit<Contact, 'id'>) {
        return await this.db.insert(contacts).values({
            type, 
            description, 
            person
        }).returning().then(affected => affected.at(0)) as Contact
    }

    async all() {
        return await this.db.query.contacts.findMany({
            with: {
                person: true
            }
        })
    }

    async update({ id, payload }: { id: Contact['id'], payload: Partial<Omit<Contact, 'id'>> }) {
        await this.db.update(contacts).set(payload).where(eq(contacts.id, id))
    }

    async delete(id: Contact['id']) {
        await this.db.delete(contacts).where(eq(contacts.id, id))
    }

}

export const contactsDAL = new ContactsDAL();