import { contactsDAL } from '@dal/contacts';
import { FastifyInstanceWithZod, FastifySchema } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

const schema = {
    params: z.object({
        id: z.coerce.number()
    })
} satisfies FastifySchema

export const deleteContactRoute = async (server: FastifyInstanceWithZod) => server.delete('/:id', { schema }, async (req, rep) => {
    const { id } = req.params

    const contactWithId = await contactsDAL.findById(id)

    if ( !contactWithId ) {
        return rep.status(StatusCodes.NOT_FOUND).send({ message: `Não existe um contato para o ID (${id})` })
    }

    await contactsDAL.delete(id)

    return rep.status(StatusCodes.NO_CONTENT).send()

})