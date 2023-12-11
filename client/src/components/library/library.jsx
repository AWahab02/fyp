import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from '../navComponent/navBar';
import BgImage from './library_bg.png';
import UserBooks from './userbooks';

const Library = () => {
  const [userId, setUserId] = useState('your_user_id'); // Replace with the actual user ID

  // // Assuming you have a way to set the user ID, such as through authentication
  // useEffect(() => {
  //   // Fetch user ID logic goes here...
  //   // setUserId(...);
  // }, []);

  return (
    <div>
      <div style={{ position: 'relative' }}>
        <img src={BgImage} style={{ width: '100%', height: '100%' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
          <NavBar />
          <UserBooks userId={userId} />
        </div>
      </div>
    </div>
  );
};

export default Library;
