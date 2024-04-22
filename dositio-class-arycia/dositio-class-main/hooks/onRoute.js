import { checkExistence, extractUser, logMe, uniqueUser } from './functions/index.js';

/** 
 * @type {import('fastify').FastifyPluginAsync<{}>} 
 */
export default async function onRouteHook(app, options) {
    app.addHook('onRoute', (routeOptions) => {
        // Verifica se onRequest e preHandler são arrays, se não, converte para array vazio
        routeOptions.onRequest = Array.isArray(routeOptions.onRequest) ? routeOptions.onRequest : [];
        routeOptions.preHandler = Array.isArray(routeOptions.preHandler) ? routeOptions.preHandler : [];

        // Adiciona o middleware logMe se a rota solicitar log
        if (routeOptions.config?.logMe) {
            routeOptions.onRequest.push(logMe(app));
        }

        // Adiciona o middleware extractUser se a rota exigir autenticação
        if (routeOptions.config?.requireAuthentication) {
            routeOptions.onRequest.push(extractUser(app));
        }

        // Adiciona o middleware checkExistence se a rota for POST /products
        if (routeOptions.url === '/products' && routeOptions.method === 'POST') {
            routeOptions.preHandler.push(checkExistence(app));
        }

        // Adiciona o middleware uniqueUser se a rota for POST /registerUser
        if (routeOptions.url === '/registerUser' && routeOptions.method === 'POST') {
            routeOptions.preHandler.push(uniqueUser(app));
        }
    });
}

