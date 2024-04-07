import React, { useEffect, useState, useContext } from 'react';
import { FirebaseContext } from '../context/FirebaseContext';
import { ref, onValue, off, DataSnapshot } from 'firebase/database';
import { useRouter } from 'next/router';
import FlipMove from 'react-flip-move';

// Define the expected structure of the Firebase data
interface FirebaseValues {
  [question: string]: { [userId: string]: string | number };
}

// Define the structure of a question and answer object
interface QuestionAndAnswer {
  question: string;
  userId: string;
  answerIndex: string;
  lastUpdated: number; // Unix timestamp of the last update
}

const QuizMonitor = () => {
  const { realtimeDb } = useContext(FirebaseContext);
  const [questionsAndAnswers, setQuestionsAndAnswers] = useState<QuestionAndAnswer[]>([]);
  const router = useRouter();

  useEffect(() => {
    const valuesRef = ref(realtimeDb, 'values');
  
    const handleValueChange = (snapshot: DataSnapshot) => {
      if (snapshot.exists()) {
        const now = Date.now();
        const data = snapshot.val() as FirebaseValues;
        let updatedQuestionsAndAnswers = [...questionsAndAnswers]; // Clone the current state
  
        Object.entries(data).forEach(([question, userResponses]) => {
          Object.entries(userResponses).forEach(([userId, answerIndex]) => {
            const index = updatedQuestionsAndAnswers.findIndex(qa => qa.question === question && qa.userId === userId);
            
            if (index > -1) {
              // Update only if answerIndex has changed
              if (updatedQuestionsAndAnswers[index].answerIndex !== answerIndex.toString()) {
                updatedQuestionsAndAnswers[index] = {
                  ...updatedQuestionsAndAnswers[index],
                  answerIndex: answerIndex.toString(),
                  lastUpdated: now, // Update timestamp only if answerIndex has changed
                };
              }
            } else {
              // If it's a new question-answer pair, add it with the current timestamp
              updatedQuestionsAndAnswers.push({
                question,
                userId,
                answerIndex: answerIndex.toString(),
                lastUpdated: now,
              });
            }
          });
        });
  
        // Sort by lastUpdated so the most recently changed item is at the top
        updatedQuestionsAndAnswers.sort((a, b) => b.lastUpdated - a.lastUpdated);
        
        setQuestionsAndAnswers(updatedQuestionsAndAnswers);
      }
    };
  
    onValue(valuesRef, handleValueChange);
  
    return () => {
      off(valuesRef);
    };
  }, [realtimeDb, questionsAndAnswers]); 
  return (
    <div className="min-h-screen bg-blue-100 flex flex-col py-12 sm:px-6 lg:px-8">
      <button 
        onClick={() => router.push('/teacherDashboard')}
        className="mb-4 text-indigo-600 hover:text-indigo-500"
      >
        ← Back to Dashboard
      </button>
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">Live Quiz Progress Monitor</h1>
      <FlipMove>
        {questionsAndAnswers.map((qna, index) => (
          <div key={qna.userId + qna.question}>
            <div className="bg-white shadow rounded-lg p-4 mb-4 flex justify-between items-center transition-transform duration-300">
              <div>
                <p className="text-lg font-semibold">{qna.question}</p>
                <p>User ID: {qna.userId}</p>
                <p>Selected Option: {qna.answerIndex}</p>
              </div>
              <span className="text-sm text-gray-400">Last updated: {new Date(qna.lastUpdated).toLocaleTimeString()}</span>
            </div>
          </div>
        ))}
      </FlipMove>
    </div>
  );
};

export default QuizMonitor;
