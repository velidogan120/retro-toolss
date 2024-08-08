import React, { useState } from 'react';
import { Input, Button, message, Card } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { addActionItem } from '../redux/slices/card';
import { addActionItemToFirestore } from '@/services/firestoreService';
import { deleteActionItemFromFirestore } from '@/services/firestoreService';
import { deleteActionItem } from '../redux/slices/card';
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

  const handleDeleteActionItem = async (actionItemId) => {
    await deleteActionItemFromFirestore(retroId, actionItemId);
    dispatch(deleteActionItem(actionItemId));
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
          <div key={index}>
            {item.text}
            <Button onClick={() => handleDeleteActionItem(item.id)} style={{ marginLeft: '10px' }}>Delete</Button>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ActionItems;
