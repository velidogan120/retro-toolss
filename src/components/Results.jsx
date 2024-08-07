'use client';
import React from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'antd';
import jsPDF from 'jspdf';

const Results = () => {
  const comments = useSelector(state => state.cards.comments);
  const actionItems = useSelector(state => state.cards.actionItems);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Retrospective Results", 10, 10);
    doc.text("Comments:", 10, 20);
    comments.forEach((comment, index) => {
      doc.text(`${index + 1}. ${comment.text} (Votes: ${comment.votes})`, 10, 30 + index * 10);
    });
    doc.text("Action Items:", 10, 30 + comments.length * 10);
    actionItems.forEach((item, index) => {
      doc.text(`${index + 1}. ${item}`, 10, 40 + comments.length * 10 + index * 10);
    });
    doc.save("results.pdf");
  };

  return (
    <div>
      <Button onClick={exportPDF}>Export as PDF</Button>
    </div>
  );
};

export default Results;