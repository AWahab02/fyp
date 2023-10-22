require('dotenv').config()
const express = require('express');
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const { Schema } = mongoose;
const connection = require('./db');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const uploadbBookRoutes = require('./routes/uploadBookRoute')
const downloadBook = require('./routes/downloadBook')
const multer = require('multer'); 
const path = require('path');
const fs = require('fs');


const sch = new Schema({
    username: String,
    email: String,
    password: String
}, {versionKey: false})


const mongoosemodel = mongoose.model("users", sch)
//database connection
connection();

//middleware
app.use(express.json());
app.use(cors());
app.use("/files", express.static("files"))

app.get("/list-files", async (req, res) => {
    try {
        const directoryPath = path.join(__dirname, 'files');

        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                console.error(err);
                res.status(500).send("Server error");
            } else {
                const fileList = files.map(fileName => {
                    return {
                        name: fileName,
                        link: `/files/${fileName}`,
                    };
                });

                // Generate an HTML page with clickable links
                const html = `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>List of Files</title>
                    </head>
                    <body>
                        <h1>List of Files</h1>
                        <ul>
                            ${fileList.map(file => `<li><a href="${file.link}">${file.name}</a></li>`).join('')}
                        </ul>
                    </body>
                    </html>
                `;

                res.send(html);
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

// Create a route for file downloads
app.get("/download/:fileName", (req, res) => {
    const fileName = req.params.fileName;
    const filePath = path.join(__dirname, 'files', fileName);

    // Check if the file exists
    if (fs.existsSync(filePath)) {
        // If the file exists, send it as a download
        res.download(filePath);
    } else {
        res.status(404).send("File not found");
    }
});


//routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadbBookRoutes)

const port = process.env.PORT || 8080;
app.listen(port, ()=> console.log(`Listening on port ${port}...`))

