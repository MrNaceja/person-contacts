import { contactsDAL } from '@dal/contacts';
import { personsDAL } from '@dal/persons';
import { contactTypeEnum } from '@db/schema/contact';
import { FastifyInstanceWithZod, FastifySchema } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

const schema = {
    body: z.object({
        type: z.enum(contactTypeEnum.enumValues),
        description: z.string(),
        personId: z.number()
    })
} satisfies FastifySchema

export const createContactRoute = async (server: FastifyInstanceWithZod) => server.post('/', { schema }, async (req, rep) => {
    const { type, description, personId } = req.body

    const personWithId = await personsDAL.findById(personId)

    if (!personWithId) {
        return rep.status(StatusCodes.NOT_FOUND).send({ message: `Não existe uma pessoa para o ID (${personId})` })
    }

    const contactCreated = await contactsDAL.create({ type, description, person: personId })

    return rep.status(StatusCodes.CREATED).send({ id: contactCreated.id })
})