// src/app/components/Main.jsx
'use client';

import React from 'react';
import CommentSection from './CommentSection';
import styles from '../styles/css/main.css';

const Main = () => {
  return (
    <div className={styles.main}>
      <CommentSection />
    </div>
  );
};

export default Main;
