const express = require('express');
const router = express.Router();
const Book = require('../models/uploadBook'); // Replace with your actual book model

router.get('/download-book/:title', async (req, res) => {
  try {
    const title = req.params.title;

    // Find the book in the database based on the title
    const book = await Book.findOne({ title });

    if (!book) {
      return res.status(404).send('Book not found');
    }

    // Respond with the file (assuming it's stored as a path on your server)
    const filePath = book.filePath; // Replace with the actual path to the file
    res.download(filePath);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
