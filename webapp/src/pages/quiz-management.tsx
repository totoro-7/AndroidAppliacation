import React, { useState, useEffect, FormEvent } from 'react';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';

export default function QuizManagement() {
  const [quizTitle, setQuizTitle] = useState('');
  const [sessionCode, setSessionCode] = useState('');
  const [quizzes, setQuizzes] = useState<any[]>([]); // Temporary 'any' type, ideally define a type for your quiz

  useEffect(() => {
    const q = query(collection(db, 'quizzes'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedQuizzes = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data() // The data will also be of type 'any' by default
      }));
      setQuizzes(fetchedQuizzes);
    });

    return () => unsubscribe();
  }, []);

  const createQuiz = async (e: FormEvent<HTMLFormElement>) => { // Corrected type for 'e'
    e.preventDefault();

    // Add a new quiz to Firestore
    await addDoc(collection(db, 'quizzes'), {
      title: quizTitle,
      sessionCode: sessionCode,
      createdAt: serverTimestamp(),
    });

    setQuizTitle('');
    setSessionCode('');
  };

  return (
    <div>
      <h1>Quiz Management</h1>
      <form onSubmit={createQuiz}>
        <input
          type="text"
          placeholder="Quiz Title"
          value={quizTitle}
          onChange={(e) => setQuizTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Session Code"
          value={sessionCode}
          onChange={(e) => setSessionCode(e.target.value)}
        />
        <button type="submit">Create Quiz</button>
      </form>
      <div>
        <h2>Existing Quizzes</h2>
        <ul>
          {quizzes.map(quiz => (
            <li key={quiz.id}>
              {quiz.title} - Code: {quiz.sessionCode}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
