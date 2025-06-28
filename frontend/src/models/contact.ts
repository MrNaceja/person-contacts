import { z } from 'zod';

export const contactSchema = z.object({
    type: z.enum([ 'phone', 'email' ]),
    description: z.string(),
    person: z.number() 
})

export type Contact = z.infer<typeof contactSchema> & {
    id: number
}