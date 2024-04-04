// src/pages/quiz/quiz-management.tsx

import React, { useState, FormEvent } from 'react';
import { createQuiz } from '../../services/quizService';
import { Quiz, QuizQuestion } from '../../types/quizTypes';

export default function QuizManagement() {
  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState<QuizQuestion[]>([{
    questionText: '',
    options: ['', '', '', ''],
    correctAnswerIndex: 0, // Assuming the first option is correct initially
  }]);

  const handleCreateQuiz = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const quizData = {
      title: quizTitle,
      questions,
      createdAt: Date.now(),
    };

    const newQuizId = await createQuiz(quizData);
    console.log(`New quiz created with ID: ${newQuizId}`);
    // Reset form
    setQuizTitle('');
    setQuestions([{
      questionText: '',
      options: ['', '', '', ''],
      correctAnswerIndex: 0,
    }]);
  };

  // Function to handle question text and option changes
  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index].questionText = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  // Add more functions as needed for handling correct answer selection, adding/removing questions, etc.

  return (
    <div>
      <h1>Quiz Management</h1>
      <form onSubmit={handleCreateQuiz}>
        {/* Title input */}
        <input
          type="text"
          value={quizTitle}
          onChange={(e) => setQuizTitle(e.target.value)}
          placeholder="Quiz Title"
          required
        />
        
        {/* Questions and options UI */}
        {questions.map((question, qIndex) => (
          <div key={qIndex}>
            <input
              type="text"
              value={question.questionText}
              onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
              placeholder="Question Text"
              required
            />
            {question.options.map((option, oIndex) => (
              <input
                key={oIndex}
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                placeholder={`Option ${oIndex + 1}`}
                required
              />
            ))}
            {/* Add UI for selecting the correct answer, adding/removing options as necessary */}
          </div>
        ))}
        
        {/* Submit button */}
        <button type="submit">Create Quiz</button>
      </form>
    </div>
  );
}
