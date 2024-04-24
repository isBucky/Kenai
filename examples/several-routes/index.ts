import MainRouter from './routes/index.routes';
import { LoadRoutes } from 'kenai';
import fastify from 'fastify';

const app = fastify({
    ignoreTrailingSlash: true,
});

LoadRoutes({
    app,
    mainRoute: MainRouter,
}).then(() => {
    app.listen({ port: 3000 }, () => console.log('on'));
});
