/**
 * tests/unit/auth.test.js
 *
 *
 */

const request = require('supertest');
const auth = require('../../../middleware/auth');
const { Users } = require('../../../models/users');

describe('auth middleware', () => {

    it('Should populate req.user with the payload of a valid JWT.', () => {

        const token = new Users().generateAuthToken();    // get JWT

        const req = {
            header: jest.fn().mockReturnValue(token)
        }

        const res = {};
        const next = jest.fn();

        auth(req, res, next);

        expect(req.user).toBeDefined();


    });

});