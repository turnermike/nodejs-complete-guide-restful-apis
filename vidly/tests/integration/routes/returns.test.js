/**
 * tests/integration/routes/returns.test.js
 *
 *
 */

const mongoose = require('mongoose');
const request = require('supertest');
const { Rentals } = require('../../../models/rentals');
const { Movies } = require('../../../models/movies');
const { Users } = require('../../../models/users');
const logger = require('../../../middleware/logger');
const debug = require('debug')('app:db');    // doesn't work here

describe('/api/returns', () => {

    let server;
    let customerId;
    let movieId;
    let rental;
    let movie;
    let token;

    // executed before each test
    beforeEach(async () => {

        server = require('../../../index');    // start server before each test

        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();
        token = new Users().generateAuthToken();

        movie = new Movies({
            _id: movieId,
            title: '12345',
            dailyRentalRate: 2,
            genre: { name: '12345' },
            numberInStock: 10
        });
        await movie.save();

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

    it('Should return 400 if return has already been processed.', async () => {

        rental.dateReturned = new Date();
        await rental.save();

        const res = await exec();

        expect(res.status).toBe(400);

    });

    it('Should set the return date if input is valid.', async () => {

        const res = await exec();

        const rentalInDb = await Rentals.findById(rental._id);

        const diff = new Date() - rentalInDb.dateReturned;

        // expect(rentalInDb.dateReturned).toBeDefined();
        expect(diff).toBeLessThan(10 * 1000);

    });

    it('Should calculate the rental fee.', async () => {

        const res = await exec();

        const rentalInDb = await Rentals.findById(rental._id);

        const daysOut = rentalInDb.dateReturned - rentalInDb.dateOut;
        const fee = daysOut * rentalInDb.movie.dailyRentalRate;

        // console.log('daysOut: ', daysOut);
        // console.log('fee: ', fee);
        logger.info('Fee: ' + fee);

        expect(fee).toBeGreaterThan(0);

    });

    it('Should increase the movie inventory if input is valid.', async () => {

        const res = await exec();

        const movieInDb = await Movies.findById(movieId);
        expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);


    });


});