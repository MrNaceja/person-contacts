import { contactsDAL } from '@dal/contacts';
import { contactTypeEnum } from '@db/schema/contact';
import { FastifyInstanceWithZod, FastifySchema } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

const schema = {
    body: z.object({
        type: z.enum(contactTypeEnum.enumValues).optional(),
        description: z.string().optional()
    }),
    params: z.object({
        id: z.coerce.number()
    })
} satisfies FastifySchema

export const updateContactRoute = async (server: FastifyInstanceWithZod) => server.put('/:id', { schema }, async (req, rep) => {
    const { id } = req.params

    const payload = req.body

    if ( payload.type && !payload.description ) {
        return rep.status(StatusCodes.BAD_REQUEST).send({ message: "Para atualizar um contato deve-se também atualizar sua descrição." })
    }

    const contactWithId = await contactsDAL.findById(id)

    if (!contactWithId) {
        return rep.status(StatusCodes.NOT_FOUND).send({ message: `Não existe um contato para o ID (${id})` })
    }

    await contactsDAL.update({ id, payload })

    return rep.status(StatusCodes.NO_CONTENT).send()

})