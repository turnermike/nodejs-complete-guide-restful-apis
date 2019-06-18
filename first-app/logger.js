
const EventEmitter = require('events');

const emitter = new EventEmitter();

// console.log(__filename);
// console.log(__dirname);
// var url = 'http://mylogger.io/log';

// function log(message, arg) {

//   console.log(message, (typeof arg !== 'undefined') ? arg : '');

//   // raise an event
//   emitter.emit('messageLogged', { id: 1, url: 'http://google.com' });

// }

class Logger extends EventEmitter{

  log(message) {

    console.log(message);

    // raise an event
    // emitter.emit('messageLogged', { id: 1, url: 'http://' });
    this.emit('messageLogged', { id: 1, url: 'http://' });        // since we're extending EventEmitter, use this keyword

  }



}



module.exports = Logger;