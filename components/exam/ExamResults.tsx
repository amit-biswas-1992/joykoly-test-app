import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';

interface ExamResultsProps {
  results: {
    score: number;
    totalMarks: number;
    percentage: number;
    passed: boolean;
    correctAnswers: number;
    totalQuestions: number;
    timeTaken: number;
    rank?: number;
    totalParticipants?: number;
  };
  examId?: string;
  onRetake?: () => void;
  onViewAnswers?: () => void;
  onGoHome: () => void;
}

export const ExamResults: React.FC<ExamResultsProps> = ({
  results,
  examId,
  onRetake,
  onViewAnswers,
  onGoHome,
}) => {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const handleStartPractice = () => {
    if (examId) {
      router.push(`/exams/${examId}/offline` as any);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        {/* Header */}
        <View className="mb-4 rounded-lg bg-white p-6 shadow-sm">
          <View className="items-center">
            <View
              className={`mb-4 h-20 w-20 items-center justify-center rounded-full ${
                results.passed ? 'bg-green-100' : 'bg-red-100'
              }`}>
              <Text
                className={`text-3xl font-bold ${
                  results.passed ? 'text-green-600' : 'text-red-600'
                }`}>
                {results.percentage}%
              </Text>
            </View>

            <Text
              className={`mb-2 text-2xl font-bold ${
                results.passed ? 'text-green-600' : 'text-red-600'
              }`}>
              {results.passed ? 'Congratulations!' : 'Better luck next time!'}
            </Text>

            <Text className="text-center text-gray-600">
              {results.passed
                ? 'You have successfully passed the exam'
                : 'You need to score higher to pass this exam'}
            </Text>
          </View>
        </View>

        {/* Score Details */}
        <View className="mb-4 rounded-lg bg-white p-6 shadow-sm">
          <Text className="mb-4 text-lg font-semibold text-gray-900">Score Details</Text>

          <View className="space-y-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-600">Score</Text>
              <Text className="font-semibold text-gray-900">
                {results.score}/{results.totalMarks}
              </Text>
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="text-gray-600">Percentage</Text>
              <Text className="font-semibold text-gray-900">{results.percentage}%</Text>
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="text-gray-600">Correct Answers</Text>
              <Text className="font-semibold text-gray-900">
                {results.correctAnswers}/{results.totalQuestions}
              </Text>
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="text-gray-600">Time Taken</Text>
              <Text className="font-semibold text-gray-900">{formatTime(results.timeTaken)}</Text>
            </View>

            {results.rank && results.totalParticipants && (
              <View className="flex-row items-center justify-between">
                <Text className="text-gray-600">Rank</Text>
                <Text className="font-semibold text-gray-900">
                  {results.rank} of {results.totalParticipants}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Performance Analysis */}
        <View className="mb-4 rounded-lg bg-white p-6 shadow-sm">
          <Text className="mb-4 text-lg font-semibold text-gray-900">Performance Analysis</Text>

          <View className="space-y-3">
            <View className="flex-row items-center">
              <View className="mr-3 h-3 w-3 rounded-full bg-blue-500" />
              <Text className="flex-1 text-gray-600">Accuracy</Text>
              <Text className="font-semibold text-gray-900">
                {Math.round((results.correctAnswers / results.totalQuestions) * 100)}%
              </Text>
            </View>

            <View className="flex-row items-center">
              <View className="mr-3 h-3 w-3 rounded-full bg-green-500" />
              <Text className="flex-1 text-gray-600">Speed</Text>
              <Text className="font-semibold text-gray-900">
                {Math.round(results.totalQuestions / (results.timeTaken / 60))} q/min
              </Text>
            </View>

            <View className="flex-row items-center">
              <View
                className={`mr-3 h-3 w-3 rounded-full ${
                  results.passed ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
              <Text className="flex-1 text-gray-600">Result</Text>
              <Text
                className={`font-semibold ${results.passed ? 'text-green-600' : 'text-red-600'}`}>
                {results.passed ? 'Passed' : 'Failed'}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="space-y-3">
          <TouchableOpacity onPress={onGoHome} className="rounded-lg bg-blue-500 py-4">
            <Text className="text-center text-lg font-semibold text-white">Go to Dashboard</Text>
          </TouchableOpacity>

          {examId && (
            <TouchableOpacity onPress={handleStartPractice} className="rounded-lg bg-purple-500 py-4">
              <Text className="text-center text-lg font-semibold text-white">Start Practice Exam</Text>
            </TouchableOpacity>
          )}

          {onViewAnswers && (
            <TouchableOpacity onPress={onViewAnswers} className="rounded-lg bg-gray-200 py-4">
              <Text className="text-center text-lg font-semibold text-gray-700">View Answers</Text>
            </TouchableOpacity>
          )}

          {onRetake && (
            <TouchableOpacity onPress={onRetake} className="rounded-lg border border-blue-500 py-4">
              <Text className="text-center text-lg font-semibold text-blue-500">Retake Exam</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
};
