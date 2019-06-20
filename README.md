# Node.js: The Complete Guide to Build RESTful APIs (2018)

[https://www.udemy.com/nodejs-master-class/learn/lecture/9990086](https://www.udemy.com/nodejs-master-class/learn/lecture/9990086)

The tutorial leaves each section with an excercise to build your own video store app called Vidley. None of that was clearly
mentioned in the begining of the tutorial. Here's someones repo for that codebase:
[https://github.com/julianoalberto/vidly](https://github.com/julianoalberto/vidly)

Some other student's repo:
[https://github.com/Devansh4/nodeCourse](https://github.com/Devansh4/nodeCourse)

## Environment Variables

### PORT
Use the following to set locally on Mac:
`export PORT=5000`


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





