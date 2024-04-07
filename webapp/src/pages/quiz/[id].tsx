import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getDatabase, ref, onValue, off } from 'firebase/database';

type Choice = {
  text: string;
};

type Question = {
  text: string;
  choices: Choice[];
  correctAnswerIndex: number;
};

type Quiz = {
  title: string;
  sessionCode: string;
  questions: Question[];
};

export default function QuizDetail() {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const [quiz, setQuiz] = useState<Quiz | null>(null);

  useEffect(() => {
    if (!id) return;

    const realtimeDb = getDatabase();
    const quizRef = ref(realtimeDb, `quizzes/${id}`);
    const unsubscribe = onValue(quizRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setQuiz(data);
      }
    });

    // Clean up subscription on unmount
    return () => off(quizRef, 'value', unsubscribe);
  }, [id]);

  if (!quiz) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{quiz.title}</h1>
      {quiz.questions.map((question, index) => (
        <div key={index}>
          <h2>{question.text}</h2>
          <ul>
            {question.choices && question.choices.map((choice, cIndex) => (
              <li key={cIndex}>
                {choice.text} {cIndex === question.correctAnswerIndex ? "(Correct Answer)" : ""}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}