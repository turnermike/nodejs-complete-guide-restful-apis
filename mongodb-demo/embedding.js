const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;

mongoose.connect('mongodb://localhost/playground', { useNewUrlParser: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const authorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  website: String
});

const Author = mongoose.model('Author', authorSchema);

const Course = mongoose.model('Course', new mongoose.Schema({
  name: String,
  // author: {
  //   type: authorSchema,
  //   required: true
  // }
  authors: {
    type: [authorSchema]
  }
}));

/**
 * Create a new course
 *
 */
// async function createCourse(name, author) {
async function createCourse(name, authors) {

  const course = new Course({
    name,
    authors
  });

  const result = await course.save();
  console.log(result);

}

/**
 * List all courses
 *
 */
async function listCourses() {

  const courses = await Course.find();
  console.log(courses);

}

/**
 * Update a sub document
 *
 * Sub documents may only be modified within the context of their parent.
 *
 */
async function updateAuthor(courseId) {
  // const course = await Course.findById(courseId);
  const course = await Course.update({ _id: courseId }, {
    $set: {
      'author.name': 'John Smith'
    }
  });

  course.author.name = "Chuck Norris";
  course.save();
}

/**
 * Remove a sub document
 *
 */
async function removeAuthor(courseId)  {
  const course = await Course.update({ _id: courseId }, {
    $unset: {
      'author.name': ''
    }
  });

  course.author.name = "Chuck Norris";
  course.save();

}


async function addAuthor(courseId, author) {

  const course = await Course.findById(new ObjectID(courseId), (err, course) => {

    if (err) {
        console.log('Error: \n', err.message);
        return;
    }

    course.authors.push(author);
    course.save();

    console.log('addAuthor saved: ', course);

  });

}








// listCourses();

// createCourse('ASP Course', new Author({ name: 'Frank King' }));   // single sub document
// createCourse('XML Course', [                                        // array of sub documents
//   new Author({ name: 'Brand Hienze' }),
//   new Author({ name: 'Maggie Hutton' })
// ]);

// updateAuthor('5d1136f091d06d2eb08f276b');

// removeAuthor('5d1125faf7eed31c1f664eca');

addAuthor('5d1141d54fbf2438b24056ae', new Author({ name: 'Yo Mom' }) );






