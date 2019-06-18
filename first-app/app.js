
const path = require('path');
const os = require('os');
const fs = require('fs');
const EventEmitter = require('events');
const http = require('http');
const Logger = require('./logger');



// path module
var pathObj = path.parse(__filename);
// console.log(pathObj);



// os module (operating system)
let totalMemory = os.totalmem();
let freeMemory = os.freemem();
// console.log(`Total Memory: ${totalMemory}`);
// console.log(`Free Memory: ${freeMemory}`);


// file system
const files = fs.readdirSync('./');
// console.log('files', files);

fs.readdir('./', function(err, files) {

    if (err) console.log('Error', err);
    else console.log('files', files);

});



// events
// const emitter = new EventEmitter();
const logger = new Logger();

// register a listener
// emitter.on('messageLogged', (arg) => {
logger.on('messageLogged', (arg) => {
    console.log('Listener called', arg);
});

logger.log('message hi hi');



// http module
const server = http.createServer( (req, res) => {

    if(req.url === '/') {
        res.write('Hello World');
        res.end();
    }

    if(req.url === '/api/courses') {
        res.write(JSON.stringify([1, 2, 3]));
        // res.write('test');
        res.end();
    }

});
server.listen(3000);

server.on('connection', (socket) => {
    console.log('New connection...');
});

console.log('Listening on port 3000...');












// // custom module example
// // console.log(log);
// logger.log('---------------------------------------------------------------------------');
// logger.log('My message!');

// // simple function
// function sayHello(name) {
//   console.log('Hello ' + name);
// }

// sayHello('Mike');
// // console.log(window);
// // console.log(module);







