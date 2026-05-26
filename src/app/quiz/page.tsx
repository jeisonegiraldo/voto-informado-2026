'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { quizQuestions } from '@/data/quiz-questions';
import { calculateQuizResults, encodeResults } from '@/lib/quiz-scoring';
import type { QuizAnswer } from '@/types/quiz';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, SkipForward } from 'lucide-react';

export default function QuizPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<string, string>>(new Map());
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const question = quizQuestions[currentIndex];
  const totalQuestions = quizQuestions.length;
  const progress = ((currentIndex) / totalQuestions) * 100;

  const handleSelect = useCallback((optionId: string) => {
    setSelectedOption(optionId);
  }, []);

  const handleNext = useCallback(() => {
    if (selectedOption) {
      const newAnswers = new Map(answers);
      newAnswers.set(question.id, selectedOption);
      setAnswers(newAnswers);
    }

    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
      // Pre-select if already answered
      const nextQ = quizQuestions[currentIndex + 1];
      setSelectedOption(answers.get(nextQ.id) ?? null);
    } else {
      // Calculate results
      const allAnswers: QuizAnswer[] = [];
      const finalAnswers = new Map(answers);
      if (selectedOption) {
        finalAnswers.set(question.id, selectedOption);
      }
      for (const [questionId, optionId] of finalAnswers) {
        allAnswers.push({ questionId, optionId });
      }
      const result = calculateQuizResults(allAnswers);
      const encoded = encodeResults(result);
      router.push(`/quiz/resultado?r=${encoded}`);
    }
  }, [selectedOption, answers, currentIndex, totalQuestions, question.id, router]);

  const handleSkip = useCallback(() => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
      const nextQ = quizQuestions[currentIndex + 1];
      setSelectedOption(answers.get(nextQ.id) ?? null);
    }
  }, [currentIndex, totalQuestions, answers]);

  const handleBack = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      const prevQ = quizQuestions[currentIndex - 1];
      setSelectedOption(answers.get(prevQ.id) ?? null);
    }
  }, [currentIndex, answers]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Progress */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm text-gray-500">
          <span>
            Pregunta {currentIndex + 1} de {totalQuestions}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">{question.text}</h2>
        {question.context && (
          <p className="mt-2 text-sm text-gray-500">{question.context}</p>
        )}
      </div>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option) => {
          const isSelected = selectedOption === option.id;
          return (
            <Card
              key={option.id}
              className={`cursor-pointer transition-all ${
                isSelected
                  ? 'border-teal-500 bg-teal-50 ring-2 ring-teal-200'
                  : 'hover:border-gray-300 hover:shadow-sm'
              }`}
              onClick={() => handleSelect(option.id)}
            >
              <CardContent className="flex items-center gap-3 p-4">
                <div
                  className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                    isSelected
                      ? 'border-teal-500 bg-teal-500'
                      : 'border-gray-300'
                  }`}
                >
                  {isSelected && (
                    <div className="h-2 w-2 rounded-full bg-white" />
                  )}
                </div>
                <p className={`text-sm ${isSelected ? 'font-medium text-teal-900' : 'text-gray-700'}`}>
                  {option.text}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={handleBack}
          disabled={currentIndex === 0}
          className="gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Anterior
        </Button>

        <Button
          variant="ghost"
          onClick={handleSkip}
          disabled={currentIndex === totalQuestions - 1}
          className="gap-1 text-gray-400"
        >
          Omitir
          <SkipForward className="h-4 w-4" />
        </Button>

        <Button onClick={handleNext} disabled={!selectedOption} className="gap-1">
          {currentIndex === totalQuestions - 1 ? 'Ver resultados' : 'Siguiente'}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
