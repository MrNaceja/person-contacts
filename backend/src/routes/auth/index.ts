import { FastifyInstanceWithZod } from 'fastify'
import { signInRoute } from '@routes/auth/sign-in.route'
import { signUpRoute } from '@routes/auth/sign-up.route'

export const authRoutes = async (server: FastifyInstanceWithZod) => {
    await server.register(signInRoute)
    await server.register(signUpRoute)
}