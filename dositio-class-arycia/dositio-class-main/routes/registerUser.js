/** 
 * @type {import('fastify').FastifyPluginAsync<{}>} 
 */
import auth from './auth.js';

export default async function registerUser(app, options) {
    const registerUserCollection = app.mongo.db.collection('registerUser');

    app.get('/registerUser', {
        config: {
            logMe: true,
            requireAuthentication: true
        }
    }, async (request, reply) => {
        try {
            const users = await registerUserCollection.find().toArray();
            return users;
        } catch (error) {
            reply.status(500).send({ error: 'Internal Server Error' });
        }
    });

    // Rota para registrar um novo usuário
    app.post('/registerUser', {
        schema: {
            body: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    username: { type: 'string' },
                },
                required: ['username', 'password']
            }
        },
        config: {
            requireAuthentication: false 
        }
    }, async (request, reply) => {
        try {
            const newUser = request.body;
            const result = await registerUserCollection.insertOne(newUser);
            reply.code(201).send(); // Retorna 201 Created
        } catch (error) {
            reply.status(500).send({ error: 'Internal Server Error' });
        }
    });
}
