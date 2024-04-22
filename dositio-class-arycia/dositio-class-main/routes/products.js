/** 
 * @typedef {import('fastify').FastifyInstance} FastifyInstance 
 */

import createError from '@fastify/error';
import { config } from 'dotenv';

/**
 * Inicializa o plugin de produtos.
 * @param {FastifyInstance} app - Instância do Fastify.
 * @param {*} options - Opções do plugin (não utilizadas neste exemplo).
 */
export default async function products(app, options) {
    // Middleware para criar um erro personalizado para produtos inválidos
    const InvalidProductError = createError('InvalidProductError', 'Produto Inválido.', 400);

    // Coleção de produtos
    const products = app.mongo.db.collection('products');

    // Rotas para manipulação de produtos

    // Obter todos os produtos
    app.get('/products', { config: { requireAuthentication: true } }, async (request, reply) => {
        return await getAllProducts(products);
    });

    // Adicionar um novo produto
    app.post('/products', { schema: productSchema, config: { requireAuthentication: true } }, async (request, reply) => {
        return await addProduct(products, request.body);
    });

    // Obter um produto por ID
    app.get('/products/:id', async (request, reply) => {
        return await getProductById(products, request.params.id, app.mongo.ObjectId);
    });

    // Excluir um produto por ID
    app.delete('/products/:id', { config: { requireAuthentication: true } }, async (request, reply) => {
        return await deleteProductById(products, request.params.id, app.mongo.ObjectId);
    });

    // Atualizar um produto por ID
    app.put('/products/:id', { config: { requireAuthentication: true } }, async (request, reply) => {
        return await updateProductById(products, request.params.id, request.body, app.mongo.ObjectId);
    });
}

/**
 * Obtém todos os produtos.
 * @param {*} products - Coleção de produtos.
 * @returns {Promise<Array>} - Lista de produtos.
 */
async function getAllProducts(products) {
    return await products.find().toArray();
}

/**
 * Adiciona um novo produto.
 * @param {*} products - Coleção de produtos.
 * @param {*} productData - Dados do produto a ser adicionado.
 * @returns {Promise<void>} - Nenhum valor de retorno.
 */
async function addProduct(products, productData) {
    await products.insertOne(productData);
}

/**
 * Obtém um produto pelo seu ID.
 * @param {*} products - Coleção de produtos.
 * @param {string} productId - ID do produto a ser obtido.
 * @param {Function} ObjectId - Função construtora para ObjectId.
 * @returns {Promise<Object|null>} - Produto encontrado ou null.
 */
async function getProductById(products, productId, ObjectId) {
    return await products.findOne({ _id: new ObjectId(productId) });
}

/**
 * Exclui um produto pelo seu ID.
 * @param {*} products - Coleção de produtos.
 * @param {string} productId - ID do produto a ser excluído.
 * @param {Function} ObjectId - Função construtora para ObjectId.
 * @returns {Promise<void>} - Nenhum valor de retorno.
 */
async function deleteProductById(products, productId, ObjectId) {
    await products.deleteOne({ _id: new ObjectId(productId) });
}

/**
 * Atualiza um produto pelo seu ID.
 * @param {*} products - Coleção de produtos.
 * @param {string} productId - ID do produto a ser atualizado.
 * @param {*} productData - Novos dados do produto.
 * @param {Function} ObjectId - Função construtora para ObjectId.
 * @returns {Promise<void>} - Nenhum valor de retorno.
 */
async function updateProductById(products, productId, productData, ObjectId) {
    await products.updateOne({ _id: new ObjectId(productId) }, { $set: productData });
}
