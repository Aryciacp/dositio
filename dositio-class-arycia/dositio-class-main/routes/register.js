/** 
 * @typedef {import('fastify').FastifyInstance} FastifyInstance 
 */

import auth from './auth.js';

/**
 * Registra o plugin de registro de usuários.
 * @param {FastifyInstance} app - Instância do Fastify.
 * @param {*} options - Opções do plugin (não utilizadas neste exemplo).
 */
export default async function register(app, options) {
    // Coleção de usuários
    const users = app.mongo.db.collection('users');

    // Rota para registro de usuário
    app.post('/register', { schema: userSchema, config: { requireAuthentication: false } }, async (request, reply) => {
        await registerUser(users, request.body);
        return reply.code(201).send();
    });
}

/**
 * Esquema de validação para o corpo da solicitação do registro de usuário.
 */
const userSchema = {
    body: {
        type: 'object',
        properties: {
            username: { type: 'string' },
            password: { type: 'string' } // Você pode adicionar validação adicional aqui, como criptografar a senha
        },
        required: ['username', 'password']
    }
};

/**
 * Registra um novo usuário.
 * @param {*} users - Coleção de usuários.
 * @param {*} userData - Dados do usuário a serem registrados.
 * @returns {Promise<void>} - Nenhum valor de retorno.
 */
async function registerUser(users, userData) {
    await users.insertOne(userData);
}
