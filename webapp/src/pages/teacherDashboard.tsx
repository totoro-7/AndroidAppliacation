import React, { useState, useContext, useEffect } from 'react';
import { FirebaseContext } from '../context/FirebaseContext';
import { listenToQuizzes } from '../services/quizService';
import { Quiz } from '../types/quizTypes';
import { getDatabase, ref, set, push } from 'firebase/database';

const TeacherDashboard = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [sessionCode, setSessionCode] = useState<string | null>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const { realtimeDb } = useContext(FirebaseContext);

  useEffect(() => {
    const unsubscribe = listenToQuizzes((newQuizzes: Quiz[]) => {
      setQuizzes(newQuizzes);
    });

    return () => unsubscribe();
  }, [realtimeDb]);

  const generateSessionCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleQuizSelection = (quizId: string) => {
    if (quizId !== selectedQuizId) {
      setSelectedQuizId(quizId);
      setSessionCode(null);
      setIsSessionActive(false);
    }
  };

  const handleGenerateSessionCode = () => {
    const newCode = generateSessionCode();
    setSessionCode(newCode);
    setIsSessionActive(false);
  };

  const startQuizSession = async () => {
    if (!selectedQuizId || !sessionCode) return;

    const sessionRef = push(ref(realtimeDb, 'sessions'));
    await set(sessionRef, {
      quizId: selectedQuizId,
      sessionCode: sessionCode,
      isActive: true,
      startedAt: new Date().toISOString(),
    });

    setIsSessionActive(true);
    // Here you can also navigate to the quiz monitoring page or do any other logic required to start the quiz
  };

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">Teacher Dashboard</h1>
      <div className="space-y-4">
        {quizzes.map((quiz) => (
          <div
            key={quiz.id}
            className={`bg-white py-4 px-4 shadow rounded-lg mb-4 cursor-pointer ${selectedQuizId === quiz.id ? 'ring-2 ring-indigo-300' : ''}`}
            onClick={() => handleQuizSelection(quiz.id)}
          >
            <h2 className="text-2xl font-semibold text-gray-800">{quiz.title}</h2>
          </div>
        ))}
        {selectedQuizId && !sessionCode && (
          <button
            onClick={handleGenerateSessionCode}
            className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
          >
            Generate Session Code for {quizzes.find((quiz) => quiz.id === selectedQuizId)?.title}
          </button>
        )}
        {sessionCode && !isSessionActive && (
          <div className="mt-4 p-5 border w-full shadow-lg rounded-md bg-white text-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Session Code</h3>
            <div className="mt-2 px-7 py-3 bg-indigo-100 text-indigo-600 rounded-lg text-2xl">{sessionCode}</div>
            <button
              onClick={startQuizSession}
              className="mt-4 bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
            >
              Start Quiz for {quizzes.find((quiz) => quiz.id === selectedQuizId)?.title}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
