import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import NavBar from '../navComponent/navBar';
import BgImage from './homepage_bg.png';
import One from './1.png';
import Three from './3.png';
import Four from './4.png';
import './styles.css';
import Example from './example.png';
import Carousel1 from './ex1.png';
import Carousel2 from './ex2.png';
import Carousel3 from './ex3.png';
import Carousel4 from './ex4.png';
import Left from './left.png';
import axios from "axios";
import Right from './right.png';

const userEmail = localStorage.getItem("token");
console.log("Token from localStorage:", userEmail);


const HomePage = () => {
  const images = [Carousel1, Carousel2, Carousel3, Carousel4];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const fileInputRef = useRef(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [bookData, setBookData] = useState({
    title: "",
    author: "",
    file: null,
    email: userEmail,
  });

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
  const containerStyle = {
    marginTop: '50px', // Added margin to the top
  };

  const Dots = () => {
    return (
      <div className="dots">
        <div className={`ellipse-colored ${currentImageIndex === 0 ? 'ellipse-colored' : 'ellipse'}`} />
        <div className={`div ${currentImageIndex === 1 ? 'div-colored' : 'div'}`} />
        <div className={`ellipse-2 ${currentImageIndex === 2 ? 'ellipse-2-colored' : 'ellipse-2'}`} />
        <div className={`ellipse-3 ${currentImageIndex === 3 ? 'ellipse-3-colored' : 'ellipse-3'}`} />
      </div>
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };


  return (
    <div>
      <NavBar className="navbar" />
      <div>
        <img src={BgImage} alt="texture" className="texture" />
        <img src={One} className='one-image' />
        <img src={Example} className='example' />
        <div className="carousel-container">
          <img src={Left} alt="Left" className="carousel-button" onClick={handlePrevImage} />
          <img src={images[currentImageIndex]} alt={`Image ${currentImageIndex + 1}`} className="carousel-image" />
          <img src={Right} alt="Right" className="carousel-button1" onClick={handleNextImage} />
          <Dots />
        </div>
        <img src={Three} className='three-image' />
        <Link to="/library">
          <img src={Four} className='three-image' />
        </Link>
      </div>

    </div>
  );
};

export default HomePage;

