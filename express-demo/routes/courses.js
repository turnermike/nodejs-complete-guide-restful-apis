/**
 * routes/courses.js
 *
 * - handle all /api/courses routes (loaded via index.js with path prefix)
 *
 */

const express = require('express');
const router = express.Router();

// test data
const courses = [
    { id: 1, name: 'Course1' },
    { id: 2, name: 'Course2' },
    { id: 3, name: 'Course3' }
];

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

    // new course data
    const course = {
        id: courses.length + 1,
        name: req.query.name
    };

    courses.push(course);
    console.log('courses', courses);

    res.send(course);

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