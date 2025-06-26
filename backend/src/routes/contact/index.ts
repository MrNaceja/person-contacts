import { FastifyInstanceWithZod } from 'fastify'
import { selectContactRoute } from '@routes/contact/select-contact.route'
import { createContactRoute } from '@routes/contact/create-contact.route'
import { deleteContactRoute } from '@routes/contact/delete-contact.route'
import { updateContactRoute } from '@routes/contact/update-contact.route'

export const contactRoutes = async (server: FastifyInstanceWithZod) => {
    server.addHook('preHandler', server.checkAuthentication);
    
    await server.register(selectContactRoute)
    await server.register(createContactRoute)
    await server.register(deleteContactRoute)
    await server.register(updateContactRoute)
}