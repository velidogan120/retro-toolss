import React, { useState } from 'react';
import { Input, Button, message } from 'antd';
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
    <div>
      <Input 
        value={action}
        onChange={(e) => setAction(e.target.value)}
        placeholder="Write action item here..."
      />
      <Button onClick={handleAddAction}>Add Action Item</Button>
      <div>
        {actionItems.map((item, index) => (
          <div key={index}>{item.text}</div>
        ))}
      </div>
    </div>
  );
};

export default ActionItems;
