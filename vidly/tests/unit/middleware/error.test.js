/**
 * tests/unit/error.test.js
 *
 *
 */

// const request = require('supertest');

describe('error middleware', () => {

    it('Should return TypeError with message.', () => {

        const t = () => { throw new TypeError(); };

        console.log('RESULT', t.status);

        expect(t).toThrow(TypeError);

    });

});