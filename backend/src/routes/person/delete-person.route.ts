import { personsDAL } from '@dal/persons';
import { FastifyInstanceWithZod, FastifySchema } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

const schema = {
    params: z.object({
        id: z.coerce.number()
    })
} satisfies FastifySchema

export const deletePersonRoute = async (server: FastifyInstanceWithZod) => server.delete('/:id', { schema }, async (req, rep) => {
    const { id } = req.params

    const personWithId = await personsDAL.findById(id)

    if ( !personWithId ) {
        return rep.status(StatusCodes.NOT_FOUND).send({ message: `Não existe uma pessoa para o ID (${id})` })
    }

    await personsDAL.delete(id)

    return rep.status(StatusCodes.NO_CONTENT).send()

})