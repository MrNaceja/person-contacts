import { z } from 'zod'
import type { Contact } from './contact'

export const personFormSchema = z.object({
    name: z.string().nonempty('Nome é obrigatório.'),
    cpf: z.string().nonempty('CPF é obrigatório.')
        .refine(cpf => {
            return cpf.replace(/\D/g, '').length >= 11
        }, 'CPF deve conter 11 caracteres.')
        .refine(cpf => {
            return !!Number(cpf.replace(/\D/g, ''))
        }, 'CPF deve conter apenas números.')
})

export type PersonFormSchema = z.infer<typeof personFormSchema>

export type Person = PersonFormSchema & {
    id: number
}

export type PersonWithContacts = Person & {
    contacts: Contact[]
}