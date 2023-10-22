// const express = require('express');
// const multer = require('multer');
// const router = express.Router();
// const mongoose = require('mongoose');

// // Define your updated MongoDB schema
// const bookSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   author: { type: String, required: true },
//   file: { type: Buffer, required: true },
// });

// const Book = mongoose.model("Book", bookSchema);

// // Configure multer for file upload
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });


// const saveBookModel = async (title, author, fileData) => {
//     const newBook = new Book({
//       title,
//       author,
//       file: fileData,
//     });
//     return newBook.save();
//   };
  

// // Handle the POST request when 'next step' is clicked
// router.post('/storeBook', upload.single('file'), async (req, res) => {
//   try {
//     const { title, author } = req.body; // Assuming you're sending these in the request
//     const fileData = req.file.buffer;

//     // Create a new book document and save it to the collection
//     const newBook = new Book({
//       title,
//       author,
//     //   username,
//       file: fileData,
//     });
//     await newBook.save();

//     // Send a success response
//     res.status(200).json({ message: 'Book data has been stored.' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'An error occurred while saving the book data.' });
//   }
// });

// module.exports = router;



const mongoose = require('mongoose');
const Joi = require('joi');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  file: String,
  email: String,

});

const Book = mongoose.model('books', bookSchema);


const validateBook = (data) => {
  const schema = Joi.object({
    title: Joi.string().required().label('Title'),
    author: Joi.string().required().label('Author'),
    email: Joi.string().required().label('email'),
    file: Joi.string().required().label('file'),

  });
  return schema.validate(data);
};

module.exports = { Book, validateBook };

