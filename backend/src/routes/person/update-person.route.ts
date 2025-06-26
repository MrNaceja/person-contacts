import { personsDAL } from '@dal/persons';
import { FastifyInstanceWithZod, FastifySchema } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

const schema = {
    body: z.object({
        name: z.string().optional(),
        cpf: z.string().length(14).optional()
    }),
    params: z.object({
        id: z.coerce.number()
    })
} satisfies FastifySchema

export const updatePersonRoute = async (server: FastifyInstanceWithZod) => server.put('/:id', { schema }, async (req, rep) => {
    const { id } = req.params

    const personWithId = await personsDAL.findById(id)

    if ( !personWithId ) {
        return rep.status(StatusCodes.NOT_FOUND).send({ message: `Não existe uma pessoa para o ID (${id})` })
    }

    await personsDAL.update({ id, payload: req.body })

    return rep.status(StatusCodes.NO_CONTENT).send()

})