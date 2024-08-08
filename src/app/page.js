'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from 'antd';

const Home = () => {
  const router = useRouter();

  const createRetroTool = () => {
    const retroId = `${Date.now()}-${Math.random()}`;
    router.push(`/retro/${retroId}`);
  };

  return (
    <main className="main-container">
      <Button onClick={createRetroTool} type="primary">
        Create New Retro Tool
      </Button>
    </main>
  );
};

export default Home;
