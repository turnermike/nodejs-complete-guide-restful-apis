/**
 * tests/lib.test.js
 *
 * Using Jest for Unit testing.
 * https://jestjs.io/
 *
 * Examples of Unit testing the following:
 *
 * - numbers
 * - strings
 * - arrays
 *
 */

const lib = require('./lib');
const db = require('./db');
const mail = require('./mail');

// testing numbers
describe('absolute', () => {

    it('Should return a positive number if input is positive', () => {

        const result = lib.absolute(1);         // run the function to test and save result
        expect(result).toBe(1);                 // test the result

    });

    it('Should return a positive number if input is negative', () => {

        const result = lib.absolute(-1);
        expect(result).toBe(1);

    });

    it('Should return 0 if input is 0', () => {

        const result = lib.absolute(0);
        expect(result).toBe(0);

    });

});

// testing strings
describe('greet', () => {

    it('Should return the greeting message', () => {
        const result = lib.greet('Mike');
        // expect(result).toBe('Welcome Mike !');
        // expect(result).toMatch(/Mike/);     // w/ regex
        expect(result).toContain('Mike');   // w/o regex
    });

});

// testing arrays
describe('getCurrencies', () => {

    it('Should return supported currencies', () => {

        const result = lib.getCurrencies();

        // too general
        // expect(result).toBeDefined();
        // expect(result).toBeNull();

        // too specific
        // expect(result[0]).toBe('USD');  // testing exact index in array
        // expect(result[1]).toBe('AUD');
        // expect(result[2]).toBe('EUR');
        // expect(result.length).toBe(3);   // testing exact length of array, elements could be added later

        // better approach
        expect(result).toContain('USD');    // USD exists in array
        expect(result).toContain('AUD');
        expect(result).toContain('EUR');

        // ideal approach
        expect(result).toEqual(expect.arrayContaining(['EUR', 'USD', 'AUD']));

    });

});

// testing objects
describe('getProduct', () => {

    it('Should return the product with the given id', () => {

        const result = lib.getProduct(1);

        // expect(result).toEqual({ id: 1, price: 10 });                // object equals or identical to
        // expect(result).toMatchObject({ id: 1, price: 10 });          // object contains
        // expect(result).toHaveProperty('id');                         // object has a property for id
        expect(result).toHaveProperty( 'id', 1 );                   // object has a property of id and value is 1

    });

});

// testing execptions
describe('registerUser', () => {

    it('Should throw if username is falsy', () => {

        // JS Falsy values: null, undefined, NaN, '', 0, false
        const args = [null, undefined, NaN, '', 0, false];

        args.forEach(a => {
            expect(() => { lib.registerUser(a) }).toThrow(); // expects an exeption to be thrown
        });

    });

    it('Should return a user object if valid user name is passed', () => {

        const result = lib.registerUser('mike');

        // expect(result).toHaveProperty( 'id' );
        expect(result).toMatchObject({ 'username': 'mike' });

    });

});

// mock functions - simple example
describe('applyDiscount', () => {

    it('Should apply a 10% discount if customer has more than 10 points.', () => {

        db.getCustomerSync = function(customerId) {
            console.log('fake reading customer');
            return { id: customerId, points: 20 }
        };


        const order = { customerId: 1, totalPrice: 10 };
        lib.applyDiscount(order);
        expect(order.totalPrice).toBe(9);
    });

});

// mock functions - testing interaction of one object with another object
describe('notifyCustomer', () => {

    it('Should send an email to the customer.', () => {

        const mockFunction = jest.fn();
        // mockFunction.mockResolvedValue(1);                   // simulate a promise resolve
        // mockFunction.mockRejectedValue(new Error('...'));    // simulate a promise rejection

        db.getCustomerSync = jest.fn().mockReturnValue({ email: 'a' });

        mail.send = jest.fn();

        lib.notifyCustomer({ customerId: 1 });

        expect(mail.send).toHaveBeenCalled();   // .tohaveBeenCalled matcher function works with the Jest mock functions only
        expect(mail.send.mock.calls[0][0]).toBe('a');
        expect(mail.send.mock.calls[0][1]).toMatch(/order/);

    });

});