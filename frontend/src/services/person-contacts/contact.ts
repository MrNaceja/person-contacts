import type { Contact, ContactFormSchema, ContactWithPerson } from '@/models/contact';
import { api } from '@/services/person-contacts/api';
import { queryOptions } from '@tanstack/react-query';

export const ContactService = {
    async delete(id: Contact['id']) {
        await api.delete(`/contact/${id}`)
    },
    async create(newContact: ContactFormSchema) {
        await api.post('/contact', newContact)
    },
    async edit(id: Contact['id'], payload: Partial<Omit<Contact, 'id'>>) {
        await api.put(`/contact/${id}`, payload)
    },
    async all() {
        const result = await api.get<ContactWithPerson[]>('/contact')
        return result.data
    }
}

export const contactsQuery = () => queryOptions({
    queryKey: ['contacts'],
    async queryFn() {
        return ContactService.all()
    },
})