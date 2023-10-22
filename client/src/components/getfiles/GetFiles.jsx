import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FileList = () => {
    const [files, setFiles] = useState([]);

    useEffect(() => {
        // Make an API request to fetch the list of files from the server
        axios.get('/list-files') // Make sure this matches your server route
            .then((response) => {
                setFiles(response.data.files);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    return (
        <div>
            <h1>List of Files</h1>
            <ul>
                {files.map((file) => (
                    <li key={file.name}>
                        <a href={file.link} target="_blank" rel="noopener noreferrer">
                            {file.name}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FileList;
