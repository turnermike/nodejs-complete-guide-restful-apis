
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

// initialize a mongoose schema
const courseSchema = new mongoose.Schema({
    name: String,
    author: String,
    tags: [ String ],
    date: { type: Date, default: Date.now },
    isPublished: Boolean
});

// compile schema into a model which provides a class
const Course = mongoose.model('Course', courseSchema);
// save to mongodb via mongoose save
// returns a promise

async function createCourse() {

    // create object based off of Course class
    const course = new Course({
        name: 'Angular Course',
        author: 'Mosh',
        tags: ['angular', 'frontend'],
        isPublished: true
    });

    const result = await course.save();
    console.log('result', result);

}

async function getCourses() {

    const courses = await Course
        // .find({ isPublished: true })                         // comparison operator
        // .find({ price: { $gte: 10, $lte: 100 } })            // comparison operators
        // .find({ price: { $in: [10, 15, 20] } })              // comparison operators
        // .find()                                              // all
        // .find({ author: /^Mosh/ })                           // starts with "Mosh" case sensitive
        // .find({ author: /turner$/i })                        // ends with "Turner" case insensiive
        .find({ author: /.*urne.*/ })                           // contains "urne"
        // .or([ { author: 'Mosh' }, { isPublished: true } ])   // .or() logical operator
        // .and([])
        .limit(10)
        .sort({ name: 1 })
        .select({ name: 1, author: 1, tags: 1 })
    console.log('courses', courses);

}

// createCourse();
getCourses();



