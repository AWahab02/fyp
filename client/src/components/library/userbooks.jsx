import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Shelf from './shelf.png';
import Plus from './plus.png';
const userEmail = localStorage.getItem("token");

const UserBooks = ({ userId }) => {
  const [userProfile, setUserProfile] = useState({
    username: 'awzahid12',
    email: 'awzahid',
    password: 'awzahid',
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
      console.log(userData)
      setUserProfile(userData);
    })
    .catch((error) => {
      console.error('Error fetching user data:', error);
    });
  }, [])

  const handleAddBook = () => {
    const title = prompt("Enter book title:");
    const author = prompt("Enter book author:");
    const pages = prompt("Enter number of pages:");

    if (title && author && pages) {
      const newBook = { title, author, pages };
      setUserProfile(prevProfile => ({
        ...prevProfile,
        library_books: [...prevProfile.library_books, newBook],
      }));

      // Update the user's library_books in the MongoDB collection
      const api = axios.create({
        baseURL: 'http://localhost:8080',
      });

      api.put('/api/users/addBook', {
        email: userEmail,
        newBook,
      })
      .then((response) => {
        console.log('Book added successfully:', response.data);
      })
      .catch((error) => {
        console.error('Error adding book:', error);
      });
    }
  };

  return (
    <ul style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start', marginLeft: '200px' }}>
      {userProfile.library_books.map((book, index) => (
        <li key={index} style={{ listStyleType: 'none', margin: '50px', textAlign: 'center' }}>
          <img src={Shelf} alt="Shelf" style={{ width: '200px', height: '200px', marginBottom: '10px' }} />
          <div>
            <strong>Title:</strong> {book.title} <br />
            <strong>Author:</strong> {book.author} <br />
            <strong>Pages:</strong> {book.pages}
          </div>
        </li>
      ))}
      <li style={{ listStyleType: 'none', margin: '50px', textAlign: 'center' }} onClick={handleAddBook}>
        <img src={Plus} alt="Plus" style={{ width: '200px', height: '200px', marginBottom: '10px', cursor: 'pointer' }} />
      </li>
    </ul>
  );
};

export default UserBooks;
