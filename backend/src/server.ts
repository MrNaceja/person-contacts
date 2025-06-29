import '@config/env'
import fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod'
import { routes } from '@routes/index'

const server = fastify().withTypeProvider<ZodTypeProvider>()

server
    .setValidatorCompiler(validatorCompiler)
    .setSerializerCompiler(serializerCompiler)

server
    .register(routes)
    .register(cors, { origin: '*', methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS' })
    .register(jwt, {
        secret: process.env.JWT_SECRET
    })

server.listen({ port: process.env.PORT, host: '0.0.0.0' }, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.info(`Servidor no ar 🚀 - Acesse: ${address}`)
    console.info(server.printRoutes())
})