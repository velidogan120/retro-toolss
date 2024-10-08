import { db } from '../redux/firebase';
import { collection, addDoc, updateDoc, doc, getDocs, query, where, deleteDoc } from 'firebase/firestore';
export const deleteActionItemFromFirestore = async (retroId, actionItemId) => {
  try {
    const actionItemRef = doc(db, `retros/${retroId}/actionItems`, actionItemId);
    await deleteDoc(actionItemRef);
  } catch (error) {
    console.error("Error deleting action item: ", error);
  }
};
export const deleteCommentFromFirestore = async (retroId, commentId) => {
  try {
    const commentRef = doc(db, `retros/${retroId}/comments`, commentId);
    await deleteDoc(commentRef);
  } catch (error) {
    console.error("Error deleting comment: ", error);
  }
};
export const addCommentToFirestore = async (retroId, comment) => {
  try {
    const commentsRef = collection(db, `retros/${retroId}/comments`);
    await addDoc(commentsRef, comment);
  } catch (error) {
    console.error("Error adding comment: ", error);
  }
};

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

export const addActionItemToFirestore = async (retroId, actionItem) => {
  try {
    const actionItemsRef = collection(db, `retros/${retroId}/actionItems`);
    await addDoc(actionItemsRef, actionItem);
  } catch (error) {
    console.error("Error adding action item: ", error);
  }
};

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
