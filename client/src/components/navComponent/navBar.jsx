import React from "react";
import NavBarImage from "./navbar-image.png"; // Replace with the path to your image file
import HomeImg from "./home.png"; // Replace with the path to your image file
import PenImg from "./pen.png"; // Replace with the path to your image file
import ProfileImg from "./profile.png"; // Replace with the path to your image file
import "./styles.css"; // Import the CSS file with your styles

const NavBar = () => {
  return (
    <div className="navbar">
      <div className="logo">
        <img src={NavBarImage} alt="NavBar Logo" />
        <div className="navText">
          <span className="highlight">BOOK</span>2
          <span className="highlight">LIFE</span>
        </div>
      </div>
      <ul className="navList">
        <li className="navItem">
          <img src={HomeImg} alt="Home Icon" />
        </li>
        <li className="navItem">
          <img src={PenImg} alt="NavBar Icon" />
        </li>
        <li className="navItem">
          <img src={ProfileImg} alt="Profile Icon" />
        </li>
      </ul>
    </div>
  );
};

export default NavBar;
