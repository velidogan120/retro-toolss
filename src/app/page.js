'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from 'antd';

const Home = () => {
  const router = useRouter();

  const createRetroTool = () => {
    // Benzersiz bir retro ID'si oluştur
    const retroId = `${Date.now()}-${Math.random()}`;
    // Yeni retro aracının sayfasına yönlendir
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
