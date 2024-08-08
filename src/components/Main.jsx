// src/components/Main.jsx

'use client';
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { addComment, voteComment, addActionItem, resetVotes } from '../redux/slices/card';
import { fetchCommentsFromFirestore, fetchActionItemsFromFirestore, addCommentToFirestore, addActionItemToFirestore } from '../services/firestoreService';
import Column from './Column';
import ActionItems from './ActionItems';
import '../styles/scss/main.scss'; // SCSS dosyasını buraya import ediyoruz

const socket = io('http://localhost:4001');

const Main = () => {
  const [step, setStep] = useState(1);
  const [retroId, setRetroId] = useState(() => `${Date.now()}-${Math.random()}`); // unique session id for each user
  const reduxComments = useSelector(state => state.cards.comments);
  const actionItems = useSelector(state => state.cards.actionItems);
  const totalVotesUsed = useSelector(state => state.cards.totalVotesUsed);
  const dispatch = useDispatch();

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

    // Clean up the event listeners on unmount
    return () => {
      socket.off('commentAdded');
      socket.off('voteComment');
      socket.off('resetVotes');
      socket.off('nextStep');
    };
  }, [dispatch, retroId]);

  const handleAddComment = async (column, text) => {
    if (!text.trim()) {
      alert('Comment cannot be empty');
      return;
    }
    const newComment = { text, visible: step > 1, votes: 0, column };
    await addCommentToFirestore(retroId, newComment);
    socket.emit('addComment', newComment);
  };

  const handleVote = (index, column) => {
    dispatch(voteComment({ index, column }));
    socket.emit('voteComment', { index, column });
  };

  const nextStep = () => {
    socket.emit('nextStep');
  };

  const exportPDF = () => {
    // PDF generation logic here
  };

  const resetVotes = () => {
    dispatch(resetVotes());
    socket.emit('resetVotes');
  };

  return (
    <div className="main-container">
      <Column 
        title="It worked well that..." 
        comments={reduxComments.filter(c => c.column === 'workedWell')}
        handleAddComment={handleAddComment}
        handleVote={handleVote}
        column="workedWell"
        isEditable={step === 1}
        isVisible={step > 1}
      />
      <Column 
        title="We could improve..." 
        comments={reduxComments.filter(c => c.column === 'couldImprove')}
        handleAddComment={handleAddComment}
        handleVote={handleVote}
        column="couldImprove"
        isEditable={step === 1}
        isVisible={step > 1}
      />
      <Column 
        title="I want to ask about..." 
        comments={reduxComments.filter(c => c.column === 'askAbout')}
        handleAddComment={handleAddComment}
        handleVote={handleVote}
        column="askAbout"
        isEditable={step === 1}
        isVisible={step > 1}
      />
      {step >= 3 && (
        <ActionItems />
      )}
      {step < 4 && <Button onClick={nextStep} style={{ marginTop: '20px' }}>Next Step</Button>}
      {step === 4 && <Button onClick={exportPDF} style={{ marginTop: '20px' }}>Export as PDF</Button>}
      {step === 4 && <Button onClick={resetVotes} style={{ marginTop: '20px' }}>Reset Votes</Button>}
    </div>
  );
};

export default Main;
