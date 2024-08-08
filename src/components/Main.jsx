// src/components/Main.jsx

'use client';
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { addComment, voteComment, addActionItem, resetVotes } from '../redux/slices/card';
import jsPDF from 'jspdf';
import Column from './Column';
import ActionItems from './ActionItems';
import '../styles/scss/main.scss'; // SCSS dosyasını buraya import ediyoruz


const socket = io('http://localhost:4001');

const Main = () => {
  const [step, setStep] = useState(1);
  const reduxComments = useSelector(state => state.cards.comments);
  const actionItems = useSelector(state => state.cards.actionItems);
  const totalVotesUsed = useSelector(state => state.cards.totalVotesUsed);
  const dispatch = useDispatch();
  const [sessionId] = useState(() => `${Date.now()}-${Math.random()}`); // unique session id for each user

  useEffect(() => {
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
  }, [dispatch]);

  const handleAddComment = (column, text) => {
    if (!text.trim()) {
      alert('Comment cannot be empty');
      return;
    }
    const newComment = { text, visible: step > 1, votes: 0, column };
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
