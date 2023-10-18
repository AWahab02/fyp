import React from "react";
import NavBar from "../navComponent/navBar";
import watercolorBottom from "./watercolorBottom.png"; // Replace with the path to your image file
import watercolorLeft from "./watercolorLeft.png"; // Replace with the path to your image file
import watercolorRight from "./watercolorRight.png"; // Replace with the path to your image file
import texture from "./texture1.png"; // Replace with the path to your image file
import book from "./book overlay.png";
import "./styles.css"; // Import the CSS file with your styles
import arrow from "./arrow.png";
import cross from "./cross.png";
import line from "./line.png";

const Upload = () => {
  return (
    <div className="container">
      <NavBar className="navbar" />
      <div className="water-colors">
        <div className="upload-body">
          <div className="illustrate-your-book">
            <h1 className="illustrate-heading">illustrate</h1>
            <h1 className="illustrate-heading">
              <span className="span-illustrate">your</span> book
            </h1>
            <h1 className="illustrate-heading">today!</h1>
          </div>

          <div className="book-components">
            <img src={book} alt="book" className="book" />
            <div className="left-page">
              <h1 className="upload">upload</h1>
              <h1 className="from">from</h1>
              <h1 className="device">device</h1>
            </div>
            <img src={arrow} alt="arrow-left" className="arrow-left" />
            <div className="book-btn">
              <div className="book-square-shape">
                <p className="book-btn-text">book.pdf</p>
                <img src={line} className="book-btn-line" alt="line" />
                <img src={cross} className="book-btn-cross" alt="cross" />
              </div>
            </div>

            <form className="book-info-input">
              <div className="next-step-btn">
                <div className="next-step-shape">
                  <p className="next-btn-text">next step</p>
                </div>
              </div>
            </form>
            <div className="right-page">
              <h1 className="tell-us">tell us</h1>
              <h1 className="about-your">about your</h1>
              <h1 className="bookk">book</h1>
            </div>
          </div>
        </div>

        <img src={texture} alt="texture" className="texture" />
        <img
          src={watercolorBottom}
          alt="Watercolor Bottom"
          className="watercolor-bottom"
        />
        <img
          src={watercolorLeft}
          alt="Watercolor Left"
          className="watercolor-left"
        />
        <img
          src={watercolorRight}
          alt="Watercolor Right"
          className="watercolor-right"
        />
      </div>
    </div>
  );
};

export default Upload;
