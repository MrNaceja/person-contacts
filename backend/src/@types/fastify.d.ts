import 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { User } from '@dal/users';

declare module "fastify" {
    interface FastifyInstance {
        checkAuthentication: (req: FastifyRequest, rep: FastifyReply) => Promise<void>;
    }

    export interface FastifyInstanceWithZod extends FastifyInstance<
        RawServerDefault,
        RawRequestDefaultExpression,
        RawReplyDefaultExpression,
        FastifyBaseLogger,
        ZodTypeProvider
    > { }
}