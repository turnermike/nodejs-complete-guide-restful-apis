
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const dbDebug = require('debug')('app:db');

const app = express();

if(app.get('env') === 'development') {
    console.log('Is development environment.');
    app.use(morgan('tiny'));
}

// connect to mongodb
mongoose.connect('mongodb://localhost/node-restful-api')
    .then( () => dbDebug('Connected to MongoDB'))
    .catch(err => console.log('Error: ', err));

const courseSchema = new mongoose.Schema({
    name: String,
    author: String,
    tags: [ String ],
    date: { type: Date, default: Date.now },
    isPublished: Boolean
});