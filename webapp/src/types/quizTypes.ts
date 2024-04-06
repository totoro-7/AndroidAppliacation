// src/types/quizTypes.ts

export type Choice = {
  id: string;
  text: string;
};

export type QuizQuestion = {
  id: string;
  questionText: string;
  choices: Choice[];
  correctAnswerIndex: number;
};

export type Quiz = {
  id: string;
  title: string;
  questions: QuizQuestion[];
};
