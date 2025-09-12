import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

export interface Question {
  id: string;
  question: string;
  type: 'mcq' | 'written';
  options?: string[];
  correctAnswer?: string;
  marks: number;
  timeLimit?: number;
}

interface ExamQuestionProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (questionId: string, answer: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  currentAnswer?: string;
  timeRemaining?: number;
}

export const ExamQuestion: React.FC<ExamQuestionProps> = ({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  onNext,
  onPrevious,
  currentAnswer,
  timeRemaining,
}) => {
  const [selectedOption, setSelectedOption] = useState<string>(currentAnswer || '');

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    onAnswer(question.id, option);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="border-b border-blue-200 bg-blue-50 px-4 py-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-semibold text-blue-900">
            Question {questionNumber} of {totalQuestions}
          </Text>
          {timeRemaining && (
            <View className="rounded-full bg-red-100 px-3 py-1">
              <Text className="font-medium text-red-700">{formatTime(timeRemaining)}</Text>
            </View>
          )}
        </View>
        <Text className="mt-1 text-sm text-blue-700">
          {question.marks} mark{question.marks > 1 ? 's' : ''}
        </Text>
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Question */}
        <View className="mb-6">
          <Text className="text-lg leading-relaxed text-gray-900">{question.question}</Text>
        </View>

        {/* Answer Section */}
        {question.type === 'mcq' && question.options ? (
          <View className="space-y-3">
            {question.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleOptionSelect(option)}
                className={`rounded-lg border-2 p-4 ${
                  selectedOption === option
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white'
                }`}>
                <View className="flex-row items-center">
                  <View
                    className={`mr-3 h-6 w-6 rounded-full border-2 ${
                      selectedOption === option ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                    }`}>
                    {selectedOption === option && (
                      <View className="m-1 h-2 w-2 rounded-full bg-white" />
                    )}
                  </View>
                  <Text className="flex-1 text-gray-900">{option}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <Text className="text-center text-gray-600">
              Written answer component would go here
            </Text>
            <Text className="mt-2 text-center text-sm text-gray-500">
              (Text input for written answers)
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Navigation */}
      <View className="border-t border-gray-200 bg-white px-4 py-3">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={onPrevious}
            disabled={questionNumber === 1}
            className={`rounded-lg px-6 py-2 ${
              questionNumber === 1 ? 'bg-gray-100' : 'bg-gray-200'
            }`}>
            <Text
              className={`font-medium ${questionNumber === 1 ? 'text-gray-400' : 'text-gray-700'}`}>
              Previous
            </Text>
          </TouchableOpacity>

          <View className="flex-row space-x-2">
            {Array.from({ length: totalQuestions }, (_, i) => (
              <View
                key={i}
                className={`h-3 w-3 rounded-full ${
                  i + 1 === questionNumber
                    ? 'bg-blue-500'
                    : i + 1 < questionNumber
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                }`}
              />
            ))}
          </View>

          <TouchableOpacity
            onPress={onNext}
            disabled={questionNumber === totalQuestions}
            className={`rounded-lg px-6 py-2 ${
              questionNumber === totalQuestions ? 'bg-gray-100' : 'bg-blue-500'
            }`}>
            <Text
              className={`font-medium ${
                questionNumber === totalQuestions ? 'text-gray-400' : 'text-white'
              }`}>
              {questionNumber === totalQuestions ? 'Submit' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
