
const exercise1 = require('./exercise1');

describe('fizzBuzz', () => {

    it('Should throw an exception if input is not a number.', () => {

        // expect(() => { exercise1.fizzBuzz(9) }).toThrow();
        expect(() => { exercise1.fizzBuzz(null) }).toThrow();
        expect(() => { exercise1.fizzBuzz(undefined) }).toThrow();
        expect(() => { exercise1.fizzBuzz({}) }).toThrow();

    });

    it('Should return "FizzBuzz" if number is divisible by both 3 and 5.', () => {

        const result = exercise1.fizzBuzz(15);
        expect(result).toBe('FizzBuzz');

    });

    it('Should return "Fizz" if number is only divisibly by 3.', () => {

        const result = exercise1.fizzBuzz(6);
        expect(result).toBe('Fizz');

    });

    it('Should return "Buzz" if number is only divisible by 5.', () => {

        const result = exercise1.fizzBuzz(10);
        expect(result).toBe('Buzz');

    });


});