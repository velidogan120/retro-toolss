'use client';
import React, { useState, useEffect } from 'react';
import { Avatar, Button, Skeleton } from 'antd';
import { DeleteOutlined, LikeOutlined } from '@ant-design/icons';
import styles from '@/styles/css/module.css';

const Comment = ({ comment, isVisible, handleVote, showDelete }) => {
  const [userImg, setUserImg] = useState('');

  useEffect(() => {
    const images = [
      '/assets/img/pokemon1.jpg',
      '/assets/img/pokemon2.jpg',
      '/assets/img/pokemon3.jpg',
      '/assets/img/pokemon4.jpg',
      '/assets/img/1.jpg',
      '/assets/img/2.jpg',
      '/assets/img/3.jpg',
      '/assets/img/4.jpg',
      '/assets/img/5.jpg',
    ];
    const randomImage = images[Math.floor(Math.random() * images.length)];
    setUserImg(randomImage);
  }, []);

  if (!comment) {
    return <Skeleton active />;
  }

  return (
    <div className={styles.comment}>
      <Avatar src={userImg} alt="User Avatar" className={styles['comment-avatar']} />
      {isVisible ? (
        <>
          <span className={styles['comment-text']}>{comment.text}</span>
          <Button icon={<LikeOutlined />} onClick={handleVote} className={styles['comment-actions']}></Button>
          <span className={styles['comment-votes']}>{comment.votes || 0}</span>
          {showDelete && (
            <Button icon={<DeleteOutlined />} className={styles['comment-delete']} />
          )}
        </>
      ) : (
        <Skeleton active className={styles['comment-text']} />
      )}
    </div>
  );
};

export default Comment;
