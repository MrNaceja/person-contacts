import { FastifyRequest, FastifyReply } from 'fastify'
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { StatusCodes } from 'http-status-codes'
import { authRoutes } from '@routes/auth'
import { personRoutes } from '@routes/person'
import { contactRoutes } from '@routes/contact'

export const routes: FastifyPluginAsyncZod = async (server) => {
    server.decorate('checkAuthentication', async (req: FastifyRequest, rep: FastifyReply) => {
        try {
            await req.jwtVerify()
        } catch (err) {
            return rep.status(StatusCodes.UNAUTHORIZED).send({ message: 'Token inválido ou ausente.' })
        }
    })
    await server.register(authRoutes, { prefix: '/auth' })
    await server.register(personRoutes, { prefix: '/person' })
    await server.register(contactRoutes, { prefix: '/contact' })
}