
const p = new Promise((resolve, reject) => {

    // kick off some async work
    setTimeout(() => {
        // resolve(1);                          // pending => resolved, fulfilled
        reject(new Error('message here'));      // penidng => rejected
    }, 2000);

});

p
    .then(result => console.log('result', result))
    .catch(err => console.log('error', err.message));