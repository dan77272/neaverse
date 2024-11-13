// components/Post.jsx

import React, { useState, useRef, useEffect } from 'react';
import styles from './Post.module.scss';
import Link from 'next/link';
import { useToggle } from '@/ToggleContext';

export default function Post({ post, userId, handleLikeClick, handleCommentInput, deletePost }) {
  const { isToggled } = useToggle();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const menuRef = useRef(null);

  const toggleMenu = () => {
    if (menuRef.current) {
      menuRef.current.style.display = menuRef.current.style.display === 'block' ? 'none' : 'block';
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        menuRef.current.style.display = 'none';
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const timeDifference = (createdDateStr) => {
    const createdDate = new Date(createdDateStr);
    const currentDate = new Date();

    const diffMilliseconds = currentDate - createdDate;

    const diffSeconds = Math.floor(diffMilliseconds / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} days ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hours ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} minutes ago`;
    } else if (diffSeconds > 0) {
      return `${diffSeconds} seconds ago`;
    } else {
      return 'Just now';
    }
  };

  const isLiked = post.like.includes(userId);

  return (
    <div className={styles.post} style={isToggled ? { backgroundColor: '#36454F' } : {}}>
      <div className={styles.user}>
        <div className={styles.userInfo}>
          <div className={styles.image}>
            <img
              height='40'
              width='40'
              src={post.creator?.photo || 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png'}
              alt={`${post.creator?.firstName}'s profile`}
            />
          </div>
          <div className={styles.userInfoSub}>
            <Link href={'/profile/' + post.creator._id} className={styles.username} style={isToggled ? { color: 'white' } : {}}>
              {post.creator?.firstName} {post.creator?.lastName}
            </Link>
            <p className={styles.date}>{timeDifference(post.createdAt)}</p>
          </div>
        </div>
        {post.creator._id === userId && (
          <div className={styles.options}>
            <svg
              onClick={toggleMenu}
              height='30px'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth='1.5'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm6 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm6 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z'
              />
            </svg>
            <ul ref={menuRef} className={styles.menu} style={{ display: 'none' }}>
              <li onClick={() => deletePost(post._id)}>Delete</li>
              {/* Add more options if needed */}
            </ul>
          </div>
        )}
      </div>
      <div className={styles.content}>
        {post.content.endsWith('.png') || post.content.endsWith('.jpg') || post.content.endsWith('.jpeg') ? (
          <img src={post.content} alt='Post' />
        ) : (
          <p style={isToggled ? { color: 'white' } : {}}>{post.content}</p>
        )}
      </div>
      <div className={styles.postInfo}>
        <p style={isToggled ? { color: 'white' } : {}}>{post.likes} Likes</p>
      </div>
      <hr />
      <div className={styles.buttons}>
        <button
          onClick={() => handleLikeClick(post._id)}
          style={isLiked ? { color: isToggled ? '#DDC077' : 'blue' } : { color: isToggled ? 'white' : 'black' }}
        >
          {/* Like Icon */}
          Like
        </button>
        <button onClick={() => setShowComments(!showComments)} style={isToggled ? { color: 'white' } : {}}>
          {/* Comment Icon */}
          Comment
        </button>
      </div>
      <hr />
      {showComments && (
        <div className={styles.commentsSection}>
          <form onSubmit={(e) => handleCommentInput(e, post._id, commentText, setCommentText)}>
            <input
              type='text'
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder='Write a comment...'
            />
            <button type='submit'>Post Comment</button>
          </form>
          {post.comments.map((comment, index) => (
            <div key={index} className={styles.comment}>
              <img src={comment.profilePic || 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png'} alt={`${comment.firstName}'s profile`} />
              <div>
                <p>
                  <strong>
                    {comment.firstName} {comment.lastName}
                  </strong>
                </p>
                <p>{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
