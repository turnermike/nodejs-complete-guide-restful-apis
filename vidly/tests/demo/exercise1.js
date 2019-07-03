
module.exports.fizzBuzz = function(input) {

    // console.log('typeof(input)', typeof(input));
    // console.log('isNumber', (typeof(input) != 'number') ? 'is NOT a number' : 'IS A number');

    if (typeof(input) !== 'number')
       throw new Error('Input should be a number.');

    if ((input % 3 === 0) && (input % 5) === 0)
        return 'FizzBuzz';

    if (input % 3 === 0)
        return 'Fizz';

    if (input % 5 === 0)
        return 'Buzz';

    return input;
}
