import { personsDAL } from '@dal/persons';
import { FastifyInstanceWithZod, FastifySchema } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

const schema = {
    querystring: z.object({
        name: z.string().optional()
    })
} satisfies FastifySchema

export const listPersonsRoute = async (server: FastifyInstanceWithZod) => server.get('/', { schema }, async (req, rep) => {
    const { name } = req.query

    if ( name ) {
        const personsWithName = await personsDAL.allWithName(name)
        return rep.status(StatusCodes.OK).send(personsWithName)
    }

    const allPersons = await personsDAL.all()
    return rep.status(StatusCodes.OK).send(allPersons)
})