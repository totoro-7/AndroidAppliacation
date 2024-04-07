import React, { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FirebaseContext } from '../context/FirebaseContext';
import { listenToQuizzes } from '../services/quizService';
import { Quiz } from '../types/quizTypes';
import { ref, push, set } from 'firebase/database';
import { getDatabase } from 'firebase/database';

const TeacherDashboard = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [expandedQuizId, setExpandedQuizId] = useState<string | null>(null);
  const [sessionCode, setSessionCode] = useState<string | null>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const { realtimeDb } = useContext(FirebaseContext);
  const router = useRouter();

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
    setSelectedQuizId(quizId);
    setExpandedQuizId(expandedQuizId === quizId ? null : quizId);
    setSessionCode(null);
    setIsSessionActive(false);
  };

  const handleGenerateSessionCode = () => {
    const newCode = generateSessionCode();
    setSessionCode(newCode);
    setIsSessionActive(false);
  };

  const startQuizSession = async () => {
    if (!selectedQuizId || !sessionCode) return;

    console.log(`Starting quiz session with ID: ${selectedQuizId} and session code: ${sessionCode}`);

    const sessionRef = push(ref(realtimeDb, 'sessions'));
    await set(sessionRef, {
      quizId: selectedQuizId,
      sessionCode: sessionCode,
      isActive: true,
      startedAt: new Date().toISOString(),
      attempts: {}
    });

    setIsSessionActive(true);
    router.push({
      pathname: '/quizTaking',
      query: { id: selectedQuizId, sessionCode: sessionCode },
    });
  };

  const emulateStudentQuiz = () => {
    if (selectedQuizId && sessionCode) {
      console.log(`Starting quiz session with ID: ${selectedQuizId} and session code: ${sessionCode}`);
      router.push({
        pathname: `/quiz/${selectedQuizId}`,
        query: { sessionCode: sessionCode }, 
      });
    }
  };

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">Teacher Dashboard</h1>
      <div className="space-y-4">
        {quizzes.map((quiz) => (
          <div key={quiz.id}>
            <div 
              className={`bg-white py-4 px-4 shadow rounded-lg mb-4 cursor-pointer ${selectedQuizId === quiz.id ? 'ring-2 ring-indigo-300' : ''}`} 
              onClick={() => handleQuizSelection(quiz.id)}
            >
              <h2 className="text-2xl font-semibold text-gray-800">{quiz.title}</h2>
            </div>
            {expandedQuizId === quiz.id && (
              <div className="bg-white py-2 px-4 mb-4 rounded-lg shadow">
                {quiz.questions.map((question, qIndex) => (
                  <div key={qIndex} className="my-2">
                    <p className="text-md font-semibold">{question.questionText}</p>
                    <ol className="list-decimal pl-6">
                      {question.options.map((option, oIndex) => (
                        <li key={oIndex} className="text-sm my-1">{option}</li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {selectedQuizId && (
          <div className="mt-4 p-5 border w-full shadow-lg rounded-md bg-white text-center">
            {sessionCode ? (
              <>
                <div className="mt-2 mb-4 px-7 py-3 bg-indigo-100 text-indigo-600 rounded-lg text-2xl">{sessionCode}</div>
                <div className="flex justify-around">
                  <button onClick={startQuizSession} className="bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Start Quiz
                  </button>
                  <button onClick={emulateStudentQuiz} className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Emulate Student
                  </button>
                </div>
              </>
            ) : (
              <button onClick={handleGenerateSessionCode} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Generate Session Code
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;