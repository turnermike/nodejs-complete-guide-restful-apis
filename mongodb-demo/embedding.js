const mongoose = require('mongoose');

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
  // author: authorSchema
  author: {
    type: authorSchema,
    required: true
  }
}));

async function createCourse(name, author) {
  const course = new Course({
    name,
    author
  });

  const result = await course.save();
  console.log(result);
}

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

// createCourse('PHP Course', new Author({ name: 'Mike Turner' }));

// updateAuthor('5d1125faf7eed31c1f664eca');

removeAuthor('5d1125faf7eed31c1f664eca');
