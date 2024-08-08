// src/services/firestoreService.js

import { db } from '../redux/firebase';
import { collection, addDoc, updateDoc, doc, getDocs, query, where } from 'firebase/firestore';

// Add a new comment
export const addCommentToFirestore = async (retroId, comment) => {
  try {
    const commentsRef = collection(db, `retros/${retroId}/comments`);
    await addDoc(commentsRef, comment);
  } catch (error) {
    console.error("Error adding comment: ", error);
  }
};

// Fetch comments
export const fetchCommentsFromFirestore = async (retroId) => {
  try {
    const commentsRef = collection(db, `retros/${retroId}/comments`);
    const q = query(commentsRef);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching comments: ", error);
    return [];
  }
};

// Add action item
export const addActionItemToFirestore = async (retroId, actionItem) => {
  try {
    const actionItemsRef = collection(db, `retros/${retroId}/actionItems`);
    await addDoc(actionItemsRef, actionItem);
  } catch (error) {
    console.error("Error adding action item: ", error);
  }
};

// Fetch action items
export const fetchActionItemsFromFirestore = async (retroId) => {
  try {
    const actionItemsRef = collection(db, `retros/${retroId}/actionItems`);
    const q = query(actionItemsRef);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching action items: ", error);
    return [];
  }
};