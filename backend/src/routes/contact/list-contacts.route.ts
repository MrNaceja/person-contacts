import { contactsDAL } from '@dal/contacts';
import { FastifyInstanceWithZod } from 'fastify';
import { StatusCodes } from 'http-status-codes';

export const listContactsRoute = async (server: FastifyInstanceWithZod) => server.get('/', async (req, rep) => {
    const allContacts = await contactsDAL.all()
    return rep.status(StatusCodes.OK).send(allContacts)
})