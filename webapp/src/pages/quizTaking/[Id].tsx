import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { realtimeDb } from '../../firebase';
import { Quiz } from '../../types/quizTypes';
import { get } from 'firebase/database'; // import the get function from firebase/database

type QuizData = {
  questions: {
    question: string;
    choices: string[];
  }[];
};

async function fetchQuizById(id: string): Promise<Quiz> {
  const quizRef = ref(realtimeDb, `quizzes/${id}`);
  const snapshot = await get(quizRef);

  if (!snapshot.exists()) {
    throw new Error(`No quiz found with id: ${id}`);
  }

  return snapshot.val() as Quiz;
}

const QuizPage: React.FC = () => {
  const router = useRouter();
  const { id, sessionCode } = router.query as { id: string; sessionCode: string };
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || !sessionCode) return;

    fetchQuizById(id).then((quiz: Quiz) => {
      const quizData: QuizData = {
        questions: quiz.questions.map((question) => ({
          question: question.questionText,
          choices: question.options,
        })),
      };
      setQuizData(quizData);
      setLoading(false);
    }).catch((error) => {
      console.error("Error fetching quiz data:", error);
      setLoading(false);
    });
  }, [id, sessionCode]);


  console.log('Loading:', loading); // Log the value of loading
  console.log('Quiz data:', quizData); // Log the value of quizData

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!quizData) {
    return <div>No quiz data found</div>;
  }

  console.log(quizData); // Log the quizData object

  return (
    <div>
      {quizData.questions.map((question, index) => (
        <div key={index}>
          <h2>{question.question}</h2>
          {question.choices.map((choice, index) => (
            <div key={index}>
              <input type="radio" id={`choice-${index}`} name={`question-${index}`} value={choice} />
              <label htmlFor={`choice-${index}`}>{choice}</label>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default QuizPage;