import fastify from 'fastify';
import cors from '@fastify/cors';
import 'dotenv/config';

const server = fastify({
    logger: true,
});

await server.register(cors, { origin: '*' });

server.route({
    method: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH'],
    url: '/*',
    handler: (req, res) => {
        return {}
  }
});

try {
    await server.listen({ port: process.env.PORT || 6000,  host: '0.0.0.0' })
} catch (e) {
    server.log.error(e);
    process.exit(1);
}
