// src/components/Main.jsx

'use client';
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { Button, Skeleton, Input, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { addComment, voteComment, addActionItem, resetVotes } from '../redux/slices/card';
import jsPDF from 'jspdf';
import ActionItems from './ActionItems';
import Column from './Column';

const socket = io('http://localhost:4001');

const Main = () => {
  const [step, setStep] = useState(1);
  const [comments, setComments] = useState({
    workedWell: '',
    couldImprove: '',
    askAbout: '',
    actionItems: '',
  });
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

  const handleAddComment = (column) => {
    if (!comments[column].trim()) {
      message.error('Comment cannot be empty');
      return;
    }
    const newComment = { 
      text: comments[column], 
      visible: true, // user can see their own comment
      votes: 0, 
      column, 
      sessionId 
    };
    socket.emit('addComment', newComment);
    setComments(prevState => ({ ...prevState, [column]: '' }));
  };

  const handleVote = (id) => {
    if (totalVotesUsed < 5) {
      const comment = reduxComments.find(c => c.id === id);
      if (comment) {
        dispatch(voteComment({ id }));
        socket.emit('voteComment', { id });
      } else {
        console.error(`Comment with id ${id} not found`);
      }
    } else {
      alert('You have used all your votes.');
    }
  };

  const handleAddActionItem = () => {
    if (!comments.actionItems.trim()) {
      message.error('Action item cannot be empty');
      return;
    }
    const actionItem = { text: comments.actionItems, column: 'actionItems' };
    dispatch(addActionItem(actionItem));
    setComments(prevState => ({ ...prevState, actionItems: '' }));
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
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Column 
          title="It worked well that..." 
          comments={reduxComments.filter(c => c.column === 'workedWell')}
          isEditable={step === 1}
          isVisible={step > 1}
          comment={comments.workedWell}
          setComment={(text) => setComments(prevState => ({ ...prevState, workedWell: text }))}
          handleAddComment={() => handleAddComment('workedWell')}
          handleVote={handleVote}
          column="workedWell"
          sessionId={sessionId}
          step={step}
        />
        <Column 
          title="We could improve..." 
          comments={reduxComments.filter(c => c.column === 'couldImprove')}
          isEditable={step === 1}
          isVisible={step > 1}
          comment={comments.couldImprove}
          setComment={(text) => setComments(prevState => ({ ...prevState, couldImprove: text }))}
          handleAddComment={() => handleAddComment('couldImprove')}
          handleVote={handleVote}
          column="couldImprove"
          sessionId={sessionId}
          step={step}
        />
        <Column 
          title="I want to ask about..." 
          comments={reduxComments.filter(c => c.column === 'askAbout')}
          isEditable={step === 1}
          isVisible={step > 1}
          comment={comments.askAbout}
          setComment={(text) => setComments(prevState => ({ ...prevState, askAbout: text }))}
          handleAddComment={() => handleAddComment('askAbout')}
          handleVote={handleVote}
          column="askAbout"
          sessionId={sessionId}
          step={step}
        />
        {step === 3 && (
          <ActionItems/>
        )}
      </div>
      {step < 4 && <Button onClick={nextStep}>Next Step</Button>}
      {step === 4 && <Button onClick={exportPDF}>Export as PDF</Button>}
      {step === 4 && <Button onClick={resetVotes}>Reset Votes</Button>}
    </div>
  );
};

export default Main;
