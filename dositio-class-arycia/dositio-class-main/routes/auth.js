import { ACCESS_UNAUTHORIZED } from '../libs/errors.js';

/** 
 * @type {import('fastify').FastifyPluginAsync<{}>} 
 */
export default async function auth(app, options) {
    const registerUser = app.mongo.db.collection('registerUser');

    app.post('/auth', {
        schema: {
            body: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    username: { type: 'string' },
                    password: { type: 'string' }
                },
                required: ['id', 'username', 'password']
            }
        }
    }, async (request, reply) => {
        try {
            const { id, username, password } = request.body;

            const user = await registerUser.findOne({ id, username });

            if (!user || user.password !== password) {
                throw new ACCESS_UNAUTHORIZED();
            }

            request.log.info(`Login for user ${username}`);
            delete user.password;

            const token = app.jwt.sign(user);
            return { 'x-access-token': token };
        } catch (error) {
            throw new ACCESS_UNAUTHORIZED();
        }
    });
}
