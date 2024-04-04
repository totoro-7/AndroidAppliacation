// src/pages/teacherDashboard.tsx

import React, { useState, useContext, useEffect } from 'react';
import { FirebaseContext } from '../context/FirebaseContext';
import { listenToQuizzes } from '../services/quizService';
import { Quiz } from '../types/quizTypes'; // Ensure you have created this type

export default function TeacherDashboard() {
  // Initialize the state with the correct type
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  const { realtimeDb } = useContext(FirebaseContext);

  useEffect(() => {
    // Assuming listenToQuizzes is properly implemented to call setQuizzes with Quiz[]
    const unsubscribe = listenToQuizzes(setQuizzes);
    return () => unsubscribe();
  }, [realtimeDb]);

  return (
    <div>
      <h1>Teacher Dashboard</h1>
      <ul>
        {quizzes.map((quiz) => (
          <li key={quiz.id}>{quiz.title}</li>
        ))}
      </ul>
    </div>
  );
}
