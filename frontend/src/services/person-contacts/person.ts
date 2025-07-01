import type { Person, PersonFormSchema, PersonWithContacts } from '@/models/person';
import { api } from '@/services/person-contacts/api';
import { queryOptions } from '@tanstack/react-query'

export const PersonService = {
    async delete(id: Person['id']) {
        await api.delete(`/person/${id}`)
    },
    async create(newPerson: PersonFormSchema) {
        await api.post('/person', newPerson)
    },
    async all(name?: Person['name']) {
        const result = await api.get<PersonWithContacts[]>('/person', {
            params: {
                name
            }
        })
        return result.data
    },
    async edit(id: Person['id'], payload: Partial<Omit<Person, 'id'>>) {
        await api.put(`/person/${id}`, payload)
    }
}

export const personsQuery = (searchName?: string) => queryOptions({
    queryKey: ['persons'],
    async queryFn() {
        return PersonService.all(searchName)
    }
})