
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const dbDebug = require('debug')('app:db');

const app = express();

// dev environment stuff
if(app.get('env') === 'development') {
    console.log('Is development environment.');
    app.use(morgan('tiny'));
}

// connect to mongodb
mongoose.connect('mongodb://localhost/mongo-exercises', { useNewUrlParser: true, useFindAndModify: false })
    .then( () => console.log('Connected to MongoDB'))
    .catch(err => console.log('Error: ', err));

// initialize a mongoose schema
const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        // match: /pattern/
    },                                                      // validation example for required
    category: {
        type: String,
        required: true,
        enum: ['web', 'mobile', 'network']                  // value must be one of these
    },
    author: String,
    tags: {
        type: Array,
        validate: {
            validator: function (v) {
                return v && v.length > 0;
            },
            message: 'A course should have at least one tag'
        }
    },
    date: { type: Date, default: Date.now },
    isPublished: Boolean,
    price: {
        type: Number,
        required: function() { return this.isPublished }, // conditional required validation
        min: 10,
        max: 200
    }
});

// compile schema into a model which provides a class
// returns a promise
const Course = mongoose.model('Course', courseSchema);

/**
 * Insert
 *
 * Add/create a new document.
 *
 */
async function createCourse() {

    // create object based off of Course class
    const course = new Course({
        name: 'PHP Course',
        // name: '',                           // use this to test validation
        category: 'web',
        author: 'Chuck',
        tags: ['php', 'backend'],
        // tags: [],
        isPublished: true,
        price: 25
    });

    // use try/catch block to catch the promise rejection
    try{
        // await course.validate();          // manual validation
        const result = await course.save();
        console.log('result', result);
    }
    catch(err) {
        console.log('Error: ', err.message);
    }

}

/**
 * Select
 *
 * Get records with various filtering examples.
 *
 */
async function getCourses() {

    const pageNumber = 2;
    const pageSize = 10;
    // /api/courses?pageNumber=2&pageSize=10

    const courses = await Course
        .find({ isPublished: true })                            // comparison operator
        // .find({ price: { $gte: 10, $lte: 100 } })            // comparison operators
        // .find({ price: { $in: [10, 15, 20] } })              // comparison operators
        // .find()                                              // all
        // .find({ author: /^Mosh/ })                           // starts with "Mosh" case sensitive
        // .find({ author: /turner$/i })                        // ends with "Turner" case insensiive
        // .find({ author: /.*urne.*/ })                        // contains "urne"
        // .or([ { author: 'Mosh' }, { isPublished: true } ])   // .or() logical operator
        // .and([])
        .skip((pageNumber -1) * pageSize)                       // use .skip() and .limit() to configure pagination
        .limit(pageSize)
        // .limit(10)                                           // max qty to return
        .sort({ name: 1 })
        .select({ name: 1, author: 1, tags: 1 })
        // .count();                                            // count results
    console.log('courses', courses);

}

/**
 * Update
 *
 * Update a document if a query is required first.
 * For example, need to check if it's published first or if it exists.
 *
 */
async function updateCourseQueryFirst(id) {

    const course = await Course.findById(id);

    if (!course) return; // course does not exist

    if(course.isPublished) return; // don't update published posts

    course.isPublished = true;
    course.author = 'Bruce Lee';

    const result = await course.save();

    console.log('result', result);

}

/**
 * Update
 *
 * Update a document first and return the document.
 * Good to use when we don't need to query the updated record first.
 *
 */
async function updateCourseUpdateFirst(id) {

    const result = await Course.findByIdAndUpdate(id, {
        $set: {
            author: 'Mad Max',
            isPublished: false
        }
    }, { new: true });

    console.log('result', result);

}

/**
 * Delete
 *
 * Remove a document.
 * Return a result object or the deleted document. Both examples provided.
 *
 */
async function removeCourse(id) {

    // const result = await Course.deleteOne({ _id: id });     // returns a result object
    const result = await Course.findByIdAndRemove(id);          // returns the deleted document
    console.log('result', result);

}



/**
 * Run
 *
 */
createCourse();
// getCourses();
// updateCourseQueryFirst('5d0a88c8aa9fdf25284dc340');
// updateCourseUpdateFirst('5d0a88c8aa9fdf25284dc340');
// removeCourse('5d0bd6129bc1817af7583132');



