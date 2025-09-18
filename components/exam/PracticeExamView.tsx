import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MathRenderer } from '@/components/ui/math-renderer';
import { examsService } from '../../services/exams.service';

interface Question {
  id: string;
  question: string;
  type: string;
  options?: string[];
  correctAnswer: string | string[];
  marks: number;
  timeLimit?: number;
}

interface PracticeExamViewProps {
  examId: string;
  onComplete: (results: any) => void;
  onExit: () => void;
}

export const PracticeExamView: React.FC<PracticeExamViewProps> = ({ examId, onComplete, onExit }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    loadExamQuestions();
  }, [examId]);

  const loadExamQuestions = async () => {
    try {
      setLoading(true);
      const response = (await examsService.getQuestions(examId)) as any[];

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

  const handleSubmit = () => {
    Alert.alert(
      'Submit Practice Exam',
      'Are you sure you want to submit your practice exam?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Submit', onPress: submitPracticeExam },
      ]
    );
  };

  const submitPracticeExam = () => {
    // Calculate results for practice mode
    let correctAnswers = 0;
    let totalMarks = 0;
    let obtainedMarks = 0;

    const results = questions.map((question) => {
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer === question.correctAnswer;
      
      if (isCorrect) {
        correctAnswers++;
        obtainedMarks += question.marks;
      }
      totalMarks += question.marks;

      return {
        questionId: question.id,
        question: question.question,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        marks: question.marks,
      };
    });

    const practiceResults = {
      correctAnswers,
      totalQuestions: questions.length,
      obtainedMarks,
      totalMarks,
      percentage: totalMarks > 0 ? (obtainedMarks / totalMarks) * 100 : 0,
      results,
      isPractice: true,
    };

    onComplete(practiceResults);
  };

  const handleExit = () => {
    Alert.alert(
      'Exit Practice Exam',
      'Are you sure you want to exit? Your progress will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Exit', onPress: onExit },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-lg text-gray-600">Loading practice exam...</Text>
      </SafeAreaView>
    );
  }

  if (questions.length === 0) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-lg text-gray-600">No questions available</Text>
        <TouchableOpacity onPress={onExit} className="mt-4 rounded-lg bg-blue-500 px-6 py-2">
          <Text className="font-medium text-white">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const answeredQuestions = Object.keys(answers).length;
  const progress = (answeredQuestions / questions.length) * 100;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Practice Mode Banner */}
      <View className="w-full py-3 bg-purple-600">
        <Text className="text-center font-semibold text-white text-sm">
          PRACTICE MODE: Your answers are not saved. Unlimited attempts allowed.
        </Text>
      </View>

      {/* Header */}
      <View className="flex-row items-center justify-between bg-white px-4 py-3 border-b border-gray-200">
        <TouchableOpacity onPress={handleExit} className="flex-row items-center">
          <Ionicons name="arrow-back" size={20} color="#374151" />
          <Text className="ml-2 font-medium text-gray-700">Exit</Text>
        </TouchableOpacity>

        <View className="flex-row items-center space-x-4">
          <Text className="font-medium text-gray-700">
            {answeredQuestions}/{questions.length} answered
          </Text>
          <View className="bg-purple-100 px-3 py-1 rounded-full">
            <Text className="font-medium text-purple-700 text-xs">Practice</Text>
          </View>
        </View>
      </View>

      {/* Progress Bar */}
      <View className="h-1 bg-gray-200">
        <View className="h-1 bg-purple-500" style={{ width: `${progress}%` }} />
      </View>

      {/* Questions */}
      <ScrollView className="flex-1 px-4 py-4">
        {questions.map((question, index) => (
          <View key={question.id} className="bg-white rounded-lg p-4 mb-4 shadow-sm">
            {/* Question Header */}
            <View className="flex-row items-center mb-3">
              <View className="w-8 h-8 bg-purple-100 rounded-full items-center justify-center mr-3">
                <Text className="font-semibold text-purple-700 text-sm">{index + 1}</Text>
              </View>
              <Text className="text-sm font-medium text-gray-500">
                {question.marks} {question.marks === 1 ? 'mark' : 'marks'}
              </Text>
            </View>

            {/* Question Text */}
            <View className="mb-4">
              <MathRenderer content={question.question} className="text-gray-900" />
            </View>

            {/* Options */}
            {question.options && question.options.length > 0 && (
              <View className="space-y-2">
                {question.options.map((option, optionIndex) => {
                  const isSelected = answers[question.id] === option;
                  return (
                    <TouchableOpacity
                      key={optionIndex}
                      onPress={() => handleAnswer(question.id, option)}
                      className={`p-3 rounded-lg border ${
                        isSelected
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <View className="flex-row items-center">
                        <View
                          className={`w-5 h-5 rounded-full border items-center justify-center mr-3 ${
                            isSelected
                              ? 'border-purple-500 bg-purple-500'
                              : 'border-gray-300'
                          }`}
                        >
                          {isSelected && (
                            <Ionicons name="checkmark" size={12} color="white" />
                          )}
                        </View>
                        <View className="flex-1">
                          <MathRenderer content={option} className="text-gray-900" />
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {/* Text Input for non-MCQ questions */}
            {(!question.options || question.options.length === 0) && (
              <View className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                <Text className="text-gray-500 text-sm">
                  Text answer input would go here
                </Text>
              </View>
            )}
          </View>
        ))}

        {/* Submit Button */}
        <View className="mt-6 mb-8">
          <TouchableOpacity
            onPress={handleSubmit}
            className="bg-purple-600 rounded-lg py-4 px-6 items-center"
          >
            <Text className="text-white font-semibold text-lg">Submit Practice Exam</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
