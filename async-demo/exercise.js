

async function displayCustomer() {

  try{
    const customer = await getCustomer(1);
    console.log('customer', customer);
    if(customer.isGold) {
      const topMovies = await getTopMovies();
      console.log('topMovies', topMovies);
      const emailResult = await sendEmail(customer.email, topMovies);
      console.log('emailResult', emailResult);
    }
  }
  catch (err) { console.log('Error: ', err.message) };

}

displayCustomer();




/* ==========================================================================
   functions
   ========================================================================== */

function getCustomer(id) {
  return new Promise((resolve, reject) => {
    console.log('getCustomer() called...');
    setTimeout(() => {
      resolve({
        id: 1,
        name: 'Mosh Hamedani',
        isGold: true,
        email: 'email'
      });
    }, 4000);
  });
}

function getTopMovies() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(['movie1', 'movie2']);
    }, 4000);
  });
}

function sendEmail(email, movies) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, 4000);
  });
}