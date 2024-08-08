import React, { useState } from 'react';
import { Input, Button, message, Card } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { addActionItem } from '../redux/slices/card';
import { addActionItemToFirestore } from '@/services/firestoreService';

const ActionItems = ({retroId}) => {
  const [action, setAction] = useState('');
  const actionItems = useSelector(state => state.cards.actionItems);
  const dispatch = useDispatch();

  const handleAddAction = async () => {
    if (!action.trim()) {
      message.error('Action item cannot be empty');
      return;
    }

    const actionItem = { text: action, column: 'actionItems' };
    await addActionItemToFirestore(retroId, actionItem);
    dispatch(addActionItem(actionItem));
    setAction('');
  };

  return (
    <Card title="Action Items">
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
