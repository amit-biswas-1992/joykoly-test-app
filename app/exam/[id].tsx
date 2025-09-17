import React, { useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { ExamView } from '~/components/exam/ExamView';
import { ExamResults } from '~/components/exam/ExamResults';

export default function ExamScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [showResults, setShowResults] = useState(false);
  const [examResults, setExamResults] = useState<any>(null);

  const handleExamComplete = (results: any) => {
    setExamResults(results);
    setShowResults(true);
  };

  const handleExitExam = () => {
    Alert.alert('Exit Exam', 'Are you sure you want to exit? Your progress will be lost.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Exit', onPress: () => router.back() },
    ]);
  };

  const handleGoHome = () => {
    router.back();
  };

  const handleRetake = () => {
    setShowResults(false);
    setExamResults(null);
  };

  const handleViewAnswers = () => {
    Alert.alert('View Answers', 'This feature will show detailed answers and explanations');
  };

  if (showResults && examResults) {
    return (
      <ExamResults
        results={examResults}
        examId={id}
        onRetake={handleRetake}
        onViewAnswers={handleViewAnswers}
        onGoHome={handleGoHome}
      />
    );
  }

  if (!id) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-lg text-gray-600">Invalid exam ID</Text>
        <TouchableOpacity onPress={handleGoHome} className="mt-4 rounded-lg bg-blue-500 px-6 py-2">
          <Text className="font-medium text-white">Go Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return <ExamView examId={id} onComplete={handleExamComplete} onExit={handleExitExam} />;
}
