// import React, { useState, useEffect } from 'react';
// import { Link } from "react-router-dom";
// import axios from 'axios';
// import Shelf from './shelf.png';
// import Plus from './plus.png';
// const userEmail = localStorage.getItem("token");

// const UserBooks = ({ userId }) => {
//     const [userProfile, setUserProfile] = useState({
//         username: '',
//         email: userEmail,
//         password: '',
//         library_books: [],
//     });

//     useEffect(() => {
//         const api = axios.create({
//             baseURL: 'http://localhost:8080',
//         });

//         api.get('/api/users/profile', {
//             params: {
//                 email: userEmail,
//             }
//         })
//             .then((response) => {
//                 const userData = response.data;
//                 console.log(userData)
//                 setUserProfile(userData);
//             })
//             .catch((error) => {
//                 console.error('Error fetching user data:', error);
//             });
//     }, [])

//     return (
//         <div>
//             <h2 style={{ fontSize: '42px', marginLeft: '300px' }}>{userProfile.username}'s library</h2>
//             <ul style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start', marginLeft: '200px' }}>
//                 {userProfile.library_books.map((book, index) => (
//                     <li key={index} style={{ listStyleType: 'none', margin: '50px', textAlign: 'center' }}>
//                         <a href={`http://localhost:8080/download/${book.title.replace(/ /g, "_")}.pdf`} download>
//                             <img src={Shelf} alt="Shelf" style={{ width: '200px', height: '200px', marginBottom: '10px' }} />
//                             <div>
//                                 <strong>Title:</strong> {book.title} <br />
//                                 <strong>Author:</strong> {book.author} <br />
//                             </div>
//                         </a>
//                     </li>
//                 ))}
//                 <Link to='/upload'>
//                     <li style={{ listStyleType: 'none', margin: '50px', textAlign: 'center' }}>
//                         <img src={Plus} alt="Plus" style={{ width: '200px', height: '200px', marginBottom: '10px', cursor: 'pointer' }} />
//                     </li>
//                 </Link>
//             </ul>
//         </div>
//     );
// };

// export default UserBooks;
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import Shelf from './shelf.png';
import Plus from './plus.png';

const userEmail = localStorage.getItem("token");

const UserBooks = ({ userId }) => {
    const [userProfile, setUserProfile] = useState({
        username: '',
        email: userEmail,
        password: '',
        library_books: [],
    });

    useEffect(() => {
        const api = axios.create({
            baseURL: 'http://localhost:8080',
        });

        api.get('/api/users/profile', {
            params: {
                email: userEmail,
            }
        })
        .then((response) => {
            const userData = response.data;
            setUserProfile(userData);
        })
        .catch((error) => {
            console.error('Error fetching user data:', error);
        });
    }, []);

    const handleBookClick = (title, author, filename) => {
        const matchedBook = userProfile.library_books.find(book => book.title === title && book.author === author);
        if (matchedBook) {
            const downloadableTitle = `${title}.pdf`;
            const downloadUrl = `http://localhost:8080/download/${encodeURIComponent(downloadableTitle)}`;
            window.open(downloadUrl);
        } else {
            console.log("Book not found.");
        }
    };

    return (
        <div>
            <h2 style={{ fontSize: '42px', marginLeft: '300px' }}>{userProfile.username}'s library</h2>
            <ul style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start', marginLeft: '200px' }}>
                {userProfile.library_books.map((book, index) => (
                    <li key={index} style={{ listStyleType: 'none', margin: '50px', textAlign: 'center' }}>
                        <a href="#" onClick={() => handleBookClick(book.title, book.author, book.filename)}>
                            <img src={Shelf} alt="Shelf" style={{ width: '200px', height: '200px', marginBottom: '10px' }} />
                            <div>
                                <strong>Title:</strong> {book.title} <br />
                                <strong>Author:</strong> {book.author} <br />
                            </div>
                        </a>
                    </li>
                ))}
                <Link to='/upload'>
                    <li style={{ listStyleType: 'none', margin: '50px', textAlign: 'center' }}>
                        <img src={Plus} alt="Plus" style={{ width: '200px', height: '200px', marginBottom: '10px', cursor: 'pointer' }} />
                    </li>
                </Link>
            </ul>
        </div>
    );
};

export default UserBooks;
