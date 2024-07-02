import React, { useState, useEffect } from 'react';
import Avatar from 'react-avatar';
import { USER_API_END_POINT } from '../utils/constants';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { getUser, updateUser } from '../redux/userSlice';
import { updateUserDetailsInTweets } from '../redux/tweetSlice';

const EditProfile = ({ show, onClose, profile }) => {
  const [name, setName] = useState(profile?.name || '');
  const [username, setUsername] = useState(profile?.username || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [location, setLocation] = useState(profile?.location || '');
  const [coverPhoto, setCoverPhoto] = useState(profile?.coverPhoto || '/upload/default-profile.jpg');
  const [profilePhoto, setProfilePhoto] = useState(profile?.profilePhoto || '/upload/default-profile.jpg');
  const [coverPhotoFile, setCoverPhotoFile] = useState(null);
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setUsername(profile.username || '');
      setBio(profile.bio || '');
      setLocation(profile.location || '');
      setCoverPhoto(profile.coverPhoto || '/upload/default-profile.jpg');
      setProfilePhoto(profile.profilePhoto || '/upload/default-profile.jpg');
    }
  }, [profile]);

  if (!show) {
    return null;
  }

  const handleSave = async () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('username', username);
    formData.append('bio', bio);
    formData.append('location', location);
    if (coverPhotoFile) formData.append('coverPhoto', coverPhotoFile);
    if (profilePhotoFile) formData.append('profilePhoto', profilePhotoFile);

    try {
      const response = await axios.put(`${USER_API_END_POINT}/updateprofile/${profile._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      console.log('Profile updated successfully:', response.data);
      dispatch(updateUser(response.data.user));
      dispatch(updateUserDetailsInTweets(response.data.user));

      onClose();
      window.location.reload(); // Refresh the page
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCoverPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverPhoto(URL.createObjectURL(file));
      setCoverPhotoFile(file);
    }
  };

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(URL.createObjectURL(file));
      setProfilePhotoFile(file);
    }
  };

  const getCoverPhotoSrc = () => {
    if (coverPhoto !== '') {
      return coverPhoto;
    } else if (profile?.coverPhoto) {
      return `https://twitter-clone-backend-vx80.onrender.com${profile.coverPhoto}`;
    } else {
      return '/upload/default-profile.jpg'; // URL to a default cover photo if needed
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <div className="flex justify-between items-center">
          <button style={styles.closeButton} onClick={onClose}>
            &times;
          </button>
          <h1 className="text-xl font-bold">Edit Profile</h1>
          <button className="rounded-full bg-black text-white px-4 py-2" onClick={handleSave}>
            Save
          </button>
        </div>
        <div className="pt-3 relative">
          <label htmlFor="cover-photo-input">
            <img
              src={getCoverPhotoSrc()}
              alt="cover photo"
              className="w-full h-48 object-cover cursor-pointer"
            />
          </label>
          <input
            id="cover-photo-input"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleCoverPhotoChange}
          />
          <div className="absolute top-44 -mt-5 left-4 border-4 border-white rounded-full">
            <label htmlFor="profile-photo-input">
              <Avatar
                src={profilePhoto ? profilePhoto : `https://twitter-clone-backend-vx80.onrender.com${profile?.profilePhoto}`}
                size="120"
                round={true}
                className="cursor-pointer"
              />
            </label>
            <input
              id="profile-photo-input"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleProfilePhotoChange}
            />
          </div>
        </div>
        <div className="mt-20">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="w-full p-2 border border-gray-300 rounded my-4"
          />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full p-2 mb-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Bio"
            className="w-full p-2 mb-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="w-full p-2 mb-2 border border-gray-300 rounded"
          />
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  popup: {
    background: 'white',
    padding: '15px',
    borderRadius: '8px',
    width: '600px',
    height: 'auto',
    position: 'relative',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  closeButton: {
    border: 'none',
    background: 'transparent',
    fontSize: '24px',
    cursor: 'pointer',
  },
};

export default EditProfile;
