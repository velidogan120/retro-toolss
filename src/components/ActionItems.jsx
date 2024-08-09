import React, { useState } from 'react';
import { Input, Button, Card } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { addActionItem } from '@/redux/slices/card';
import { addActionItemToFirestore } from '@/services/firestoreService';
import styles from '@/styles/css/module.module.css';

const ActionItems = ({ retroId }) => {
  const [actionText, setActionText] = useState('');
  const actionItems = useSelector((state) => state.cards.actionItems);
  const dispatch = useDispatch();

  const handleAddActionItem = async () => {
    if (!actionText.trim()) {
      alert('Action item cannot be empty');
      return;
    }
    const newActionItem = { text: actionText };
    await addActionItemToFirestore(retroId, newActionItem);
    dispatch(addActionItem(newActionItem));
    setActionText('');
  };

  return (
    <Card title="Add Action Item">
      <Input.TextArea
        value={actionText}
        onChange={(e) => setActionText(e.target.value)}
        placeholder="Write action item here..."
      />
      <Button onClick={handleAddActionItem} style={{ marginTop: '10px' }}>Add Action Item</Button>
      <div>
        {actionItems.map((item, index) => (
          <div key={index}>{item.text}</div>
        ))}
      </div>
    </Card>
  );
};

export default ActionItems;
