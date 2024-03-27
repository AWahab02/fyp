const router = require("express").Router();
const { Book } = require("../models/uploadBook");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');




const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./files");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });


// Define the path to the Python script
// const pythonScriptPath = path.join(__dirname, '..', 'chatgpt.py');
const pythonScriptPath = path.resolve(__dirname, '..', 'Code_Story', 'chatgpt.py');


router.post("/", upload.single("file"), async (req, res) => {
    try {
        const { title, author, email } = req.body;
        const file = req.file;

        if (!title || !author || !email || !file) {
            return res.status(400).send({ message: "Please provide all required fields." });
        }

        const book = new Book({
            title: title,
            author: author,
            email: email,
            file: file.filename,
        });

        await book.save();
        const uploadedFilePath = path.join(__dirname, '..', 'files', file.filename);

        console.log("YE HAI FILE PATH");
        console.log(uploadedFilePath);
        // Execute the Python script
        exec(`python ${pythonScriptPath} "${uploadedFilePath}"`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing Python script: ${error.message}`);
                return res.status(500).send({ message: "Internal Server Error" });
            }
            if (stderr) {
                console.error(`Python script encountered an error: ${stderr}`);
                return res.status(500).send({ message: "Internal Server Error" });
            }
            console.log(`Python script output: ${stdout}`);
            res.status(201).send({ message: "Book Created successfully" });
        });
        
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;
