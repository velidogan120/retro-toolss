// src/app/components/CommentSection.jsx
'use client';

import React, { useState } from 'react';
import { Row, Col, Button } from 'antd';
import CommentCard from './CommentCard';
import styles from '../styles/css/commentsection.css';
import { jsPDF } from 'jspdf';

const initialCommentGroups = [
  {
    title: 'It worked well that...',
    comments: []
  },
  {
    title: 'We could improve...',
    comments: []
  },
  {
    title: 'I want to ask about...',
    comments: []
  },
  {
    title: 'Add Action Items',
    comments: []
  }
];

const CommentSection = () => {
  const [commentGroups, setCommentGroups] = useState(initialCommentGroups);
  const [stage, setStage] = useState(1);

  const handleAddComment = (groupIndex, newComment) => {
    const newCommentGroups = [...commentGroups];
    newCommentGroups[groupIndex].comments.push({
      text: newComment,
      userImg: '/assets/img/pokemon1.jpg',
      votes: 0
    });
    setCommentGroups(newCommentGroups);
  };

  const handleDeleteComment = (groupIndex, commentIndex) => {
    const newCommentGroups = [...commentGroups];
    newCommentGroups[groupIndex].comments.splice(commentIndex, 1);
    setCommentGroups(newCommentGroups);
  };

  const handleVote = (groupIndex, commentIndex) => {
    const newCommentGroups = [...commentGroups];
    newCommentGroups[groupIndex].comments[commentIndex].votes += 1;
    setCommentGroups(newCommentGroups);
  };

  const nextStage = () => {
    setStage(stage + 1);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    commentGroups.forEach((group) => {
      doc.text(group.title, 10, 10);
      doc.autoTable({
        startY: doc.autoTable.previous.finalY + 10,
        head: [['Comment', 'Votes']],
        body: group.comments.map(comment => [comment.text, comment.votes])
      });
    });
    doc.save('comments.pdf');
  };

  return (
    <div>
      <Row gutter={[16, 16]} className={styles.commentSection}>
        {commentGroups.map((group, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
            <CommentCard
              title={group.title}
              comments={group.comments}
              handleAddComment={(newComment) => handleAddComment(index, newComment)}
              handleDeleteComment={(commentIndex) => handleDeleteComment(index, commentIndex)}
              handleVote={(commentIndex) => handleVote(index, commentIndex)}
              isWritingStage={stage === 1 && index < 3}
              isVotingStage={stage === 2 && index < 3}
              isDeletingStage={stage === 1}
            />
          </Col>
        ))}
      </Row>
      <Button type="primary" onClick={nextStage} className={styles.nextButton} disabled={stage >= 3}>
        {stage === 1 ? 'Next: Voting' : stage === 2 ? 'Next: Add Action Items' : 'Completed'}
      </Button>
      {stage === 3 && (
        <Button type="primary" onClick={exportPDF} className={styles.exportButton}>
          Export PDF
        </Button>
      )}
    </div>
  );
};

export default CommentSection;
