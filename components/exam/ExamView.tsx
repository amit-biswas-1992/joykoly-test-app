import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, Modal } from 'react-native';
import { ExamQuestion, Question } from './ExamQuestion';
import { apiClient } from '../../services/api-client';

interface ExamViewProps {
  examId: string;
  onComplete: (results: any) => void;
  onExit: () => void;
}

export const ExamView: React.FC<ExamViewProps> = ({ examId, onComplete, onExit }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [showExitModal, setShowExitModal] = useState(false);

  useEffect(() => {
    loadExamQuestions();
  }, [examId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (timeRemaining !== null && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0) {
      handleAutoSubmit();
    }
  }, [timeRemaining]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadExamQuestions = async () => {
    try {
      setLoading(true);
      const response = (await apiClient.exams.getQuestions(examId)) as any[];

      // Transform the response to match our Question interface
      const transformedQuestions: Question[] = response.map((q: any) => ({
        id: q.id,
        question: q.question,
        type: q.type || 'mcq',
        options: q.options || [],
        correctAnswer: q.correctAnswer,
        marks: q.marks || 1,
        timeLimit: q.timeLimit,
      }));

      setQuestions(transformedQuestions);

      // Set exam duration if available
      if (response.length > 0 && response[0].examDuration) {
        setTimeRemaining(response[0].examDuration * 60); // Convert minutes to seconds
      }
    } catch (error) {
      console.error('Error loading exam questions:', error);
      Alert.alert('Error', 'Failed to load exam questions');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    Alert.alert(
      'Submit Exam',
      'Are you sure you want to submit your exam? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Submit', onPress: submitExam },
      ]
    );
  };

  const handleAutoSubmit = async () => {
    Alert.alert(
      'Time Up!',
      'The exam time has ended. Your answers will be submitted automatically.',
      [{ text: 'OK', onPress: submitExam }]
    );
  };

  const submitExam = async () => {
    try {
      const response = await apiClient.exams.submit(examId, answers);
      onComplete(response);
    } catch (error) {
      console.error('Error submitting exam:', error);
      Alert.alert('Error', 'Failed to submit exam');
    }
  };

  const handleExit = () => {
    setShowExitModal(true);
  };

  const confirmExit = () => {
    setShowExitModal(false);
    onExit();
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-lg text-gray-600">Loading exam...</Text>
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-lg text-gray-600">No questions available</Text>
        <TouchableOpacity onPress={onExit} className="mt-4 rounded-lg bg-blue-500 px-6 py-2">
          <Text className="font-medium text-white">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const answeredQuestions = Object.keys(answers).length;
  const progress = (answeredQuestions / questions.length) * 100;

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between bg-blue-600 px-4 py-3">
        <TouchableOpacity onPress={handleExit}>
          <Text className="font-medium text-white">Exit</Text>
        </TouchableOpacity>

        <View className="flex-row items-center space-x-4">
          <Text className="font-medium text-white">
            {answeredQuestions}/{questions.length} answered
          </Text>
          {timeRemaining && (
            <View className="rounded-full bg-red-500 px-3 py-1">
              <Text className="font-medium text-white">
                {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Progress Bar */}
      <View className="h-1 bg-gray-200">
        <View className="h-1 bg-blue-500" style={{ width: `${progress}%` }} />
      </View>

      {/* Question */}
      <ExamQuestion
        question={currentQuestion}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={questions.length}
        onAnswer={handleAnswer}
        onNext={handleNext}
        onPrevious={handlePrevious}
        currentAnswer={answers[currentQuestion.id]}
        timeRemaining={timeRemaining || undefined}
      />

      {/* Exit Confirmation Modal */}
      <Modal visible={showExitModal} transparent animationType="fade">
        <View className="flex-1 items-center justify-center bg-black bg-opacity-50">
          <View className="mx-4 w-80 rounded-lg bg-white p-6">
            <Text className="mb-2 text-lg font-semibold text-gray-900">Exit Exam?</Text>
            <Text className="mb-6 text-gray-600">
              Are you sure you want to exit? Your progress will be saved, but you&apos;ll need to
              restart the exam.
            </Text>
            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={() => setShowExitModal(false)}
                className="flex-1 rounded-lg bg-gray-200 py-3">
                <Text className="text-center font-medium text-gray-700">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={confirmExit} className="flex-1 rounded-lg bg-red-500 py-3">
                <Text className="text-center font-medium text-white">Exit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
