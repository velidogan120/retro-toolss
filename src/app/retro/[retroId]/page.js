'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { addComment, voteComment, addActionItem, resetVotes, deleteComment } from '@/redux/slices/card';
import { fetchCommentsFromFirestore, fetchActionItemsFromFirestore, addCommentToFirestore, addActionItemToFirestore, deleteCommentFromFirestore } from '@/services/firestoreService';
import Column from '@/components/Column';
import ActionItems from '@/components/ActionItems';
import { Button, Col, Row } from 'antd';
import io from 'socket.io-client';
import jsPDF from 'jspdf';
import styles from "@/styles/css/module.module.css";
const socket = io('http://localhost:4001');

const RetroToolPage = ({ params }) => {
  const { retroId } = params;
  const [step, setStep] = useState(1);
  const reduxComments = useSelector(state => state.cards.comments);
  const actionItems = useSelector(state => state.cards.actionItems);
  const totalVotesUsed = useSelector(state => state.cards.totalVotesUsed);
  const dispatch = useDispatch();
  const router = useRouter();
  const [sessionId] = useState(() => `${Date.now()}-${Math.random()}`);
  useEffect(() => {
    const initialize = async () => {
      const comments = await fetchCommentsFromFirestore(retroId);
      const actionItems = await fetchActionItemsFromFirestore(retroId);
      comments.forEach(comment => dispatch(addComment(comment)));
      actionItems.forEach(item => dispatch(addActionItem(item)));
    };

    initialize();

    socket.on('commentAdded', (data) => {
      dispatch(addComment(data));
    });

    socket.on('voteComment', (data) => {
      dispatch(voteComment(data));
    });

    socket.on('resetVotes', () => {
      dispatch(resetVotes());
    });

    socket.on('nextStep', () => {
      setStep(prevStep => prevStep + 1);
    });
    socket.on('deleteActionItem', (actionItemId) => {
      dispatch(deleteActionItem(actionItemId));
    });
    return () => {
      socket.off('commentAdded');
      socket.off('voteComment');
      socket.off('resetVotes');
      socket.off('nextStep');
      socket.off('deleteActionItem');
    };
  }, [dispatch, retroId]);

  const handleDeleteActionItem = async (actionItemId) => {
    await deleteActionItemFromFirestore(retroId, actionItemId);
    dispatch(deleteActionItem(actionItemId));
    socket.emit('deleteActionItem', actionItemId);
  };

  const handleAddComment = async (column, text) => {
    if (!text.trim()) {
      alert('Comment cannot be empty');
      return;
    }
    const newComment = { text, visible: true, votes: 0, column, sessionId };
    await addCommentToFirestore(retroId, newComment);    
    socket.emit('addComment', newComment);
  };

  const handleVote = (index, column) => {
    dispatch(voteComment({ index, column }));
    socket.emit('voteComment', { index, column });
  };
  const handleDelete = async (commentId) => {
    await deleteCommentFromFirestore(retroId, `${commentId}`);
    dispatch(deleteComment(commentId));
    socket.emit('deleteComment', commentId);
  };
  const nextStep = () => {
    socket.emit('nextStep');
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Retrospective Results", 10, 10);
    doc.text("Comments:", 10, 20);
    reduxComments.forEach((comment, index) => {
      doc.text(`${index + 1}. ${comment.text} (Votes: ${comment.votes || 0})`, 10, 30 + index * 10);
    });
    doc.text("Action Items:", 10, 30 + reduxComments.length * 10);
    actionItems.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.text}`, 10, 40 + reduxComments.length * 10 + index * 10);
    });
    doc.save("results.pdf");
  };

  const resetVotes = () => {
    dispatch(resetVotes());
    socket.emit('resetVotes');
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.topBar}>
        {step < 4 && <Button onClick={nextStep} style={{ marginTop: '20px' }}>Next Step</Button>}
        {step === 4 && <Button onClick={exportPDF} style={{ marginTop: '20px' }}>Export as PDF</Button>}
        {step === 4 && <Button onClick={resetVotes} style={{ marginTop: '20px' }}>Reset Votes</Button>}
      </div>
      <Row gutter={16} className={styles.row}>
        <Col xs={24} sm={12} md={6}>
          <Column 
            title="It worked well that..." 
            comments={reduxComments.filter(c => c.column === 'workedWell')}
            handleAddComment={handleAddComment}
            handleVote={handleVote}
            handleDelete={handleDelete}
            column="workedWell"
            isEditable={step === 1}
            isVisible={step > 1}
            sessionId={sessionId}
            step={step}
            colorClass={styles.orangeCard} 
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Column 
            title="We could improve..." 
            comments={reduxComments.filter(c => c.column === 'couldImprove')}
            handleAddComment={handleAddComment}
            handleVote={handleVote}
            handleDelete={handleDelete}
            column="couldImprove"
            isEditable={step === 1}
            isVisible={step > 1}
            sessionId={sessionId}
            step={step}
            colorClass={styles.orangeCard} 
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Column 
            title="I want to ask about..." 
            comments={reduxComments.filter(c => c.column === 'askAbout')}
            handleAddComment={handleAddComment}
            handleVote={handleVote}
            handleDelete={handleDelete}
            column="askAbout"
            isEditable={step === 1}
            isVisible={step > 1}
            sessionId={sessionId}
            step={step}
            colorClass={styles.orangeCard} 
          />
        </Col>
        {step >= 3 && (
          <Col xs={24} sm={12} md={6} className={styles.column}>
            <ActionItems retroId={retroId} />
          </Col>
        )}
      </Row>
      
    </div>
  );
};

export default RetroToolPage;