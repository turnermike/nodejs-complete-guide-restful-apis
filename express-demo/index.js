const express = require('express');
const Joi = require('joi');
const port = process.env.PORT || 3000;

// initialize express
const app = express();
app.use(express.json());    // use express.json middleware in request processing pipeline

// test data
const courses = [
    { id: 1, name: 'Course1' },
    { id: 2, name: 'Course2' },
    { id: 3, name: 'Course3' }
];

// default route
app.get('/', (req, res) => {
    res.send('hello world');
});

// get all courses
app.get('/api/courses', (req, res) => {
    res.send(courses);
});

// get course by id
app.get('/api/courses/:id', (req, res) => {
    // res.send(req.params);
    // res.send(req.query);

    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found.');

    res.send(course);

});

// add new course
app.post('/api/courses', (req, res) => {

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
app.put('/api/courses/:id', (req, res) => {

    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found.');

    const { error } = validateCourse(req.body);
    if ( error ) return res.status(400).send(error.details[0].message);

    course.name = req.body.name;

    res.send(course);

});

// delete course by id
app.delete('/api/courses/:id', (req, res) => {


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





// start server
app.listen(port, () => { console.log(`Listening on port ${port}`) });