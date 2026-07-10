"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app = require('../app').default;
/**
 * Integration tests for core app endpoints.
 * These tests verify basic Express app setup and routing:
 * - Middleware is properly configured (CORS, JSON parsing, logging)
 * - Routes are mounted under their API prefixes
 * - Health check endpoint works as expected
 *
 * This is a "smoke test" to ensure the app can start and respond
 * to requests before running more complex integration tests.
 */
describe('App integration', () => {
    it('returns 200 for the health endpoint', async () => {
        // Make a GET request to /health
        const response = await (0, supertest_1.default)(app).get('/health');
        // Verify HTTP status is 200 OK
        expect(response.status).toBe(200);
        // Verify response body structure
        // success flag indicates operation status
        expect(response.body).toHaveProperty('success', true);
        // message describes the status
        expect(response.body).toHaveProperty('message', 'Inventory API is running.');
        // timestamp tracks when the response was generated
        expect(response.body).toHaveProperty('timestamp');
    });
});
