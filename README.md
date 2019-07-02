# Node.js: The Complete Guide to Build RESTful APIs (2018)

[https://www.udemy.com/nodejs-master-class/learn/lecture/9990086](https://www.udemy.com/nodejs-master-class/learn/lecture/9990086)

The tutorial leaves each section with an excercise to build your own video store app called Vidley. None of that was clearly
mentioned in the begining of the tutorial. Here's someones repo for that codebase:
[https://github.com/julianoalberto/vidly](https://github.com/julianoalberto/vidly)

Some other student's repo:
[https://github.com/Devansh4/nodeCourse](https://github.com/Devansh4/nodeCourse)

## Environment Variables

### NODE_ENV
Set the environment variable (development/staging/production).
`export NODE_ENV=development`

### PORT
Use the following to set locally on Mac:
`export PORT=5000`

### DEBUG
Used with the `debug` NPM package for logging messages to console.
`export DEBUG=startup.app,debug.app`


## Authentication
A JSON Web Token (JWT) is generated after auth (/api/auth). If the isAdmin value for a
user is updated in the database. A new JWT will need to be generated to reflect that
change in the isAdmin setting encoded with the JWT.


## Debugging

Using the NPM debug utility for logging messages.
[https://www.npmjs.com/package/debug](https://www.npmjs.com/package/debug)

Set an environment variable for each debug namespace:
`export DEBUG=app:startup,app:db`


## Routes

Route parameters used for essensial or required values. (req.params)
```/api/posts/2018/02```

Query string parameters used for additional data or optional data to back end services. (req.query)
```/api/posts/2018/02?sorBy=name```


## Testing

### Unit Testing
Used when not working with any external resources such as a database or API.
Confirm that all possible execution paths are tested via Unit test.

### Unit Testing
Using Jest.
[https://jestjs.io/](https://jestjs.io/)

## NPM Packages
Some notes or referrence for NPM packages used.

### Winston
[https://github.com/winstonjs/winston](https://github.com/winstonjs/winston)
Using `winston` to log errors to MongoDB.

### Express Async Errors
[https://github.com/davidbanham/express-async-errors](https://github.com/davidbanham/express-async-errors)
Using the `express-async-errors` package to automatically wrap routes in a middleware to
catch async exceptions. Was previously using middleware/async.js in tutorial.

### jsonwebtoken
[https://github.com/auth0/node-jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
Use JsonWebToken with node.js.

### Fawn
[https://github.com/e-oj/Fawn](https://github.com/e-oj/Fawn)
A promise based library for transactions in MongoDB

Since this tutorial, transactions have been added to MongoDB as per Fawn README.

The library creates a database collection named `ojlinttaskcollections` to run the phase 2 commits.


## Response Codes
200 All Good
400 Bad Request
401 Unauthorized (failed login/unauthenticated)
403 Forbidden (unauthorized/not permitted to access)
404 Not Available


