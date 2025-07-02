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

export const signUpRoute = async (server: FastifyInstanceWithZod) => server.post('/sign-up', { schema }, async (req, rep) => {
    const { email, password } = req.body
    
    const userWithEmail = await usersDAL.findByEmail(email)

    if ( userWithEmail ) {
        return rep.status(StatusCodes.CONFLICT).send({ message: 'Já existe um usuário cadastrado com este email.' })
    }

    const hashedPassword = bcrypt.hashSync(password, 10)

    const userCreated = await usersDAL.create({ email, password: hashedPassword })

    const authToken = server.jwt.sign({...userCreated}, { expiresIn: '1d' })

    return rep.status(StatusCodes.CREATED).send({ user: userCreated, token: authToken })
})