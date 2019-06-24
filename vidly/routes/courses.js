/**
 * routes/courses.js
 *
 * - handle all /api/courses routes (loaded via index.js with path prefix)
 *
 */

const express = require('express');
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
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
// mongoose.connect('mongodb://localhost/node-restful-api', { useNewUrlParser: true, useFindAndModify: false })
//     .then( () => debug('Connected to MongoDB'))
//     .catch(err => debug('Error: ', err));

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
 * Routes (/api/courses)
 */

// get all courses
router.get('/', async (req, res) => {

    const allCourses = await Course.find();
    debug('All courses requested: \n', allCourses)
    res.send(allCourses);

    /**
     * Before Mongoose, using static object as data source
     */
    // res.send(courses);

});

// get course by id
router.get('/:id', async (req, res) => {

    const course = await Course.findById(new ObjectID(req.params.id), (err, course) => {

        if (err) {
            debug('Error: \n', err.message);
            res.send({ 'error': err.message });
            return;
        }

        debug('Get course by ID: \n', course);
        res.send(course);

    });

    /**
     * Before Mongoose, using static object as data source
     */
    // const course = courses.find(c => c.id === parseInt(req.params.id));
    // if (!course) return res.status(404).send('The course with the given ID was not found.');

    // res.send(course);

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

    const result = course.save();   // .save() returns a promise

    result
        .then(result => {
            debug('New course added: \n', result);
            res.send(result);
        })
        .catch(err => {
            debug('Insert error: \n', err.errors);
            res.send(err.errors);
        });

    /**
     * Before Mongoose, using static object as data source
     */
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

    const query = { _id: new ObjectID(req.params.id) };

    // trim any spaces after the comma in comma seperated tags
    let tags = [];
    req.query.tags.split(',').map(el => { tags.push(el.trim()); });
    // console.log('tags', tags);

    const newData = {
        name: req.query.name,
        category: req.query.category,
        author: req.query.author,
        tags,
        price: req.query.price
    };

    const options = { upsert: true };

    const { error } = validateCourse(newData);
    if ( error ) return res.status(400).send(error.details[0].message);

    const result = Course.updateOne(query, newData, options).exec();

    result
        .then(result => {
            debug('Updated course: \n', result);
            res.send(req.params);
        })
        .catch(err => {
            debug('Update error: \n', err);
            res.send(err);
        });


    /**
     * Before Mongoose, using static object as data source
     */
    // const course = courses.find(c => c.id === parseInt(req.params.id));
    // if (!course) return res.status(404).send('The course with the given ID was not found.');

    // const { error } = validateCourse(req.body);
    // if ( error ) return res.status(400).send(error.details[0].message);

    // course.name = req.body.name;

    // res.send(course);

});

// delete course by id
router.delete('/:id', (req, res) => {

    Course.deleteOne({ _id: new ObjectID(req.params.id)}, (err, result) => {

        if (err) {
            debug('Error: ', err);
            res.status(400).send(err.details[0].message);
        }

        debug('Deleted course: ', result);

        if(result.deletedCount){
            res.send(result);
        }else{
            res.status(400).send(`No record found with the ID: ${req.params.id}`);
        }

    });

    /**
     * Before Mongoose, using static object as data source
     */
    // console.log('current courses', courses);

    // const course = courses.find(c => c.id === parseInt(req.params.id));
    // if (!course) return res.status(404).send('The course with the given ID was not found.');

    // const index = courses.indexOf(course);
    // courses.splice(index, 1);

    // console.log('new courses after delete: ', courses);
    // res.send(course);

});

function validateCourse(course) {

    // debug('validateCourse', course)

    const schema = {
        name: Joi.string().required(),
        category: Joi.string().required(),
        author: Joi.string().required(),
        tags:Joi.array().required(),
        price: Joi.number().required()
    };

    return Joi.validate(course, schema);
    // console.log('validationResult.error', validationResult.error);

}

module.exports = router;