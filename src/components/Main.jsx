'use client';
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { Button, Skeleton, Input } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { addComment, updateComment, voteComment, addActionItem, resetVotes } from '../redux/slices/card';
import jsPDF from 'jspdf';
import ActionItems from './ActionItems';

const socket = io('http://localhost:4001');

const Main = () => {
  const [step, setStep] = useState(1);
  const [comments, setComments] = useState({
    workedWell: '',
    couldImprove: '',
    askAbout: '',
  });
  const reduxComments = useSelector(state => state.cards.comments);
  const actionItems = useSelector(state => state.cards.actionItems); // Eklenen satır
  const totalVotesUsed = useSelector(state => state.cards.totalVotesUsed);
  const dispatch = useDispatch();

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
  }, [socket, dispatch]);

  const handleAddComment = (column) => {
    const newComment = { text: comments[column], visible: step > 1, votes: 0, column };
    socket.emit('addComment', newComment);
    setComments(prevState => ({ ...prevState, [column]: '' }));
  };

  const handleVote = (index, column) => {
    if (totalVotesUsed < 5) {
      const comment = reduxComments.find(c => c.column === column && c.index === index);
      if (comment) {
        dispatch(voteComment({ index, column }));
        socket.emit('voteComment', { index, column });
      } else {
        console.error(`Comment with index ${index} not found in column ${column}`);
      }
    } else {
      alert('You have used all your votes.');
    }
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Retrospective Results", 10, 10);
    doc.text("Comments:", 10, 20);
    reduxComments.forEach((comment, index) => {
      doc.text(`${index + 1}. ${comment.text} (Votes: ${comment.votes || 0})`, 10, 30 + index * 10);
    });
    doc.text("Action Items:", 10, 30 + reduxComments.length * 10);
    actionItems.forEach((item, index) => { // Eklenen satır
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
        />
        {step === 3 && (
          <ActionItems />
        )}
      </div>
      {step < 4 && <Button onClick={nextStep}>Next Step</Button>}
      {step === 4 && <Button onClick={exportPDF}>Export as PDF</Button>}
      {step === 4 && <Button onClick={resetVotes}>Reset Votes</Button>}
    </div>
  );
};

const Column = ({ title, comments, isEditable, isVisible, comment, setComment, handleAddComment, handleVote, column }) => {
  return (
    <div style={{ flex: 1, margin: '0 10px' }}>
      <h3>{title}</h3>
      {isEditable && (
        <>
          <Input.TextArea 
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your comment here..."
          />
          <Button onClick={handleAddComment}>Add Comment</Button>
        </>
      )}
      <div>
        {comments.map((c) => (
          <Comment 
            key={c.index} // Ensure unique key, assuming `index` is unique
            comment={c}
            isVisible={isVisible}
            handleVote={() => handleVote(c.index, column)}
          />
        ))}
      </div>
    </div>
  );
};

const Comment = ({ comment, isVisible, handleVote }) => {
  if (!comment) {
    return <Skeleton active />;
  }
  
  return (
    <div>
      {isVisible ? (
        <>
          <span>{comment.text}</span>
          <Button onClick={handleVote}>Vote</Button>
          <span>{comment.votes || 0}</span>
        </>
      ) : (
        <Skeleton active />
      )}
    </div>
  );
};

export default Main;