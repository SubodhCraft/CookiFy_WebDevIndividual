const request = require('supertest');
const app = require('../index');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

describe('CookiFy - Main System Tests', () => {
    let authToken = '';
    let sharedRecipeId = null;
    let sharedCommentId = null;

    const timestamp = Date.now();
    const testUser = {
        username: `chef_${timestamp}`,
        email: `chef_${timestamp}@cookify.io`,
        password: 'Password123!',
        fullName: 'Test Chef User'
    };

    // Setup: Connect and CLEAN database before starting
    beforeAll(async () => {
        const { sequelize } = require('../database/db');
        await sequelize.authenticate();
        // Force sync for a 100% clean test environment
        await sequelize.sync({ force: true });
        console.log('Test DB Cleared and Synced');
    }, 15000);

    // Cleanup: Disconnect from database at the end
    afterAll(async () => {
        const { sequelize } = require('../database/db');
        await sequelize.close();
    });

    describe('User Account Tests', () => {

        // Test 01: Testing if a new user can sign up
        it('AUTH 01: should register a new user', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send(testUser);

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
        });

        // Test 02: Testing if the user can log in and get a token
        it('AUTH 02: should login and return a token', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({ email: testUser.email, password: testUser.password });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.token).toBeDefined();
            authToken = res.body.data.token;
        });

        // Test 03: Testing if we can get the logged-in user's profile
        it('AUTH 03: should get user profile with token', async () => {
            const res = await request(app)
                .get('/api/auth/me')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.data.email).toBe(testUser.email);
        });
    });

    describe('Recipe Management Tests', () => {

        // Test 04: Testing if a user can create a new recipe with an image
        it('RECIPE 01: should create a new recipe', async () => {
            const dummyImagePath = path.join(__dirname, 'test_image.jpg');
            fs.writeFileSync(dummyImagePath, 'fake image data');

            const res = await request(app)
                .post('/api/recipes')
                .set('Authorization', `Bearer ${authToken}`)
                .field('title', 'Yummy Pasta')
                .field('description', 'A very simple pasta recipe.')
                .field('prepTime', '10 mins')
                .field('calories', 300)
                .field('difficulty', 'Easy')
                .field('category', 'Lunch')
                .attach('image', dummyImagePath);

            expect(res.statusCode).toBe(201);
            sharedRecipeId = res.body.data.id;
            fs.unlinkSync(dummyImagePath);
        });

        // Test 05: Testing if we can see the full list of recipes
        it('RECIPE 02: should get all recipes', async () => {
            const res = await request(app).get('/api/recipes');
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body.data)).toBe(true);
        });

        // Test 06: Testing if we can see details of one specific recipe
        it('RECIPE 03: should get one recipe by its ID', async () => {
            const res = await request(app).get(`/api/recipes/${sharedRecipeId}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.data.id).toBe(sharedRecipeId);
        });

        // Test 07: Testing if the owner can edit their recipe
        it('RECIPE 04: should update a recipe successfully', async () => {
            const res = await request(app)
                .put(`/api/recipes/${sharedRecipeId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ title: 'Better Yummy Pasta', difficulty: 'Medium' });

            expect(res.statusCode).toBe(200);
            expect(res.body.data.title).toBe('Better Yummy Pasta');
        });

        // Test 08: Testing if we can search for recipes using a keyword
        it('RECIPE 05: should search for recipes using a query', async () => {
            const res = await request(app).get('/api/recipes?q=Pasta');
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
        });
    });

    describe('User Interaction Tests', () => {

        // Test 09: Testing if a user can save (bookmark) a recipe
        it('ENGAGE 01: should save or bookmark a recipe', async () => {
            const res = await request(app)
                .post(`/api/bookmarks/toggle/${sharedRecipeId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.isBookmarked).toBe(true);
        });

        // Test 10: Testing if a user can write a comment
        it('ENGAGE 02: should add a comment to the recipe', async () => {
            const res = await request(app)
                .post(`/api/comments/recipe/${sharedRecipeId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ content: 'I really liked this recipe!' });

            expect(res.statusCode).toBe(201);
            sharedCommentId = res.body.data.id;
        });

        // Test 11: Testing if a user can edit their own comment
        it('ENGAGE 03: should update a user comment', async () => {
            const res = await request(app)
                .put(`/api/comments/${sharedCommentId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ content: 'I edited my comment, it is awesome!' });

            expect(res.statusCode).toBe(200);
            expect(res.body.data.content).toContain('edited');
        });

        // Test 12: Testing if a user can delete their own comment
        it('ENGAGE 04: should delete a user comment', async () => {
            const res = await request(app)
                .delete(`/api/comments/${sharedCommentId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
        });
    });

    describe('Security and Cleanup Tests', () => {

        // Test 13: Testing if the system blocks users who are not logged in
        it('SAFE 01: should block access if no token is used', async () => {
            const res = await request(app)
                .put(`/api/recipes/${sharedRecipeId}`)
                .set('Authorization', 'Bearer invalid_token');

            expect(res.statusCode).toBe(401);
        });

        // Test 14: Testing if the recipe can be deleted at the end
        it('SAFE 02: should delete the test recipe correctly', async () => {
            const res = await request(app)
                .delete(`/api/recipes/${sharedRecipeId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
        });

        // Test 15: Testing if a user can request a password reset email
        it('AUTH 04: should request a password reset email', async () => {
            const res = await request(app)
                .post('/api/auth/forgot-password')
                .send({ email: testUser.email });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);

            // Wait for background email service to finish logging
            await new Promise(resolve => setTimeout(resolve, 1000));
        }, 15000);
    });

});
