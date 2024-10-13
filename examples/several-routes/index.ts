import MainRouter from './routes/index.routes';
import { MaoriPlugin } from '../../index';
import fastify from 'fastify';

const app = fastify({
    ignoreTrailingSlash: true,
});

app.register(MaoriPlugin, {});

app.listen({ port: 3000 }, () => console.log('on'));
