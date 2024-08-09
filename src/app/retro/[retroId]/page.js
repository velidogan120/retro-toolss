"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  addComment,
  voteComment,
  addActionItem,
  resetVotes,
} from "@/redux/slices/card";
import {
  fetchCommentsFromFirestore,
  fetchActionItemsFromFirestore,
  addCommentToFirestore,
  addActionItemToFirestore,
} from "@/services/firestoreService";
import Column from "@/components/Column";
import ActionItems from "@/components/ActionItems";
import { Button, Row, Col, Layout } from "antd";
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

    return () => {
      socket.off("commentAdded");
      socket.off("voteComment");
      socket.off("resetVotes");
      socket.off("nextStep");
    };
  }, [dispatch, retroId]);

  const handleAddComment = async (column, text) => {
    if (!text.trim()) {
      alert("Comment cannot be empty");
      return;
    }
    const newComment = { text, visible: step > 1, votes: 0, column };
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

  const resetVotes = () => {
    dispatch(resetVotes());
    socket.emit("resetVotes");
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
        <img
          src="/assets/img/logo.svg"
          alt="Logo"
          style={{ height: "140px" }}
        />
        <div className={styles.title}>RetroMap</div>
        <div>
          {step < 4 && (
            <Button className={styles.nextButton} onClick={nextStep}>
              Next Step
            </Button>
          )}
          {step === 4 && (
            <>
              <Button className={styles.exportButton} onClick={exportPDF}>
                Export as PDF
              </Button>
            </>
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
            column="workedWell"
            isEditable={step === 1}
            isVisible={step > 1}
            isVotingEnabled={step < 3} // Oy verme işlemi 3. aşamada devre dışı kalacak
            colorClass={styles.orangeCard}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Column
            title="We could improve..."
            comments={reduxComments.filter((c) => c.column === "couldImprove")}
            handleAddComment={handleAddComment}
            handleVote={handleVote}
            column="couldImprove"
            isEditable={step === 1}
            isVisible={step > 1}
            isVotingEnabled={step < 3} // Oy verme işlemi 3. aşamada devre dışı kalacak
            colorClass={styles.blueCard}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Column
            title="I want to ask about..."
            comments={reduxComments.filter((c) => c.column === "askAbout")}
            handleAddComment={handleAddComment}
            handleVote={handleVote}
            column="askAbout"
            isEditable={step === 1}
            isVisible={step > 1}
            isVotingEnabled={step < 3} // Oy verme işlemi 3. aşamada devre dışı kalacak
            colorClass={styles.greenCard}
          />
        </Col>
        {step >= 3 && (
          <Col xs={24} sm={12} md={6}>
            <ActionItems retroId={retroId} />
          </Col>
        )}
      </Row>
    </div>
  );
};

export default RetroToolPage;
