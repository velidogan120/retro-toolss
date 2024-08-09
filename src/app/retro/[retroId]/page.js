"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  addComment,
  voteComment,
  addActionItem,
  resetVotes,
  deleteComment,
} from "@/redux/slices/card";
import {
  fetchCommentsFromFirestore,
  fetchActionItemsFromFirestore,
  addCommentToFirestore,
  addActionItemToFirestore,
  deleteCommentFromFirestore,
} from "@/services/firestoreService";
import Column from "@/components/Column";
import ActionItems from "@/components/ActionItems";
import { Button, Col, Image, Row, Layout } from "antd";
import io from "socket.io-client";
import jsPDF from "jspdf";
import styles from "@/styles/css/module.module.css";

const { Header } = Layout;
const socket = io("http://localhost:4001");

const RetroToolPage = ({ params }) => {
  const { retroId } = params;
  const [step, setStep] = useState(1);
  const reduxComments = useSelector((state) => state.cards.comments);
  const actionItems = useSelector((state) => state.cards.actionItems);
  const totalVotesUsed = useSelector((state) => state.cards.totalVotesUsed);
  const dispatch = useDispatch();
  const router = useRouter();
  const [sessionId] = useState(() => `${Date.now()}-${Math.random()}`);
  useEffect(() => {
    const initialize = async () => {
      const comments = await fetchCommentsFromFirestore(retroId);
      const actionItems = await fetchActionItemsFromFirestore(retroId);
      comments.forEach((comment) => dispatch(addComment(comment)));
      actionItems.forEach((item) => dispatch(addActionItem(item)));
    };

    initialize();

    socket.on("commentAdded", (data) => {
      dispatch(addComment(data));
    });

    socket.on("voteComment", (data) => {
      dispatch(voteComment(data));
    });

    socket.on("resetVotes", () => {
      dispatch(resetVotes());
    });

    socket.on("nextStep", () => {
      setStep((prevStep) => prevStep + 1);
    });
    socket.on("deleteActionItem", (actionItemId) => {
      dispatch(deleteActionItem(actionItemId));
    });
    return () => {
      socket.off("commentAdded");
      socket.off("voteComment");
      socket.off("resetVotes");
      socket.off("nextStep");
      socket.off("deleteActionItem");
    };
  }, [dispatch, retroId]);

  const handleDeleteActionItem = async (actionItemId) => {
    await deleteActionItemFromFirestore(retroId, actionItemId);
    dispatch(deleteActionItem(actionItemId));
    socket.emit("deleteActionItem", actionItemId);
  };

  const handleAddComment = async (column, text) => {
    if (!text.trim()) {
      alert("Comment cannot be empty");
      return;
    }
    const newComment = { text, visible: true, votes: 0, column, sessionId };
    await addCommentToFirestore(retroId, newComment);
    socket.emit("addComment", newComment);
  };

  const handleVote = (index, column) => {
    if (step >= 3) {
      alert("Oy kullanma işlemi sona ermiştir.");
      return;
    }
    dispatch(voteComment({ index, column }));
    socket.emit("voteComment", { index, column });
  };
  const handleDelete = async (commentId) => {
    await deleteCommentFromFirestore(retroId, `${commentId}`);
    dispatch(deleteComment(commentId));
    socket.emit("deleteComment", commentId);
  };
  const nextStep = () => {
    socket.emit("nextStep");
  };

  const exportPDF = () => {
    const doc = new jsPDF();

    doc.setFont("Edu AU VIC WA NT Hand", "sans-serif");

    doc.setFontSize(12);
    let y = 10;

    doc.text("Action Items:", 10, y);
    y += 10;

    actionItems.forEach((item, index) => {
      const text = `${index + 1}. ${item.text}`;
      const lines = doc.splitTextToSize(text, 180);

      if (y + lines.length * 10 > 290) {
        doc.addPage();
        y = 10;
      }

      lines.forEach((line) => {
        doc.text(line, 10, y);
        y += 10;
      });
    });

    doc.save("action_items.pdf");
  };

  return (
    <div className={styles.mainContainer}>
      <Header
        className={styles.header}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Image
          src="/assets/img/logo.svg"
          alt="Logo"
          style={{ height: "140px" }}
        ></Image>
        <div className={styles.title}>RetroMap</div>
        <div>
          {step < 4 && (
            <Button
              onClick={nextStep}
              style={{ marginTop: "20px" }}
              className={styles.exportButton}
            >
              Next Step
            </Button>
          )}
          {step === 4 && (
            <Button onClick={exportPDF} style={{ marginTop: "20px" }}>
              Export as PDF
            </Button>
          )}
        </div>
      </Header>
      <Row gutter={16} className={styles.row}>
        <Col xs={24} sm={12} md={6}>
          <Column
            title="It worked well that..."
            comments={reduxComments.filter((c) => c.column === "workedWell")}
            handleAddComment={handleAddComment}
            handleVote={handleVote}
            handleDelete={handleDelete}
            column="workedWell"
            isEditable={step === 1}
            isVisible={step > 1}
            sessionId={sessionId}
            step={step}
            colorClass={styles.blueCard}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Column
            title="We could improve..."
            comments={reduxComments.filter((c) => c.column === "couldImprove")}
            handleAddComment={handleAddComment}
            handleVote={handleVote}
            handleDelete={handleDelete}
            column="couldImprove"
            isEditable={step === 1}
            isVisible={step > 1}
            sessionId={sessionId}
            step={step}
            colorClass={styles.orangeCard}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Column
            title="I want to ask about..."
            comments={reduxComments.filter((c) => c.column === "askAbout")}
            handleAddComment={handleAddComment}
            handleVote={handleVote}
            handleDelete={handleDelete}
            column="askAbout"
            isEditable={step === 1}
            isVisible={step > 1}
            sessionId={sessionId}
            step={step}
            colorClass={styles.greenCard}
          />
        </Col>
        {step >= 3 && (
          <Col xs={24} sm={12} md={6} className={styles.column}>
            <ActionItems retroId={retroId} />
          </Col>
        )}
      </Row>
    </div>
  );
};

export default RetroToolPage;
