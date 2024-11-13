// pages/index.jsx

import React, { useContext, useEffect, useState, useCallback } from 'react';
import styles from './HomePage.module.scss';
import axios from 'axios';
import { UserContext } from '../../UserContext';
import { useToggle } from '../../ToggleContext';
import Post from '../Post/Post';
import PostForm from '../PostForm/PostForm';
import Footer from '../footer/footer';

export default function HomePage() {
  const { id } = useContext(UserContext);
  const { isToggled } = useToggle();
  const [userData, setUserData] = useState({});
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user data
  useEffect(() => {
    if (id) {
      axios
        .get(`/api/profile?id=${id}`)
        .then((response) => {
          setUserData(response.data);
        })
        .catch((error) => console.error(error));
    }
  }, [id]);

  // Fetch posts
  useEffect(() => {
    if (userData.friends) {
      axios
        .get('/api/posts')
        .then((response) => {
          const posts = response.data
            .filter((post) => userData.friends.includes(post.creator?._id) || post.creator?._id === id)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setAllPosts(posts);
          setLoading(false);
        })
        .catch((error) => console.error(error));
    }
  }, [userData, id]);

  // Handle like
  const handleLikeClick = useCallback(
    async (postId) => {
      try {
        const data = { userId: id, type: 'like' };
        const response = await axios.put(`/api/posts?id=${postId}`, data);
        setAllPosts((prevPosts) =>
          prevPosts.map((post) => (post._id === postId ? response.data : post))
        );
      } catch (error) {
        console.error(error);
      }
    },
    [id]
  );

  // Handle comment input
  const handleCommentInput = useCallback(
    async (e, postId, commentText, setCommentText) => {
      e.preventDefault();
      if (!commentText.trim()) return;

      const data = {
        userId: id,
        type: 'comment',
        comment: commentText,
        firstName: userData.firstName,
        lastName: userData.lastName,
        profilePic: userData.photo,
      };

      try {
        await axios.put(`/api/posts?id=${postId}`, data);
        setCommentText('');
        // Optionally refresh posts or update comments
        setAllPosts((prevPosts) =>
          prevPosts.map((post) => {
            if (post._id === postId) {
              return {
                ...post,
                comments: [
                  ...post.comments,
                  {
                    content: commentText,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    profilePic: userData.photo,
                  },
                ],
              };
            }
            return post;
          })
        );
      } catch (error) {
        console.error(error);
      }
    },
    [id, userData]
  );

  // Handle delete post
  const deletePost = useCallback(
    async (postId) => {
      try {
        await axios.delete(`/api/posts?id=${postId}`);
        setAllPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
      } catch (error) {
        console.error('Error deleting the post:', error);
      }
    },
    []
  );

  // Dark mode effect
  useEffect(() => {
    document.body.style.backgroundColor = isToggled ? '#28282B' : 'rgb(236, 235, 235)';
  }, [isToggled]);

  return (
    <div className={styles.home}>
      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : (
        <>
          <PostForm userData={userData} setAllPosts={setAllPosts} />
          <div className={styles.posts}>
            {allPosts.map((post) => (
              <Post
                key={post._id}
                post={post}
                userId={id}
                handleLikeClick={handleLikeClick}
                handleCommentInput={handleCommentInput}
                deletePost={deletePost}
              />
            ))}
          </div>
          <Footer />
        </>
      )}
    </div>
  );
}
