// src/types/quizTypes.ts

export type QuizQuestion = {
    questionText: string;
    options: string[];
    correctAnswerIndex: number;
  };
  
  export type Quiz = {
    id: string;
    title: string;
    questions: QuizQuestion[];
  };
  