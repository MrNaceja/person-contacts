import { usersDAL } from '@dal/users';
import { FastifyInstanceWithZod, FastifySchema } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import bcrypt from 'bcrypt'

const schema = {
    body: z.object({
        email: z.string().email(),
        password: z.string().min(6),
    })
} satisfies FastifySchema

export const signInRoute = async (server: FastifyInstanceWithZod) => server.post('/sign-in', { schema }, async (req, rep) => {
    const { email, password } = req.body

    const userWithEmail = await usersDAL.findByEmail(email)

    if ( !userWithEmail ) {
        return rep.status(StatusCodes.UNAUTHORIZED).send({ message: 'Credenciais inválidas.' })
    }

    const isSamePassword = await bcrypt.compare(password, userWithEmail.password)

    if ( !isSamePassword) {
        return rep.status(StatusCodes.UNAUTHORIZED).send({ message: 'Credenciais inválidas.' })
    }

    const authToken = server.jwt.sign({...userWithEmail}, { expiresIn: '1d' })

    return rep.status(StatusCodes.OK).send({ user: userWithEmail, token: authToken })

})