import fastify from 'fastify';
import cors from '@fastify/cors';
import 'dotenv/config';

const server = fastify({
    logger: true,
});

await server.register(cors, { origin: '*' });

server.route({
    method: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    url: '/*',
    handler: (req, res) => {
        const { originalUrl, method, body: data, headers } = req;

        if (originalUrl === '/favicon.ico') {
            return res.status(204).send();
        }

        const [path, queryParams] = req.originalUrl.split('?');
        const serviceKey = path.split('/')[1];

        const paramsObj = {};

        if (queryParams) {
          const params = new URLSearchParams(queryParams);
          for (const [key, value] of params.entries()) {
            paramsObj[key] = value;
          }
        }

        if (serviceKey !== process.env['CART_SERVICE_KEY'] && serviceKey !== process.env['PRODUCT_SERVICE_KEY']) {
            return res.status(502).send({ error: 'Cannot process request' });
          }

        const apiHost = process.env[`${serviceKey}_SERVICE_API`.toUpperCase()];

        let url = `${apiHost}/${serviceKey}s`;

        if(paramsObj.id) {
          url += `/${paramsObj.id}`
        }

        axios({
            url,
            data,
            method,
            headers: { 'Authorization': headers.authorization },
            timeout: 5000,
            responseType: 'json'
        }).then((resp) => {
            const { status, data } = resp;

            res.status(status).send(data);
        }).catch((e) => {
            const status = e?.response ? e?.response.status : 500;
            const data = e?.response ? e?.response.data : 'Internal error ...';

            res.status(status).send(data)
        });
    }
});

try {
    await server.listen({ port: process.env.PORT || 6000,  host: '0.0.0.0' })
} catch (e) {
    server.log.error(e);
    process.exit(1);
}
