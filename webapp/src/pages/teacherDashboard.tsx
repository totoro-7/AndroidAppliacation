import React, { useState, useContext, useEffect } from 'react'; // Import useState, useContext, and useEffect
import { FirebaseContext } from '../context/FirebaseContext'; // Import FirebaseContext
import { listenToQuizzes } from '../services/quizService'; // Import listenToQuizzes function
import { Quiz } from '../types/quizTypes'; // Import Quiz type

const TeacherDashboard = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [sessionCodes, setSessionCodes] = useState<{ [key: string]: string }>({});
  const { realtimeDb } = useContext(FirebaseContext);

  useEffect(() => {
    const unsubscribe = listenToQuizzes((newQuizzes: Quiz[]) => {
       console.log('Setting quizzes state:', newQuizzes);
      setQuizzes(newQuizzes);
    });
    return () => {
      unsubscribe();
    };
  }, [realtimeDb]);

  // Helper function to generate a session code
  const generateSessionCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase(); // Generate a random 6-character alphanumeric string
  };

  // Function to generate and set a session code for a quiz
  const generateAndSetSessionCode = (quizId: string) => {
    const newCode = generateSessionCode();
    setSessionCodes(prevCodes => ({ ...prevCodes, [quizId]: newCode }));
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Teacher Dashboard</h1>
      <div className="space-y-4">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-3">{quiz.title}</h2>
            <button
              onClick={() => generateAndSetSessionCode(quiz.id)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none transition ease-in-out duration-300"
            >
              Generate Session Code
            </button>
            {sessionCodes[quiz.id] && (
              <p className="mt-2 text-lg">Session Code: {sessionCodes[quiz.id]}</p>
            )}
            {/* Optionally render questions and other quiz details here */}
            {/* This would require you to fetch and map over the questions for each quiz */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherDashboard;
