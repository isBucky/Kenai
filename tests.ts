import { Get, Post } from '@decorators/methods';
import {
    BodySchema,
    Deprecated,
    Description,
    Hide,
    Middlewares,
    QuerySchema,
    Return,
    Router,
    Summary,
} from './';
import { Reply } from '@decorators/params';
import { type FastifyReply } from 'fastify';
import { z } from 'zod';

@Router()
export default class MainRouter {
    @BodySchema(z.object({ a: z.string() }))
    @Return(200, z.object({ message: z.string(), cu: z.object({ a: z.boolean() }) }))
    @Post('/test')
    run(@Reply() reply: FastifyReply) {
        return { message: 'Oi', cu: { a: true } };
    }
}
