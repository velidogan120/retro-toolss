'use client';
import React, { useState, useEffect } from 'react';
import { Avatar, Button, Skeleton } from 'antd';
import { DeleteOutlined, LikeOutlined } from '@ant-design/icons';
import styles from '@/styles/css/module.module.css';

const Comment = ({ comment, isVisible, handleVote, showDelete }) => {
  const [userImg, setUserImg] = useState('');

  useEffect(() => {
    const images = [
      '/assets/img/avatar1.jpg',
      '/assets/img/avatar2.jpg',
      '/assets/img/avatar3.jpg',
      '/assets/img/avatar4.jpg',
      '/assets/img/avatar5.jpg',
      '/assets/img/avatar6.jpg',
      '/assets/img/avatar7.jpg',
      '/assets/img/avatar8.jpg',
      '/assets/img/avatar9.jpg',
    ];
    const randomImage = images[Math.floor(Math.random() * images.length)];
    setUserImg(randomImage);
  }, []);

  if (!comment) {
    return <Skeleton active />;
  }

  return (
    <div className={styles.comment}>
      <Avatar src={userImg} alt="User Avatar" className={styles['commentAvatar']} />
      {isVisible ? (
        <>
          <span className={styles['commentText']}>{comment.text}</span>
          <Button icon={<LikeOutlined />} onClick={handleVote} className={styles['commentActions']}></Button>
          <span className={styles['commentVotes']}>{comment.votes || 0}</span>
          {showDelete && (
            <Button icon={<DeleteOutlined />} className={styles['commentDelete']} />
          )}
        </>
      ) : (
        <Skeleton active className={styles['commentText']} />
      )}
    </div>
  );
};

export default Comment;
