/** 
 * @type{import('fastify').FastifyPluginAsync<>}
 */

// Importação do módulo de manipulação de produtos
import products from './products.js';

/**
 * Função que define o plugin de manipulação de categorias.
 * @param {import('fastify').FastifyInstance} app - Instância do Fastify.
 * @param {*} options - Opções do plugin (não utilizadas neste exemplo).
 */
export default async function categories(app, options) {
    // Coleção de categorias
    const categories = app.mongo.db.collection('categories');
    // Coleção de produtos
    const products = app.mongo.db.collection('products');

    // Rota para obter todas as categorias
    app.get('/categories', {   
        config: {
            // Habilita o registro de informações relacionadas a esta rota
            logMe: true,
            // Exige autenticação para acessar esta rota
            requireAuthentication: true
        }
    }, async (request, reply) => {
        // Registra informações relacionadas às categorias no log
        request.log.info(categories);
        // Retorna todas as categorias
        return await categories.find().toArray();
    });

    // Rota para criar uma nova categoria
    app.post('/categories', {
        schema: {
            // Define o esquema de validação para o corpo da solicitação
            body: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    name: { type: 'string' },
                    img_url: {type: 'string'}
                },
                // Define os campos obrigatórios
                required: ['name', 'img_url']
            }
        },
        config: {
            // Exige autenticação para acessar esta rota
            requireAuthentication: true,
            // Verifica se o usuário é um administrador antes de permitir o acesso
            checkAdmin: true
        }
    }, async (request, reply) => {
        // Extrai os dados da categoria do corpo da solicitação
        let category = request.body;
        // Insere a nova categoria no banco de dados
        let result = await categories.insertOne(category);
        // Registra a inclusão da categoria no log
        request.log.info(`Including category ${category.name}.`);
        // Retorna uma resposta indicando sucesso
        return reply.code(201).send();
    });

    // Rota para obter todos os produtos de uma categoria específica
    app.get('/categories/:id/products', async (request, reply) => {
        // Obtém o ID da categoria da solicitação
        let id = request.params.id;
        // Encontra a categoria pelo ID
        let category = await categories.findOne({_id: new app.mongo.ObjectId(id)});
        // Obtém o nome da categoria
        let categoryName = category.name;
        // Encontra todos os produtos da categoria pelo nome da categoria
        let productsCategory = await products.find({category: categoryName}).toArray();
        // Retorna os produtos da categoria
        return productsCategory; 
    });

    // Rota para obter uma categoria específica pelo ID
    app.get('/categories/:id', async (request, reply) => {
        // Obtém o ID da categoria da solicitação
        let id = request.params.id;
        // Encontra a categoria pelo ID e a retorna
        return await categories.findOne({_id: new app.mongo.ObjectId(id)});
    });

    // Rota para excluir uma categoria pelo ID
    app.delete('/categories/:id', {
        config: {
            // Exige autenticação para acessar esta rota
            requireAuthentication: true
        }
    }, async (request, reply) => {
        // Obtém o ID da categoria da solicitação
        let id = request.params.id;
        // Exclui a categoria pelo ID
        await categories.deleteOne({_id: new app.mongo.ObjectId(id)});
        // Retorna uma resposta indicando sucesso
        return reply.code(204).send();
    });

    // Rota para atualizar uma categoria pelo ID
    app.put('/categories/:id', {
        config: {
            // Exige autenticação para acessar esta rota
            requireAuthentication: true
        }
    }, async (request,reply) => {
        // Obtém o ID da categoria da solicitação
        let id = request.params.id;
        // Obtém os novos dados da categoria do corpo da solicitação
        let category = request.body;
        // Atualiza a categoria pelo ID com os novos dados
        await categories.updateOne({_id: new app.mongo.ObjectId(id)}, {
            $set:{
                name: category.name,
                img_url: category.img_url
            }
        });
        // Retorna uma resposta indicando sucesso
        return reply.code(204).send();
    });
};

