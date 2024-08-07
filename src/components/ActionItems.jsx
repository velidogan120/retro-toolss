'use client';
import React, { useState } from 'react';
import { Input, Button, message, Card } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { addActionItem } from '../redux/slices/card';

const ActionItems = () => {
  const [action, setAction] = useState('');
  const actionItems = useSelector(state => state.cards.actionItems);
  const dispatch = useDispatch();

  const handleAddAction = () => {
    if (!action.trim()) {
      message.error('Action item cannot be empty');
      return;
    }

    const actionItem = { text: action, column: 'actionItems' };
    dispatch(addActionItem(actionItem));
    setAction('');
  };

  return (
    <Card title="Action Items" className="column">
      <Input 
        value={action}
        onChange={(e) => setAction(e.target.value)}
        placeholder="Write action item here..."
      />
      <Button onClick={handleAddAction} style={{ marginTop: '10px' }}>Add Action Item</Button>
      <div>
        {actionItems.map((item, index) => (
          <div key={index}>{item.text}</div>
        ))}
      </div>
    </Card>
  );
};

export default ActionItems;
