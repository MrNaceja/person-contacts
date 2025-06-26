import '@fastify/jwt'
import { User } from '@dal/users'

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: User
    user: User
  }
}