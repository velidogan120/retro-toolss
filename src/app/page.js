"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "antd";
import styles from "./page.module.css";

const Home = () => {
  const router = useRouter();

  const createRetroTool = () => {
    const retroId = `${Date.now()}-${Math.random()}`;
    router.push(`/retro/${retroId}`);
  };

  return (
    <main className={styles.mainContainer}>
      <Button
        onClick={createRetroTool}
        type="primary"
        className={styles.centerButton}
      >
        Create New Retro Tool
      </Button>
    </main>
  );
};

export default Home;
