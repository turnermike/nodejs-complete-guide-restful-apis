/**
 * test/integration/genres.test.js
 *
 *
 */

const request = require('supertest');
const { Genres } = require('../../models/genres');
const { Users } = require('../../models/users');

let server;

describe('/api/genres', () => {

    // executed before each test
    beforeEach(() => {
        server = require('../../index');    // start server before each test
    });

    // executed after each test
    afterEach(async () => {
        server.close();                     // stop express
        await Genres.remove({});            // remove genres table after each test
    });

    // get all genres
    describe('GET /', () => {

        it('Should return all genres.', async () => {

            await Genres.collection.insertMany([                            // insert 2 test records
                { name: 'genre1' },
                { name: 'genre2' }
            ]);

            const res = await request(server).get('/api/genres');           // make get request

            expect(res.status).toBe(200);                                   // test expects a 200 response code
            expect(res.body.length).toBe(2);                                // test expects 2 results
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();   // test expects an object with a name proper of 'genre1'
            expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();   // test expects an object with a name proper of 'genre2'

        });

    });

    // get genre by id
    describe('GET /:id', () => {

        it('Should return a genre if valid id is passed.', async () => {

            const genre = new Genres({ name: 'genre1' });                   // new genre
            await genre.save();                                             // save it to database

            const res = await request(server).get('/api/genres/' + genre._id);  // make get request with id parameter

            expect(res.status).toBe(200);                                   // test for 200 response code
            expect(res.body).toHaveProperty('name', genre.name);            // test for object property 'name' with value of 'genre1'

        });

        it('Should return 404 if invalid id is passed.', async () => {

            const res = await request(server).get('/api/genres/1');         // make get request with an invalid id (1)

            expect(res.status).toBe(404);                                   // test for 200 response code
            // expect(res.body).toHaveProperty('name', genre.name);            // test for object property 'name' with value of 'genre1'

        });

    });

    // insert new genre
    describe('POST /', () => {

        it('Should return 401 if user is not logged in.', async () => {

            const res = await request(server)               // send post request to server with parameters
                .post('/api/genres')
                .send({ name: 'genre1' });

            expect(res.status).toBe(401);                   // test expects a 401 response code

        });

        it('Should return 400 if genre is less than 5 characters', async () => {

            const token = new Users().generateAuthToken();  // generate jwt

            const res = await request(server)               // send post request to server with parameters
                .post('/api/genres')
                .set('x-auth-token', token)                 // set header key/value
                .send({ name: '1234' });

            expect(res.status).toBe(400);                   // test expects a 400 response code

        });

        it('Should return 400 if genre is more than 50 characters', async () => {

            const token = new Users().generateAuthToken();  // generate jwt

            const res = await request(server)               // send post request to server with parameters
                .post('/api/genres')
                .set('x-auth-token', token)                 // set header key/value
                .send({ name: new Array(52).join('a') });   // generate a string of 52 a's

            expect(res.status).toBe(400);                   // test expects a 400 response code

        });

        it('Should save the genre if it is valid', async () => {

            const token = new Users().generateAuthToken();          // generate jwt

            const res = await request(server)                       // send post request to server with parameters
                .post('/api/genres')
                .set('x-auth-token', token)                         // set header key/value
                .send({ name: 'genre1' });

            const genre = await Genres.find({ name: 'genre1' });    // check database for new genre

            expect(genre).not.toBeNull();                           // test expects not null genre

        });

        it('Should return the genre if it is valid', async () => {

            const token = new Users().generateAuthToken();          // generate jwt

            const res = await request(server)                       // send post request to server with parameters
                .post('/api/genres')
                .set('x-auth-token', token)                         // set header key/value
                .send({ name: 'genre1' });

            expect(res.body).toHaveProperty('_id');                 // test expects res.body to have an _id property
            expect(res.body).toHaveProperty('name', 'genre1');      // test expects res.body to have a name property with value 'genre1'

        });

    });

});