/**
 * routes/courses.js
 *
 * - handle all /api/courses routes (loaded via index.js with path prefix)
 *
 */

const express = require('express');
const mongoose = require('mongoose');
const debug = require('debug')('app:db');
const morgan = require('morgan');
const Joi = require('joi');
const router = express.Router();

// // test data
// const courses = [
//     { id: 1, name: 'Course1' },
//     { id: 2, name: 'Course2' },
//     { id: 3, name: 'Course3' }
// ];

// connect to mongodb
mongoose.connect('mongodb://localhost/node-restful-api', { useNewUrlParser: true, useFindAndModify: false })
    .then( () => debug('Connected to MongoDB'))
    .catch(err => debug('Error: ', err));

// initialize courses collection schema
const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: [2, 'Name must have at least 2 characters'],
        maxlength: [255, 'Name must have a maximum of 255 characters'],
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['web', 'mobile', 'network'],
        lowercase: true,
        trim: true
    },
    author: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 255

    },
    tags: {
        type: Array,
        validate: {
            validator: function(v) {
                return v && v.length > 0;
            },
            message: 'A course should have at least one tag.'
        }
    },
    date: {
        type: Date,
        default: Date.now
    },
    price: {
        type: Number,
        require: true,
        // required: function() {
        //     return this.isPublished;
        // },
        min: [5, 'Enter a minimum price of $5'],
        max: [300, 'Enter a maximum price of $300']
    }

});
const Course = mongoose.model('Course', courseSchema);

/**
 * Routes
 */

// get all courses
router.get('/', (req, res) => {

    res.send(courses);

});

// get course by id
router.get('/:id', (req, res) => {
    // res.send(req.params);
    // res.send(req.query);

    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found.');

    res.send(course);

});

// add new course
router.post('/', (req, res) => {

    const { error } = validateCourse(req.body);

    if ( error ) return res.status(400).send(error.details[0].message);

    // trim any spaces after the comma in comma seperated tags
    let tags = [];
    req.query.tags.split(',').map(el => { tags.push(el.trim()); });
    // console.log('tags', tags);

    const course = new Course({
        name: req.query.name,
        category: req.query.category,
        author: req.query.author,
        tags,
        price: req.query.price
    });



    // try{

        const result = course.save();   // .save() returns a promise

        result
            .then(result => {
                debug('New course added: \n', result);
                res.send(result);
            })
            .catch(err => {
                console.log('error', err.errors);
                res.send(err.errors);
            });

        // res.send({});

    // }
    // catch(ex) {
    //     let returnMessage;
    //     for(field in ex.errors) {
    //         console.log('Error field: ', ex.errors[field].message);
    //         returnMessage += ex.errors[field].message + '\n';
    //     }
    //     res.send(ex.errors);
    // }


    // const { error } = validateCourse(req.body);

    // if ( error ) return res.status(400).send(error.details[0].message);

    // // new course data
    // const course = {
    //     id: courses.length + 1,
    //     name: req.query.name
    // };

    // courses.push(course);
    // console.log('courses', courses);

    // res.send(course);

});

// update a course
router.put('/:id', (req, res) => {

    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found.');

    const { error } = validateCourse(req.body);
    if ( error ) return res.status(400).send(error.details[0].message);

    course.name = req.body.name;

    res.send(course);

});

// delete course by id
router.delete('/:id', (req, res) => {


    console.log('current courses', courses);

    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found.');

    const index = courses.indexOf(course);
    courses.splice(index, 1);

    console.log('new courses after delete: ', courses);
    res.send(course);

});

function validateCourse(course) {

    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(course, schema);
    // console.log('validationResult.error', validationResult.error);

}

module.exports = router;