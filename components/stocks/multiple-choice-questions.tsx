
'use client'
import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { CardDescription, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { parse } from 'path';

// Define the Zod schema for multiple-choice questions
const MultipleChoiceQuizSchema = z.object({
  questions: z.array(
    z.object({
      id: z.string().describe('The unique identifier for the question'),
      text: z.string().describe('The text of the question'),
      choices: z.array(
        z.object({
          label: z.string().describe('The label for the choice option'),
          value: z.string().optional().describe('The value for the choice option (optional)'),
        })
      ).nonempty().describe('The choices for the question'),
      answer: z.string().describe('The correct answer for the question'),
    })
  ).nonempty().describe('The array of multiple-choice questions'),
});

// Example data
const exampleData = {
  questions: [
    {
      id: 'q1',
      text: 'What is the capital of France?',
      choices: [
        { label: 'Paris', value: 'paris' },
        { label: 'London', value: 'london' },
        { label: 'Berlin', value: 'berlin' },
      ],
      answer: 'paris',
    },
    {
      id: 'q2',
      text: 'Which programming language is primarily used for web development?',
      choices: [
        { label: 'Java' },
        { label: 'Python' },
        { label: 'JavaScript' },
      ],
      answer: 'JavaScript',
    },
  ],
};

// Parse the example data using the Zod schema
const parsedData = MultipleChoiceQuizSchema.parse(exampleData);

interface QuizProps {
  questions: typeof parsedData.questions;
}

export const MultipleChoiceQuiz: React.FC<QuizProps> = ({ questions }) => {
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({});
  const [showResult, setShowResult] = useState(false);

  useEffect(()=> {
    console.log(questions);
    // const parsedData = MultipleChoiceQuizSchema.parse(questions);
    // console.log(parsedData)
  },[])

  const handleAnswerChange = (questionId: string, answer: string) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

  const evaluateAnswers = () => {
    let correctAnswers = 0;
    questions.forEach((question) => {
      if (userAnswers[question.id] === question.answer) {
        correctAnswers += 1;
      }
    });
    return `You got ${correctAnswers} out of ${questions.length} correct!`;
  };

  const handleSubmit = () => {
    setShowResult(true);
  };

  return (
    <div>
      <h2>Multiple Choice Quiz</h2>
      {questions && questions.map((question) => (
        <Card key={question.id} className='my-2'>
  <CardHeader>
        <div className="flex items-center space-x-1">
          <div className="text-sm font-medium leading-none">{question.id}</div>
        </div>
        <CardDescription>{question.text}</CardDescription>
      </CardHeader>
  
          {question.choices.map((choice) => (
            <CardContent key={choice.label}>
              <label>
                <input
                  type="radio"
                  name={question.id}
                  value={choice.value || choice.label}
                  checked={userAnswers[question.id] === (choice.value || choice.label)}
                  onChange={() => handleAnswerChange(question.id, choice.value || choice.label)}
                />
                {choice.label}
              </label>
            </CardContent>
          ))}
        </Card>
      ))}
      <CardFooter className="flex gap-2">
        <Button size="sm" onClick={handleSubmit}>Submit</Button>
        {showResult && <p>{evaluateAnswers()}</p>}
      </CardFooter>
    </div>
  );
};

