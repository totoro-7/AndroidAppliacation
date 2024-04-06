// src/pages/quiz/quiz-management.tsx

import React, { useState, FormEvent } from 'react';
import { createQuiz } from '../../services/quizService';
import { Quiz, QuizQuestion, Choice } from '../../types/quizTypes';

export default function QuizManagement() {
  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    {
      id: '',
      questionText: '',
      choices: Array(4).fill(null).map((_, idx) => ({ id: `choice${idx + 1}`, text: '' })), // Initializes four empty choices
      correctAnswerIndex: 0,
    },
  ]);

  const handleCreateQuiz = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const quizData: Quiz = {
      id: '',
      title: quizTitle,
      questions,
    };

    const newQuizId = await createQuiz(quizData);
    console.log(`New quiz created with ID: ${newQuizId}`);

    // Reset form fields
    setQuizTitle('');
    setQuestions([
      {
        id: '',
        questionText: '',
        choices: Array(4).fill(null).map((_, idx) => ({ id: `choice${idx + 1}`, text: '' })),
        correctAnswerIndex: 0,
      },
    ]);
  };

  const handleQuestionChange = (qIndex: number, value: string) => {
    const updatedQuestions = questions.map((question, idx) =>
      idx === qIndex ? { ...question, questionText: value } : question
    );
    setQuestions(updatedQuestions);
  };

  const handleChoiceChange = (qIndex: number, choiceIndex: number, value: string) => {
    const updatedQuestions = questions.map((question, idx) => {
      if (idx === qIndex) {
        const updatedChoices = question.choices.map((choice, idx) =>
          idx === choiceIndex ? { ...choice, text: value } : choice
        );
        return { ...question, choices: updatedChoices };
      }
      return question;
    });
    setQuestions(updatedQuestions);
  };

  const handleCorrectAnswerChange = (qIndex: number, correctIndex: number) => {
    const updatedQuestions = questions.map((question, idx) =>
      idx === qIndex ? { ...question, correctAnswerIndex: correctIndex } : question
    );
    setQuestions(updatedQuestions);
  };

  return (
    <div>
      <h1>Quiz Management</h1>
      <form onSubmit={handleCreateQuiz}>
        <label htmlFor="quizTitle">Quiz Title:</label>
        <input
          id="quizTitle"
          type="text"
          value={quizTitle}
          onChange={(e) => setQuizTitle(e.target.value)}
          required
        />
        {questions.map((question, qIndex) => (
          <div key={qIndex}>
            <label htmlFor={`questionText-${qIndex}`}>Question:</label>
            <input
              id={`questionText-${qIndex}`}
              type="text"
              value={question.questionText}
              onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
              required
            />
            {question.choices.map((choice, choiceIndex) => (
              <div key={choiceIndex}>
                <label htmlFor={`choice-${qIndex}-${choiceIndex}`}>Option {choiceIndex + 1}:</label>
                <input
                  id={`choice-${qIndex}-${choiceIndex}`}
                  type="text"
                  value={choice.text}
                  onChange={(e) => handleChoiceChange(qIndex, choiceIndex, e.target.value)}
                  required
                />
              </div>
            ))}
            <div>
              <label>Correct Answer Index:</label>
              <input
                type="number"
                value={question.correctAnswerIndex}
                onChange={(e) => handleCorrectAnswerChange(qIndex, parseInt(e.target.value, 10))}
                min="0"
                max="3"
                required
              />
            </div>
          </div>
        ))}
        <button type="submit">Create Quiz</button>
      </form>
    </div>
  );
}
