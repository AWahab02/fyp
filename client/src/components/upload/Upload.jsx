import React, { useRef, useState } from "react";
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
import axios from "axios";

const userEmail = localStorage.getItem("token");
console.log("Token from localStorage:", userEmail);




const Upload = () => {

  const fileInputRef = useRef(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [bookData, setBookData] = useState({
    title: "",
    author: "",
    file: null,
    email: userEmail,
  });

  const handleTitleChange = (e) => {
    setBookData({
      ...bookData,
      title: e.target.value,
    });
  };

  const handleAuthorChange = (e) => {
    setBookData({
      ...bookData,
      author: e.target.value,
    });
  };

  const handleButtonClick = () => {
    if (selectedFileName !== "upload") {
      setSelectedFileName("upload")

      setBookData({
        ...bookData,
        file: null,
      });
      return
    }
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {


      // Shorten the filename if it's too long
      const fileName = selectedFile.name;
      if (fileName.length > 15) {
        const shortenedFileName = fileName.slice(0, 7) + "...";
        setSelectedFileName(shortenedFileName);
      } else {
        setSelectedFileName(fileName);
      }

      setBookData({
        ...bookData,
        file: selectedFile,
      });

      console.log(`Selected file: ${fileName}`);
    }
  };

  const handleNextStepClick = async (e) => {


    e.preventDefault();

    try {
      const url = "http://localhost:8080/api/upload";
      const response = await axios.post(url, bookData, {
        headers: {
          'Content-Type': 'multipart/form-data', 
        },
      });
      if (response.status >= 200 && response.status < 300) {
        console.log(response.data.message);
        window.alert(response.data.message);
      } else {
        console.error("Unexpected response:", response);
      }
    } catch (error) {
      // Handle Axios errors
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        console.log('here')
        console.log(error.response.data.message);
        window.alert(error.response.data.message);

      } else {
        // Handle other errors (e.g., network issues, server not available)
        console.error("An error occurred:", error);
      }
    }
  };
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
              <div className="book-square-shape" onClick={handleButtonClick}>
                <p className="book-btn-text">{selectedFileName || 'upload'}</p>
                <img src={line} className="book-btn-line" alt="line" />
                <img src={cross} className="book-btn-cross" alt="cross" />
                <input
                  type="file"
                  accept=".pdf"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <form className="book-info-input">

              <div className="next-step-btn" onClick={handleNextStepClick}>
                <div className="next-step-shape">
                  <p className="next-btn-text">next step</p>
                </div>
              </div>
              <br />
            </form>


            <div className="right-page">
              <h1 className="tell-us">tell us</h1>
              <h1 className="about-your">about your</h1>
              <h1 className="bookk">book</h1>
              <div>
                <br />
                <div className="input-container">
                  <img src={require('./book-icon.png')} alt="Book Icon" className="image" />
                  <input className="inputme" type="text" placeholder="book title" value={bookData.title} onChange={handleTitleChange} />
                </div>
                <br />
                <div className="input-container">
                  <img src={require('./author.png')} alt="Book Icon" className="imageme" />
                  <input className="inputme" type="text" placeholder="author" value={bookData.author} onChange={handleAuthorChange} />
                </div>
              </div>
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

        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default Upload;
