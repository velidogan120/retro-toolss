'use client';
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Brainstorm from '../components/Brainstorm';
import GroupVote from '../components/GrupVote';
import ActionItems from '../components/ActionItems';
import Results from '../components/Results';
import { Button } from 'antd';

const socket = io('http://localhost:4001');

const Main = () => {
  const [step, setStep] = useState(1);

  useEffect(() => {
    socket.on('commentAdded', (data) => {
      console.log('Comment added:', data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const nextStep = () => {
    setStep(step + 1);
  };

  return (
    <div>
      {step === 1 && <Brainstorm socket={socket} />}
      {step === 2 && <GroupVote socket={socket} />}
      {step === 3 && <ActionItems />}
      {step === 4 && <Results />}
      {step < 4 && <Button onClick={nextStep}>Next Step</Button>}
    </div>
  );
};

export default Main;
