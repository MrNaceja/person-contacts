import { personsDAL } from '@dal/persons';
import { FastifyInstanceWithZod, FastifySchema } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

const schema = {
    body: z.object({
        name: z.string(),
        cpf: z.string().length(14)
    })
} satisfies FastifySchema

export const createPersonRoute = async (server: FastifyInstanceWithZod) => server.post('/', { schema }, async (req, rep) => {
    const { name, cpf } = req.body

    const personWithCpf = await personsDAL.findByCpf(cpf)

    if ( personWithCpf ) {
        return rep.status(StatusCodes.CONFLICT).send({ message: "Já existe uma pessoa cadastrada com este CPF." })
    }

    const personCreated = await personsDAL.create({ name, cpf })

    return rep.status(StatusCodes.CREATED).send({ id: personCreated.id })
})