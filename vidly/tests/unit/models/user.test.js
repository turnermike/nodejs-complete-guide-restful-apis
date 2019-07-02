/**
 * tests/unit/models/user.test.js
 *
 *
 */

const mongoose = require('mongoose');
const { Users } = require('../../../models/users');
const jwt = require('jsonwebtoken');
const config = require('config');

console.log('JWT Key: ', config.get('jwtPrivateKey'));

describe('user.generateAuthToken', () => {

    it('Should return a valid JWT.', () => {

        const payload = {
            _id: new mongoose.Types.ObjectId().toHexString(),
            isAdmin: true,
        }
        const user = new Users(payload);
        const token = user.generateAuthToken();
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));

        expect(decoded).toMatchObject(payload);

    });

});

