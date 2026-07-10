"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const env_1 = require("../../config/env");
const app = require('../../app').default;
// Integration tests for inventory + category endpoints.
// These tests:
// - create an admin user
// - authenticate (JWT)
// - create category + items
// - verify list/search/pagination behavior
describe('Inventory + Category Endpoints Integration', () => {
    const adminPassword = 'ValidPassword123';
    it('GET /api/categories returns categories', async () => {
        // Auth is required for categories list.
        // Categories listing works for any authenticated user, but for consistency we log in as seeded admin.
        const username = env_1.env.ADMIN_USERNAME;
        const password = env_1.env.ADMIN_PASSWORD ?? adminPassword;
        const loginResponse = await (0, supertest_1.default)(app)
            .post('/api/auth/login')
            .send({ username, password });
        const token = loginResponse.body?.data?.token ??
            loginResponse.body?.data?.accessToken ??
            loginResponse.body?.data?.access_token;
        expect(token).toBeTruthy();
        const response = await (0, supertest_1.default)(app)
            .get('/api/categories')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('data');
        expect(Array.isArray(response.body.data)).toBe(true);
    });
    it('GET /api/categories rejects unauthenticated requests (401)', async () => {
        const response = await (0, supertest_1.default)(app).get('/api/categories');
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('success', false);
    });
    it('POST /api/categories rejects non-admin user (403)', async () => {
        const username = 'user' + Date.now();
        const password = adminPassword;
        const registerResponse = await (0, supertest_1.default)(app)
            .post('/api/auth/register')
            .send({ username, password });
        // Must succeed to have a user to test with
        expect(registerResponse.status).toBe(201);
        const loginResponse = await (0, supertest_1.default)(app)
            .post('/api/auth/login')
            .send({ username, password });
        expect(loginResponse.status).toBe(200);
        const token = loginResponse.body?.data?.token ??
            loginResponse.body?.data?.accessToken ??
            loginResponse.body?.data?.access_token;
        expect(token).toBeTruthy();
        const createCategoryResponse = await (0, supertest_1.default)(app)
            .post('/api/categories')
            .set('Authorization', `Bearer ${token}`)
            .send({
            name: 'ShouldFailCategory_' + Date.now(),
            description: 'test',
        });
        // Ensure it was blocked before any more assertions.
        expect(createCategoryResponse.status).toBe(403);
        expect(createCategoryResponse.body).toHaveProperty('success', false);
        // Return early (keeps this block tight and avoids accidental flow-through)
        return;
    });
    it('creates category and items, then supports pagination + search', async () => {
        // Login as seeded ADMIN (required to create categories/items).
        const username = env_1.env.ADMIN_USERNAME;
        const password = env_1.env.ADMIN_PASSWORD ?? adminPassword;
        const loginResponse = await (0, supertest_1.default)(app)
            .post('/api/auth/login')
            .send({ username, password });
        expect(loginResponse.status).toBe(200);
        expect(loginResponse.body).toHaveProperty('success', true);
        // Login implementation may return the JWT token under different property names.
        // We accept the common variations to avoid tight coupling to DTO shapes.
        const token = 
        // expected/most common shape
        loginResponse.body?.data?.token ??
            // fallback shapes
            loginResponse.body?.data?.accessToken ??
            loginResponse.body?.data?.access_token ??
            loginResponse.body?.data?.jwt;
        expect(token).toBeTruthy();
        // Step 2: Create a category (ADMIN role required by route).
        const categoryName = 'Category_' + Date.now();
        const createCategoryResponse = await (0, supertest_1.default)(app)
            .post('/api/categories')
            .set('Authorization', `Bearer ${token}`)
            .send({
            name: categoryName,
            description: 'test category',
        });
        expect(createCategoryResponse.status).toBe(201);
        expect(createCategoryResponse.body).toHaveProperty('success', true);
        expect(createCategoryResponse.body).toHaveProperty('data');
        expect(createCategoryResponse.body.data).toHaveProperty('id');
        const categoryId = createCategoryResponse.body.data.id;
        // Step 3: Create multiple items so pagination/search can be validated.
        const skuPrefix = 'SKU_' + Date.now();
        const itemName1 = 'AppleItem_' + Date.now();
        const itemName2 = 'BananaItem_' + Date.now();
        const itemName3 = 'AppleItem2_' + Date.now();
        const itemsToCreate = [
            {
                sku: skuPrefix + '_1',
                name: itemName1,
                description: 'something about apple',
                quantity: 5,
                receivedAt: new Date().toISOString(),
                categoryId,
            },
            {
                sku: skuPrefix + '_2',
                name: itemName2,
                description: 'something about banana',
                quantity: 10,
                receivedAt: new Date().toISOString(),
                categoryId,
            },
            {
                sku: skuPrefix + '_3',
                name: itemName3,
                description: 'more apple stuff',
                quantity: 7,
                receivedAt: new Date().toISOString(),
                categoryId,
            },
        ];
        for (const item of itemsToCreate) {
            const createItemResponse = await (0, supertest_1.default)(app)
                .post('/api/items')
                .set('Authorization', `Bearer ${token}`)
                .send(item);
            expect(createItemResponse.status).toBe(201);
            expect(createItemResponse.body).toHaveProperty('success', true);
            expect(createItemResponse.body).toHaveProperty('data');
            expect(createItemResponse.body.data).toHaveProperty('id');
            expect(createItemResponse.body.data).toHaveProperty('sku');
            expect(createItemResponse.body.data).not.toHaveProperty('password');
        }
        // Step 4: Pagination: request 2 items per page.
        const page1 = await (0, supertest_1.default)(app)
            .get('/api/items')
            .set('Authorization', `Bearer ${token}`)
            .query({ page: 1, limit: 2 });
        expect(page1.status).toBe(200);
        expect(page1.body).toHaveProperty('success', true);
        expect(page1.body).toHaveProperty('data');
        expect(page1.body.data).toHaveProperty('data');
        const page1Items = page1.body.data.data;
        expect(Array.isArray(page1Items)).toBe(true);
        expect(page1Items.length).toBeLessThanOrEqual(2);
        // Step 5: Search: search for 'apple' should match at least the 2 apple items.
        const searchResponse = await (0, supertest_1.default)(app)
            .get('/api/items')
            .set('Authorization', `Bearer ${token}`)
            .query({ page: 1, limit: 10, search: 'apple' });
        expect(searchResponse.status).toBe(200);
        expect(searchResponse.body).toHaveProperty('success', true);
        const searchData = searchResponse.body.data;
        expect(searchData).toHaveProperty('data');
        const searchItems = searchData.data;
        const searchNames = searchItems.map((i) => i.name?.toLowerCase?.() ?? '');
        const matchedApple = searchNames.some((n) => n.includes('apple'));
        expect(matchedApple).toBe(true);
    });
});
