import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ref, get } from 'firebase/database';
import { realtimeDb } from '../../firebase'; 
import { Quiz, QuizQuestion } from '../../types/quizTypes';

const QuizPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof id === 'string') {
      const quizRef = ref(realtimeDb, `quizzes/${id}`);
      get(quizRef).then((snapshot) => {
        if (snapshot.exists()) {
          const data: Quiz = snapshot.val();
          setQuiz(data);
        } else {
          console.error('No quiz found');
        }
        setLoading(false);
      }).catch((error) => {
        console.error('Database read failed: ', error);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!quiz) {
    return <div className="text-center">Quiz not found.</div>;
  }

  return (
    <div className="container mx-auto my-10 p-5">
      <h1 className="text-3xl font-bold text-center mb-8">{quiz.title}</h1>
      {quiz.questions.map((question: QuizQuestion, index: number) => (
        <div key={question.id} className="mb-6 p-4 border-b">
          <h2 className="text-xl font-semibold mb-2">{question.questionText}</h2>
          <ul className="list-disc pl-5">
            {question.options.map((option, optionIndex) => (
              <li key={optionIndex} className={`${optionIndex === question.correctAnswerIndex ? 'text-green-600' : ''}`}>
                {option}
                {optionIndex === question.correctAnswerIndex && <span> (Correct Answer)</span>}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default QuizPage;