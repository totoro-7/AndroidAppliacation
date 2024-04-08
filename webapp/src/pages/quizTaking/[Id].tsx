import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ref, get } from 'firebase/database';
import { realtimeDb } from '../../firebase';
import { Quiz, QuizQuestion } from '../../types/quizTypes';

type QuizTitles = {
  [key: string]: string;
};

// Define the hardcoded quiz titles based on IDs
const quizTitles: QuizTitles = {
  quiz1: 'NTU Trivia',
  quiz2: 'Math Quiz',
  quiz3: 'Science Quiz',
};

const QuizPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof id === 'string') {
      const quizRef = ref(realtimeDb, `quizzes/${id}`);
      get(quizRef).then((snapshot) => {
        if (snapshot.exists()) {
          const data: Quiz = snapshot.val();
          // Override the title with the hardcoded value if it exists
          data.title = quizTitles[id] || data.title;
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

  const handleSelectAnswer = (questionId: string, optionIndex: number) => {
    setSelectedAnswers({ ...selectedAnswers, [questionId]: optionIndex });
  };

  const isAnswerCorrect = (question: QuizQuestion, selectedOptionIndex: number) => {
    return question.correctAnswerIndex === selectedOptionIndex;
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!quiz) {
    return <div className="text-center">Quiz not found.</div>;
  }

  return (
    <div className="container mx-auto my-10 p-5">
      <h1 className="text-3xl font-bold text-center mb-8">{quiz.title}</h1>
      <form className="space-y-8">
        {quiz.questions.map((question) => (
          <div key={question.id} className="bg-gray-100 p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">{question.questionText}</h2>
            {question.options.map((option, index) => (
              <label key={index} className="flex items-center mb-2">
                <input
                  type="radio"
                  name={`question_${question.id}`}
                  value={index}
                  onChange={() => handleSelectAnswer(question.id, index)}
                  checked={selectedAnswers[question.id] === index}
                  className="mr-2"
                />
                {option}
              </label>
            ))}
            {selectedAnswers[question.id] !== undefined && (
              <div className={`text-md font-bold ${isAnswerCorrect(question, selectedAnswers[question.id]) ? 'text-green-500' : 'text-red-500'}`}>
                {isAnswerCorrect(question, selectedAnswers[question.id]) ? 'Correct' : 'Incorrect'}
              </div>
            )}
          </div>
        ))}
      </form>
    </div>
  );
};

export default QuizPage;
