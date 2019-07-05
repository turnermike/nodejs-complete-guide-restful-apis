/**
 * tests/integration/routes/returns.test.js
 *
 *
 */

const mongoose = require('mongoose');
const request = require('supertest');
const { Rentals } = require('../../../models/rentals');
const { Users } = require('../../../models/users');

describe('/api/returns', () => {

    let server;
    let customerId;
    let movieId;
    let rental;
    let token;

    // executed before each test
    beforeEach(async () => {

        server = require('../../../index');    // start server before each test

        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();
        token = new Users().generateAuthToken();

        rental = new Rentals({
            customer: {
                _id: customerId,
                name: '12345',
                phone: '12345'
            },
            movie: {
                _id: movieId,
                title: '12345',
                dailyRentalRate: 2

            }
        });

        await rental.save();

    });

    // executed after each test
    afterEach(async () => {

        server.close();                     // stop express
        await Rentals.deleteMany({});       // clear db table

    });

    const exec = async () => {

        return request(server)
            .post('/api/returns')
            .set('x-auth-token', token)
            .send({
                customerId,
                movieId
            });

    }

    it('Should return 401 if client is not logged in.', async () => {

        token = '';

        const res = await exec();

        expect(res.status).toBe(401);

    });

    it('Should return 400 is customerId is not provided.', async () => {

        customerId = '';

        const res = await exec();

        expect(res.status).toBe(400);

    });

    it('Should return 400 is movieId is not provided.', async () => {

        movieId = '';

        const res = await exec();

        expect(res.status).toBe(400);

    });

    it('Should return 404 if no rental found for customerId/movieId.', async () => {

        await Rentals.deleteMany({});

        const res = await exec();

        expect(res.status).toBe(404);

    });


});