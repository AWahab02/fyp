import React, { useState, useEffect } from 'react';
import NavBar from '../navComponent/navBar';
import axios from 'axios';
import './styles.modules.css';

const userEmail = localStorage.getItem("token");

const UserProfile = () => {
    const [userProfile, setUserProfile] = useState({
        username: 'awzahid12',
        email: 'awzahid',
        password: 'awzahid',
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
      

    const handleFirstNameChange = (e) => {
        setUserProfile({
            ...userProfile,
            username: e.target.value,
        });
    };

    const handleEmailChange = (e) => {
        setUserProfile({
            ...userProfile,
            email: e.target.value,
        });
    };

    const handlePasswordChange = (e) => {
        setUserProfile({
            ...userProfile,
            password: e.target.value,
        });
    };

    const handleSaveChanges = () => {
        const updatedUserData = {
            username: userProfile.username,
            email: userProfile.email,
            password: userProfile.password,
        };

        const api = axios.create({
            baseURL: 'http://localhost:8080', 
          });

        api.put('/api/users/profile', updatedUserData) 
            .then((response) => {
                // Handle success, e.g., show a success message
                window.alert('User Profile Updated!');

            })
            .catch((error) => {
                // Handle errors, e.g., show an error message
                console.error('Error updating user data:', error);
            });
    };

    return (
        <div className="user-profile">
            <NavBar className="navbar"/>

            <div className='centered-container'>

                <h2>User Profile</h2>
                <div className="profile-field">
                    <label htmlFor="username">Username: </label>
                    <input
                        type="text"
                        id="username"
                        value={userProfile.username}
                        onChange={handleFirstNameChange}
                    />
                </div>
                <br />
                <br />
                <div className="profile-field">
                    <label htmlFor="email">Email Address:</label>
                    <input
                        type="email"
                        id="email"
                        value={userProfile.email}
                        onChange={handleEmailChange}
                    />
                </div>
                <br />
                <br />
                <div className="profile-field">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={userProfile.password}
                        onChange={handlePasswordChange}
                    />
                </div>
                <br />
                <br />
                <button onClick={handleSaveChanges}>Save Changes</button>
            </div>
        </div>
    );
};

export default UserProfile;
