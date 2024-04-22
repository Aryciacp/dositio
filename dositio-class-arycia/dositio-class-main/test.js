import { test, describe } from 'node:test';
import assert from 'node:assert'; 
import { build, options } from './app.js';

describe('### Tests for Server Configuration', async () => {
    test('Basic Server', async () => {
        const app = await build();

        await app.close(); 

        assert.deepStrictEqual(options.stage, 'test'); 
        assert.strictEqual(options.port, '3000');
        assert.strictEqual(options.host, '127.0.0.1'); 
        assert.strictEqual(options.jwt_secret, 'Abcd@1234');
        assert.strictEqual(options.db_url, 'mongodb://localhost:27017/dositio');
    });
});

describe('### Tests for Unauthenticated routes', async () => {
    describe('## Success Requests', async () => {
        test('# GET /products', async () => {
            const app = await build(options);

            await app.close();

            const response = await app.inject({
                method: 'GET',
                url: '/products'
            });

            assert.strictEqual(response.statusCode, 200);
        });

        test('# GET /categories', async () => {
            const app = await build(options);

            await app.close();

            const response = await app.inject({
                method: 'GET',
                url: '/categories'
            });

            assert.strictEqual(response.statusCode, 200);
        });
    });

    describe('## Bad Requests', async () => {
    });
});

describe('### Tests for Authenticated routes', async () => {
    describe('## Success Requests', async () => {
    });

    describe('## Bad Requests', async () => {
    });
});
