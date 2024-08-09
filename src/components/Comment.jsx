import React, { useState, useEffect } from 'react';
import { Avatar, Button, Skeleton } from 'antd';
import styles from '@/styles/css/module.module.css';
import {  AiOutlineLike } from "react-icons/ai";
import { DeleteOutlined } from '@ant-design/icons';

const Comment = ({ comment, isVisible, handleVote, handleDelete, step }) => {
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
      <span className={styles ['commentText']}>{comment.text}</span>
      {step === 1 ? (
        <Button  onClick={handleDelete} className={styles.commentDelete}><DeleteOutlined /> </Button>
      ) : (
        <>
          <Button onClick={handleVote} className={styles.commentVotes}><AiOutlineLike/></Button>
          <span>{comment.votes || 0}</span>
        </>
      )}
    </div>
  );
};

export default Comment;
