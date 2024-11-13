// components/PostForm.jsx

import React, { useState } from 'react';
import styles from './PostForm.module.scss';
import axios from 'axios';
import { useToggle } from '@/ToggleContext';

export default function PostForm({ userData, setAllPosts }) {
  const { isToggled } = useToggle();
  const [postContent, setPostContent] = useState('');
  const [postPhoto, setPostPhoto] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!postContent.trim() && !postPhoto.trim()) return;

    try {
      const postData = {
        content: postPhoto || postContent,
        creator: userData._id,
        likes: 0,
      };
      const response = await axios.post('/api/posts', postData);
      setAllPosts((prevPosts) => [response.data, ...prevPosts]);
      setPostContent('');
      setPostPhoto('');
    } catch (error) {
      console.error(error);
    }
  };

  const uploadImages = async (ev) => {
    const files = ev.target.files;
    if (files.length > 0) {
      const data = new FormData();
      for (const file of files) {
        data.append('file', file);
      }
      try {
        const res = await axios.post('/api/upload', data);
        setPostPhoto(res.data.secure_url);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className={styles.input}>
      <form onSubmit={handleSubmit} style={isToggled ? { backgroundColor: '#36454F' } : {}}>
        <img
          className={styles.img}
          height='60'
          width='60'
          src={userData.photo || 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png'}
          alt={`${userData.firstName}'s profile`}
        />
        <input
          type='text'
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          placeholder="What's on your mind?"
        />
        <div className={styles.buttons}>
          <button className={styles.postButton} type='submit'>
            Post
          </button>
          <label htmlFor='fileInput' className={styles.fileInputButton}>
            Upload Photo
          </label>
          <input type='file' id='fileInput' className={styles.postPhoto} onChange={uploadImages} />
        </div>
      </form>
      {postPhoto && (
        <div className={styles.photoPreview}>
          <p>Photo is uploaded! Click on "Post" to share your photo.</p>
          <img src={postPhoto} alt='Preview' />
        </div>
      )}
    </div>
  );
}
