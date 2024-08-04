'use client';
import React, { useState, useEffect } from 'react';
import { Input, Button, Skeleton } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { addComment, updateComment } from '../redux/slices/card';

const Brainstorm = ({ socket }) => {
  const [comment, setComment] = useState('');
  const [isEditing, setIsEditing] = useState(null);
  const [editText, setEditText] = useState('');
  const comments = useSelector(state => state.cards.comments);
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on('commentAdded', (data) => {
      dispatch(addComment(data));
    });
  }, [socket, dispatch]);

  const handleAddComment = () => {
    const newComment = { text: comment, visible: true, votes: 0 };
    socket.emit('addComment', newComment);
    setComment('');
  };

  const handleUpdateComment = (index, text) => {
    dispatch(updateComment({ index, text }));
    setIsEditing(null);
  };

  return (
    <div>
      <Input.TextArea 
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your comment here..."
      />
      <Button onClick={handleAddComment}>Add Comment</Button>
      <div>
        {comments.map((c, index) => (
          <Comment
            key={index}
            comment={c}
            isEditing={isEditing === index}
            onEdit={() => setIsEditing(index)}
            onCancel={() => setIsEditing(null)}
            editText={editText}
            onTextChange={setEditText}
            onUpdate={(text) => handleUpdateComment(index, text)}
          />
        ))}
      </div>
    </div>
  );
};

const Comment = ({ comment, isEditing, onEdit, onCancel, editText, onTextChange, onUpdate }) => {
  return (
    <div>
      {isEditing ? (
        <>
          <Input.TextArea 
            value={editText}
            onChange={(e) => onTextChange(e.target.value)}
          />
          <Button onClick={() => onUpdate(editText)}>Save</Button>
          <Button onClick={onCancel}>Cancel</Button>
        </>
      ) : (
        <>
          <span>{comment.visible ? comment.text : <Skeleton active />}</span>
          {comment.visible && <Button onClick={onEdit}>Edit</Button>}
        </>
      )}
    </div>
  );
};

export default Brainstorm;
