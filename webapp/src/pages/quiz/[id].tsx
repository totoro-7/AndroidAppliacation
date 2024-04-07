import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { realtimeDb } from '../../firebase';
import { ref, onValue } from 'firebase/database';

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

    const quizRef = ref(realtimeDb, `quizzes/${id}`);
    const unsubscribe = onValue(quizRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setQuiz({
          title: data.title,
          sessionCode: data.sessionCode,
          questions: data.questions || [],
        });
      }
    });

    return () => unsubscribe();
  }, [id, realtimeDb]);

  if (!quiz) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Quiz Detail: {quiz.title}</h1>
      <p>Session Code: {quiz.sessionCode}</p>
      <ul>
        {quiz.questions.map((question, qIndex) => (
          <li key={qIndex}>
            <h3>{question.text}</h3>
            <ul>
              {question.choices.map((choice, cIndex) => (
                <li key={cIndex}>
                  {choice.text} {cIndex === question.correctAnswerIndex ? "(Correct Answer)" : ""}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}