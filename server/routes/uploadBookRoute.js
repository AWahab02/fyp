const router = require("express").Router();
const { Book } = require("../models/uploadBook");
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // const destination = path.join(__dirname, 'files'); // Define the destination directory
        // if (!fs.existsSync(destination)) {
        //     fs.mkdirSync(destination, { recursive: true });
        // }
        cb(null, "./files");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now();
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

router.post("/", upload.single("file"), async (req, res) => {
    try {
        const { title, author, email } = req.body;
        const file = req.file; // Access the uploaded file

        if (!title || !author || !email || !file) {
            return res.status(400).send({ message: "Please provide all required fields." });
        }

        const book = new Book({
            title: title,
            author: author,
            email: email,
            file: file.filename, // Store the file path
        });
        await book.save(); // Store the book data in your database
        res.status(201).send({ message: "Book Created successfully" });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;


// router.post("/", async (req, res) => {
//     console.log(req.body);

//     try {
//         const { title, author, email, file } = req.body;
//         if (!title || !author || !email || !file) {
//             return res.status(400).send({ message: "Please provide all required fields." });
//         }

//         console.log(req.body);

//         await new Book(req.body).save(); // Store the plain text password directly
//         res.status(201).send({ message: "Book Created successfully" });
//     } catch (error) {
//         res.status(500).send({ message: "Internal Server Error" });
//     }
// });

// module.exports = router;
