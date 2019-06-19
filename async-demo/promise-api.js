/* ==========================================================================
   Settled Promises
   - a promise that is not wating to process, either resolved or rejected
   ========================================================================== */

// // resolved promise example
// const promiseResolve = Promise.resolve({ id: 1 });
// promiseResolve.then(result => console.log('result', result));

// // rejected promise example
// const promiseReject = Promise.reject(new Error('My error messager here'));
// promiseReject.catch(err => console.log('err', err)); // note use of .catch






/* ==========================================================================
   Parallel Promises
   ========================================================================== */

const p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log('Async operation 1...');
        resolve(1);
        // reject(new Error('because something failed'));
    }, 2000);
});

const p2 = new Promise((resolve) => {
    setTimeout(() => {
        console.log('Async operation 2...');
        resolve(2);
    }, 2000);
});

/**
 * Promise.all()
 * The Promise.all() method returns a single Promise that resolves when all of
 * the promises passed as an iterable have resolved or when the iterable contains
 * no promises. It rejects with the reason of the first promise that rejects.
 *
 */
Promise.all([p1, p2])
    .then(result => console.log('result', result))
    .catch(err => console.log('Error: ', err.message));

/**
 * Promise.race()
 *
 * The Promise.race() method returns a promise that fulfills or rejects as soon
 * as one of the promises in an iterable fulfills or rejects, with the value
 * or reason from that promise.
 */
// Promise.race([p1, p2])
//     .then(result => console.log('result', result))
//     .catch(err => console.log('Error: ', err.message));