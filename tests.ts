import { Get } from '@decorators/methods';
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
    @Return(200, z.object({ message: z.string(), cu: z.object({ a: z.boolean() }) }))
    @Get('/test')
    run(@Reply() reply: FastifyReply) {
        return { message: 'Oi', cu: { a: 123 } };
    }
}
