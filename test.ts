import MainRouter from 'tests';
import Fastify from 'fastify';
import { MaoriPlugin } from '@builders/plugin';
import { inspect } from 'util';

const fastify = Fastify();

fastify.register(MaoriPlugin, { mainRoute: MainRouter });

fastify.addHook('onRoute', (route) => console.log(inspect(route, { depth: 10 })));

fastify.listen({ port: 3e3 }, (err) => {
    if (err) return console.log(err);

    console.log(fastify.printRoutes());
    console.log('listen');
});
