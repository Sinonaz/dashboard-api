import { App } from '../app.js';
import { beforeAll, describe, it, expect, afterAll } from '@jest/globals';
import { boot } from '../main.js';
import request from 'supertest';

let application: App;

beforeAll(async () => {
	const { app } = await boot;

	application = app;
});

describe('Users e2e', () => {
	it('should not register existing user', async () => {
		const res = await request(application.app).post('/users/register').send({
			name: 'Isaac',
			email: 'aziksimpson@gmail.com',
			password: '666',
		});

		expect(res.status).toBe(422);
	});

	it('should login user', async () => {
		const res = await request(application.app).post('/users/login').send({
			email: 'aziksimpson@gmail.com',
			password: '666',
		});

		expect(res.status).toBe(200);
		expect(res.body.jwt).toBeDefined();
	});

	it('should return user', async () => {
		const res = await request(application.app)
			.get('/users/info')
			.set(
				'Authorization',
				`Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImF6aWtzaW1wc29uQGdtYWlsLmNvbSIsImlhdCI6MTc4MDY4OTM0M30.5l8pzYpbXkF3cFNLRtsj_LIB2PZA1ek6nVPywtPPULQ`,
			);

		const { user } = res.body;

		expect(res.status).toBe(200);
		expect(user).toHaveProperty('name', 'Isaac');
		expect(user).toHaveProperty('email', 'aziksimpson@gmail.com');
	});
});

afterAll(() => {
	application.close();
});
