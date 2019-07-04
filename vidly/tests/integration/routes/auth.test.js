/**
 * tests/integration/auth.test.js
 *
 *
 */

const request = require('supertest');
const { Genres } = require('../../../models/genres');
const { Users } = require('../../../models/users');

let server;
let token;

describe('auth middleware', () => {

    // executed before each test
    beforeEach(async () => {
        server = require('../../../index');            // start express
        token = new Users().generateAuthToken();    // get JWT
    });

    // executed after each test
    afterEach(async () => {
        // console.log('afterEach called');
        await Genres.remove({});                    // remove genres table after each test
        server.close();                             // top express
    });

    const exec = async () => {

        return request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({ name: 'genre1' });

    }

    it('Should return 401 if no token is provided.', async () => {

        token = '';                         // clear token since we're testing an invalid token

        const res = await exec();           // send post request

        expect(res.status).toBe(401);       // test expects a 401 response code

    });

    it('Should return 400 if token is invalid.', async () => {

        token = 'a';                         // clear token since we're testing an invalid token

        const res = await exec();           // send post request

        expect(res.status).toBe(400);       // test expects a 400 response code

    });

    it('Should return 200 if token is valid.', async () => {

        const res = await exec();           // send post request

        expect(res.status).toBe(200);       // test expects a 200 response code

    });


});