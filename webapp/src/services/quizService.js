// src/services/quizService.js

import { ref, push, set, onValue } from 'firebase/database';
import { realtimeDb } from '../firebase'; // Make sure this import points to your Firebase config file

export const createQuiz = async (quizData) => {
  const quizzesRef = ref(realtimeDb, 'quizzes');
  const newQuizRef = push(quizzesRef);
  await set(newQuizRef, quizData);
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
    updateFunc(quizzesData);
  });
};
