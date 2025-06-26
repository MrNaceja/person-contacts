import { contactsDAL } from '@dal/contacts';
import { FastifyInstanceWithZod, FastifySchema } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

const schema = {
    params: z.object({
        id: z.coerce.number()
    })
} satisfies FastifySchema

export const selectContactRoute = async (server: FastifyInstanceWithZod) => server.get('/:id', { schema }, async (req, rep) => {
    const { id } = req.params

    const contactWithId = await contactsDAL.findById(id)

    if (!contactWithId) {
        return rep.status(StatusCodes.NOT_FOUND).send({ message: `Não existe um contato para o ID (${id})` })
    }

    return rep.status(StatusCodes.OK).send(contactWithId)
})