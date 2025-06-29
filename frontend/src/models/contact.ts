import { z } from 'zod';
import type { Person } from '@/models/person';

const phoneRegex = new RegExp(
    /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

export const contactTypeSchema = z.enum(['phone', 'email'], { required_error: 'Tipo é obrigatório.' })

export const contactSchema = z.discriminatedUnion('type', [
    z.object({
        personId: z.coerce.number({ required_error: 'Informe uma pessoa para este contato.' }),
        type: z.literal('phone'),
        description: z.string().regex(phoneRegex, 'Número inválido.').nonempty('Telefone é obrigatório.')
    }),
    z.object({
        personId: z.coerce.number({ required_error: 'Informe uma pessoa para este contato.' }),
        type: z.literal('email'),
        description: z.string().email('Email inválido.').nonempty('Email é obrigatório.')
    })
])

export type ContactFormSchema = z.infer<typeof contactSchema>

export type Contact = Omit<ContactFormSchema, 'personId'> & {
    id: number,
    person: number
}

export type ContactWithPerson = Omit<Contact, 'person'> & {
    person: Person
}