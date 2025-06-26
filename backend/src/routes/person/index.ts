import { FastifyInstanceWithZod } from 'fastify'
import { createPersonRoute } from '@routes/person/create-person.route'
import { listPersonsRoute } from '@routes/person/list-persons.route'
import { selectPersonRoute } from '@routes/person/select-person.route'
import { deletePersonRoute } from '@routes/person/delete-person.route'
import { updatePersonRoute } from '@routes/person/update-person.route'

export const personRoutes = async (server: FastifyInstanceWithZod) => {
    server.addHook('preHandler', server.checkAuthentication);

    await server.register(createPersonRoute)
    await server.register(selectPersonRoute)
    await server.register(listPersonsRoute)
    await server.register(deletePersonRoute)
    await server.register(updatePersonRoute)
}