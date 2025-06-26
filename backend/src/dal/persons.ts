import { persons } from '@db/schema/person';
import { BaseDAL } from '@dal/index';
import { eq, ilike } from 'drizzle-orm';

export type Person = typeof persons.$inferSelect

class PersonsDAL extends BaseDAL {

    async findById(id: Person['id']) {
        return await this.db.query.persons.findFirst({
            where: eq(persons.id, id)
        })
    }

    async findByCpf(cpf: Person['cpf']) {
        return await this.db.query.persons.findFirst({
            where: eq(persons.cpf, cpf)
        })
    }

    async create({ name, cpf }: Omit<Person, 'id'>) {
        return await this.db.insert(persons).values({
            name, 
            cpf
        }).returning().then(affected => affected.at(0)) as Person
    }

    async update({ id, payload }: { id: Person['id'], payload: Partial<Omit<Person, 'id'>> }) {
        await this.db.update(persons).set(payload).where(eq(persons.id, id))
    }

    async delete(id: Person['id']) {
        await this.db.delete(persons).where(eq(persons.id, id))
    }

    async all() {
        return await this.db.query.persons.findMany({
            with: {
                contacts: true
            }
        })
    }

    async allWithName(name: Person['name']) {
        return await this.db.query.persons.findMany({
            with: {
                contacts: true
            },
            where: ilike(persons.name, `%${name}%`)
        })
    }
}

export const personsDAL = new PersonsDAL();