import React, { useState, useContext, useEffect } from 'react';
import { FirebaseContext } from '../context/FirebaseContext';
import { listenToQuizzes } from '../services/quizService';
import { Quiz } from '../types/quizTypes';

const TeacherDashboard = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [sessionCodes, setSessionCodes] = useState<{ [key: string]: string }>({});
  const [showSessionModal, setShowSessionModal] = useState(false);
  const { realtimeDb } = useContext(FirebaseContext);

  useEffect(() => {
    const unsubscribe = listenToQuizzes((newQuizzes: Quiz[]) => {
      setQuizzes(newQuizzes);
    });
    return () => {
      unsubscribe();
    };
  }, [realtimeDb]);

  const handleQuizSelection = (quizId: string) => {
    setSelectedQuizId(quizId);
  };

  const generateSessionCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const generateAndSetSessionCode = () => {
    if (selectedQuizId) {
      const newCode = generateSessionCode();
      setSessionCodes((prevCodes) => ({ ...prevCodes, [selectedQuizId]: newCode }));
      setShowSessionModal(true);
    }
  };

  const closeModal = () => {
    setShowSessionModal(false);
  };

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">Teacher Dashboard</h1>
      <div className="space-y-4">
        {quizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="bg-white py-4 px-4 shadow rounded-lg mb-4 cursor-pointer"
            onClick={() => handleQuizSelection(quiz.id)}
          >
            <h2 className="text-2xl font-semibold text-gray-800">{quiz.title}</h2>
          </div>
        ))}
        {selectedQuizId && (
          <button
            onClick={generateAndSetSessionCode}
            className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
          >
            Generate Session Code for {quizzes.find((quiz) => quiz.id === selectedQuizId)?.title}
          </button>
        )}
      </div>

      {showSessionModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
          <div className="relative top-1/4 mx-auto p-5 border w-1/3 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Session Code</h3>
              <div className="mt-2 px-7 py-3 bg-indigo-100 text-indigo-600 rounded-lg text-2xl">
                {sessionCodes[selectedQuizId]}
              </div>
              <div className="items-center px-4 py-3">
                <button
                  id="ok-btn"
                  onClick={closeModal}
                  className="px-4 py-2 bg-indigo-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
