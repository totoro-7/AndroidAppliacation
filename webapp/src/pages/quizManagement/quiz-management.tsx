// src/pages/quiz/quiz-management.tsx

import React, { useState, FormEvent } from 'react';
import { createQuiz } from '../../services/quizService';
import { Quiz, QuizQuestion } from '../../types/quizTypes';

export default function QuizManagement() {
  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    {
      id: '',
      questionText: '',
      options: ['', '', '', ''],
      correctAnswerIndex: 0,
    },
  ]);

  const handleCreateQuiz = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const quizData: Quiz = {
      id: '', // Firebase will auto-generate this ID
      title: quizTitle,
      questions: questions.map((question) => ({
        ...question,
        options: question.options.filter((option) => option.trim() !== ''),
      })),
    };
    const newQuizId = await createQuiz(quizData);
    console.log(`New quiz created with ID: ${newQuizId}`);
    // Reset form fields
    setQuizTitle('');
    setQuestions([{ id: '', questionText: '', options: ['', '', '', ''], correctAnswerIndex: 0 }]);
  };

  const handleQuestionChange = (qIndex: number, value: string) => {
    const updatedQuestions = questions.map((question, idx) =>
      idx === qIndex ? { ...question, questionText: value } : question
    );
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (qIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = questions.map((question, idx) => {
      if (idx === qIndex) {
        const updatedOptions = question.options.map((option, idx) =>
          idx === optionIndex ? value : option
        );
        return { ...question, options: updatedOptions };
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
    <div className='container mx-auto p-8'>
      <h1 className='text-3xl font-bold mb-8'>Quiz Management</h1>
      <form onSubmit={handleCreateQuiz}>
        <label htmlFor='quizTitle'>Quiz Title:</label>
        <input
          id='quizTitle'
          type='text'
          value={quizTitle}
          onChange={(e) => setQuizTitle(e.target.value)}
          required
        />
        {questions.map((question, qIndex) => (
          <div key={qIndex}>
            <label htmlFor={`questionText-${qIndex}`}>Question:</label>
            <input
              id={`questionText-${qIndex}`}
              type='text'
              value={question.questionText}
              onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
              required
            />
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex}>
                <label htmlFor={`option-${qIndex}-${optionIndex}`}>Option {optionIndex + 1}:</label>
                <input
                  id={`option-${qIndex}-${optionIndex}`}
                  type='text'
                  value={option}
                  onChange={(e) => handleOptionChange(qIndex, optionIndex, e.target.value)}
                  required
                />
              </div>
            ))}
            <div>
              <label>Correct Answer:</label>
              {question.options.map((option, optionIndex) => (
                <label key={optionIndex}>
                  <input
                    type='radio'
                    name={`correctAnswer-${qIndex}`}
                    value={optionIndex}
                    checked={question.correctAnswerIndex === optionIndex}
                    onChange={() => handleCorrectAnswerChange(qIndex, optionIndex)}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        ))}
        <button type='submit'>Create Quiz</button>
      </form>
    </div>
  );
}
