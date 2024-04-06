// src/services/quizService.js

import { ref, push, set, onValue, update } from 'firebase/database';
import { realtimeDb } from '../firebase';

export const generateSessionCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const createQuiz = async (quizData) => {
  const quizzesRef = ref(realtimeDb, 'quizzes');
  const newQuizRef = push(quizzesRef);
  await set(newQuizRef, { ...quizData, sessionCode: generateSessionCode() });
  return newQuizRef.key;
};

export const listenToQuizzes = (updateFunc) => {
  const quizzesRef = ref(realtimeDb, 'quizzes');
  return onValue(quizzesRef, (snapshot) => {
    const quizzesData = [];
    snapshot.forEach((childSnapshot) => {
      quizzesData.push({
        id: childSnapshot.key,
        ...childSnapshot.val(),
      });
    });
    console.log('Quizzes fetched:', quizzesData); // Log fetched quizzes
    updateFunc(quizzesData);
  });
};

export const setSessionCodeForQuiz = (quizId, sessionCode) => {
  const quizRef = ref(realtimeDb, `quizzes/${quizId}`);
  return update(quizRef, { sessionCode });
};
