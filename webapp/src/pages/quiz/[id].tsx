import React, { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { db } from '../../firebase';
import { collection, doc, onSnapshot, query, orderBy, addDoc, serverTimestamp, DocumentData, QuerySnapshot } from 'firebase/firestore';

type Choice = {
  id: string;
  text: string;
};

type Question = {
  id: string;
  text: string;
  choices: Choice[];
  correctAnswerIndex: number;
};

type Quiz = {
  id: string;
  title: string;
  sessionCode: string;
};

export default function QuizDetail() {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [choices, setChoices] = useState<Choice[]>([
    { id: 'choice1', text: '' },
    { id: 'choice2', text: '' },
    { id: 'choice3', text: '' },
    { id: 'choice4', text: '' },
  ]);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0);

  useEffect(() => {
    if (!id) return;

    const quizRef = doc(db, 'quizzes', id);
    const unsubscribeQuiz = onSnapshot(quizRef, (doc) => {
      setQuiz({ ...(doc.data() as Quiz), id: doc.id });
    });

    const q = query(collection(db, 'quizzes', id, 'questions'), orderBy('createdAt', 'desc'));
    const unsubscribeQuestions = onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
      const fetchedQuestions = snapshot.docs.map(doc => ({
        ...(doc.data() as Question), id: doc.id,
      }));
      setQuestions(fetchedQuestions);
    });

    return () => {
      unsubscribeQuiz();
      unsubscribeQuestions();
    };
  }, [id]);

  const addQuestion = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await addDoc(collection(db, 'quizzes', id, 'questions'), {
      text: newQuestionText,
      choices,
      correctAnswerIndex,
      createdAt: serverTimestamp(),
    });

    setNewQuestionText('');
    setChoices(choices.map(choice => ({ ...choice, text: '' })));
    setCorrectAnswerIndex(0);
  };

  return (
    <div>
      <h1>Quiz Detail</h1>
      <h2>{quiz?.title || 'Loading...'}</h2>
      <form onSubmit={addQuestion}>
        {/* Input fields for question text, choices, and correct answer index */}
      </form>
      <h3>Questions</h3>
      <ul>
        {questions.map(question => (
          <li key={question.id}>
            {question.text}
            <ul>
              {question.choices.map((choice, index) => (
                <li key={choice.id}>
                  {choice.text} {index === question.correctAnswerIndex ? "(Correct Answer)" : ""}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
