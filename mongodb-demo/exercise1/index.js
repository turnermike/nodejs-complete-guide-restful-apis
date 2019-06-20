
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
mongoose.connect('mongodb://localhost/mongo-excercises', { useNewUrlParser: true })
// mongoose.connect('mongodb://localhost/node-restful-api', { useNewUrlParser: true })
    .then( () => console.log('Connected to MongoDB'))
    .catch(err => console.log('Error: ', err));

// initialize a mongoose schema
const courseSchema = new mongoose.Schema({
    name: String,
    author: String,
    tags: [ String ],
    isPublished: Boolean,
    price: Number,
    date: { type: Date, default: Date.now }
});

// compile schema into a model which provides a class
const Course = mongoose.model('courses', courseSchema);

async function createCourse() {

    // create object based off of Course class
    const course = new Course({
        name: 'Python Course',
        author: 'Rob',
        tags: ["python","backend"],
        isPublished: true,
        price: 25,
        date: new Date()
    });

    const result = await course.save();
    console.log('result', result);

}

async function getCourses() {

    const courses = await Course
        .find({ isPublished: true, tags: 'backend' })
        // .find({ tags: { $in: ['backend'] } })
        .sort({ name: 1})
        .select({ name: 1, author: 1})

    console.log('courses', courses);

}

// createCourse();

getCourses();








