import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MathRenderer } from '@/components/ui/math-renderer';

interface Question {
  id: string;
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  type: 'MCQ' | 'CQ' | 'Written' | 'multiple' | 'single' | 'true_false' | 'short_answer' | 'essay';
  marks: number;
  questionType?: 'MCQ' | 'CQ' | 'Written' | 'multiple' | 'single' | 'true_false' | 'short_answer' | 'essay';
}

interface QuestionAnswer {
  id: string;
  questionId: string;
  question: Question | null;
  selectedOptions?: string[];
  textAnswer?: string;
  status: 'DRAFT' | 'SUBMITTED' | 'GRADED';
  score?: number;
  maxScore?: number;
  isCorrect: boolean;
  submittedAt?: string;
  gradedAt?: string;
  feedback?: string;
  explanation?: string;
  timeSpent?: number;
  questionNumber?: number;
  correctAnswer?: string | string[];
  questionType?: 'single' | 'multiple' | 'true_false' | 'short_answer' | 'essay';
  options?: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  userAnswer?: string | string[];
  correctOptions?: string[];
  pointsAwarded?: number;
  maxPoints?: number;
}

interface ExamParticipation {
  id: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  timeTaken: number;
  duration: number;
  rank?: number;
  isCompleted: boolean;
  isPassed: boolean;
  startedAt: string;
  submittedAt?: string;
  status: string;
  marksAwarded?: { questionId: string; marks: number; feedback: string }[];
}

interface Exam {
  id: string;
  title: string;
  description?: string;
  course?: { name: string; code: string };
  name?: string;
  code?: string;
  totalMarks: number;
  passingMarks: number;
  duration: number;
  questionType: 'MCQ' | 'CQ' | 'Mixed' | string;
  startTime?: string;
  endTime?: string;
  resultPublishDate?: string;
  questions?: Question[];
}

interface ExamResult {
  exam: Exam;
  participation?: ExamParticipation | null;
  answers: QuestionAnswer[];
  questions: Question[];
  leaderboard?: any[];
  totalParticipants: number;
}

export default function ExamSubmissionsPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [result, setResult] = useState<ExamResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExamResult = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock API calls - replace with actual API calls
      const examResponse = await fetch(`/api/v1/exams/${id}`);
      const questionsResponse = await fetch(`/api/v1/exams/${id}/questions`);
      const resultsResponse = await fetch(`/api/v1/exams/${id}/results`);
      const participationResponse = await fetch(`/api/v1/exams/${id}/participation`);

      if (!examResponse.ok) {
        throw new Error('Exam not found');
      }

      const examData = await examResponse.json();
      const questionsData = await questionsResponse.json();
      const resultsData = await resultsResponse.json();
      const participationData = await participationResponse.json();

      // Process the data similar to the web version
      const resultData: ExamResult = {
        exam: examData.data || examData,
        participation: participationData.participation || null,
        answers: participationData.answers || [],
        questions: questionsData.questions || questionsData || [],
        leaderboard: resultsData.data || [],
        totalParticipants: resultsData.data?.length || 0
      };

      setResult(resultData);
    } catch (err) {
      console.error('Error fetching exam result:', err);
      setError(err instanceof Error ? err.message : 'Failed to load exam results');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchExamResult();
    }
  }, [id]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchExamResult();
  };

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="text-gray-600 mt-4">Loading exam submissions...</Text>
      </View>
    );
  }

  if (error || !result) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center px-6">
        <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
        <Text className="text-xl font-bold text-gray-900 mt-4 text-center">
          Error loading exam results
        </Text>
        <Text className="text-gray-600 mt-2 text-center">
          {error || 'An unknown error occurred'}
        </Text>
        <TouchableOpacity
          onPress={fetchExamResult}
          className="mt-6 bg-blue-600 px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-semibold">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { exam, participation, questions, answers } = result;
  const hasParticipated = !!participation;
  
  // Calculate derived state
  const correctAnswers = participation?.correctAnswers || 0;
  const wrongAnswers = participation?.wrongAnswers || 0;
  const totalQuestionCount = participation?.totalQuestions || questions.length;
  const skippedAnswers = totalQuestionCount - correctAnswers - wrongAnswers;
  
  // Calculate percentage score
  const scorePercentage = hasParticipated && exam.totalMarks > 0 && participation.score ? 
    (participation.score / exam.totalMarks) * 100 : 0;

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <LinearGradient
        colors={['#3B82F6', '#1D4ED8']}
        className="px-6 pt-12 pb-6"
      >
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-2 -ml-2"
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-bold flex-1 text-center mr-8">
            Exam Submissions
          </Text>
        </View>
        
        <View className="mt-4">
          <Text className="text-white text-xl font-bold" numberOfLines={2}>
            {exam.title}
          </Text>
          <Text className="text-blue-100 text-sm mt-1">
            {exam.course?.name || exam.course?.code || 'General Course'}
          </Text>
        </View>
      </LinearGradient>

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Performance Summary */}
        {participation && (
          <View className="mx-4 mt-4 mb-6">
            <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <View className="items-center mb-6">
                {/* Circular Progress */}
                <View className="relative w-24 h-24 mb-4">
                  <View className="absolute inset-0 rounded-full border-4 border-gray-200" />
                  <View 
                    className="absolute inset-0 rounded-full border-4 border-green-500"
                    style={{
                      transform: [{ rotate: `${(scorePercentage / 100) * 360}deg` }],
                      borderTopColor: 'transparent',
                      borderRightColor: 'transparent',
                    }}
                  />
                  <View className="absolute inset-0 items-center justify-center">
                    <Text className="text-2xl font-bold text-gray-900">
                      {scorePercentage.toFixed(0)}%
                    </Text>
                    <Text className="text-xs text-gray-500">Score</Text>
                  </View>
                </View>
                
                <Text className="text-2xl font-bold text-gray-900">
                  {participation.score} / {exam.totalMarks}
                </Text>
                <Text className="text-sm text-gray-500">Total Marks</Text>
              </View>

              {/* Stats Grid */}
              <View className="flex-row justify-around mb-6">
                <View className="items-center">
                  <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center mb-2">
                    <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                  </View>
                  <Text className="text-lg font-bold text-gray-900">{correctAnswers}</Text>
                  <Text className="text-xs text-gray-500">Correct</Text>
                </View>
                
                <View className="items-center">
                  <View className="w-12 h-12 bg-red-100 rounded-full items-center justify-center mb-2">
                    <Ionicons name="close-circle" size={24} color="#EF4444" />
                  </View>
                  <Text className="text-lg font-bold text-gray-900">{wrongAnswers}</Text>
                  <Text className="text-xs text-gray-500">Wrong</Text>
                </View>
                
                <View className="items-center">
                  <View className="w-12 h-12 bg-yellow-100 rounded-full items-center justify-center mb-2">
                    <Ionicons name="ellipsis-horizontal" size={24} color="#F59E0B" />
                  </View>
                  <Text className="text-lg font-bold text-gray-900">{skippedAnswers}</Text>
                  <Text className="text-xs text-gray-500">Skipped</Text>
                </View>
              </View>

              {/* Additional Info */}
              <View className="flex-row justify-around">
                <View className="items-center">
                  <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mb-2">
                    <Ionicons name="trophy" size={24} color="#3B82F6" />
                  </View>
                  <Text className="text-lg font-bold text-gray-900">
                    {participation.rank || 'N/A'}
                  </Text>
                  <Text className="text-xs text-gray-500">Rank</Text>
                </View>
                
                <View className="items-center">
                  <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center mb-2">
                    <Ionicons name="people" size={24} color="#8B5CF6" />
                  </View>
                  <Text className="text-lg font-bold text-gray-900">
                    {result.totalParticipants || 'N/A'}
                  </Text>
                  <Text className="text-xs text-gray-500">Participants</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Questions Section */}
        <View className="mx-4 mb-6">
          <View className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <View className="px-6 py-4 border-b border-gray-100">
              <Text className="text-lg font-bold text-gray-900">Questions & Answers</Text>
            </View>
            
            <View className="p-6">
              {questions.map((question, index) => {
                const answer = answers.find(a => a.questionId === question.id);
                const isCorrect = answer?.isCorrect;
                const isSkipped = !answer?.selectedOptions?.length && !answer?.textAnswer;
                
                return (
                  <View key={question.id} className="mb-6 last:mb-0">
                    <View className="bg-gray-50 rounded-xl p-4">
                      {/* Question Header */}
                      <View className="flex-row items-start mb-4">
                        <View className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${
                          isCorrect ? 'bg-green-100' : 
                          isSkipped ? 'bg-gray-200' : 
                          'bg-red-100'
                        }`}>
                          <Ionicons 
                            name={isCorrect ? 'checkmark' : isSkipped ? 'ellipsis-horizontal' : 'close'} 
                            size={16} 
                            color={isCorrect ? '#10B981' : isSkipped ? '#6B7280' : '#EF4444'} 
                          />
                        </View>
                        
                        <View className="flex-1">
                          <Text className="text-sm font-medium text-gray-900 mb-2">
                            Question {index + 1} ({question.marks} {question.marks === 1 ? 'mark' : 'marks'})
                          </Text>
                          <View className="mb-3">
                            <MathRenderer content={question.question} className="text-gray-900" />
                          </View>
                        </View>
                      </View>

                      {/* Options */}
                      {question.options && question.options.length > 0 && (
                        <View className="space-y-2">
                          {question.options.map((option, i) => {
                            const isSelected = answer?.selectedOptions?.includes(option);
                            const isCorrectOption = Array.isArray(question.correctAnswer)
                              ? question.correctAnswer.includes(option)
                              : String(i) === question.correctAnswer;
                            
                            return (
                              <View 
                                key={i}
                                className={`p-3 rounded-lg border ${
                                  isCorrectOption ? 'border-green-500 bg-green-50' :
                                  (isSelected && !isCorrectOption) ? 'border-red-500 bg-red-50' :
                                  'border-gray-200 bg-white'
                                }`}
                              >
                                <View className="flex-row items-center">
                                  <View className={`w-6 h-6 rounded-full border items-center justify-center mr-3 ${
                                    isSelected && isCorrectOption ? 'border-green-500 bg-green-500' :
                                    isSelected ? 'border-red-500 bg-red-500' :
                                    isCorrectOption ? 'border-green-500 bg-green-500' :
                                    'border-gray-300'
                                  }`}>
                                    {isCorrectOption ? (
                                      <Ionicons name="checkmark" size={12} color="white" />
                                    ) : isSelected ? (
                                      <Ionicons name="close" size={12} color="white" />
                                    ) : null}
                                  </View>
                                  <View className="flex-1">
                                    <MathRenderer content={option} className="text-gray-900" />
                                  </View>
                                </View>
                              </View>
                            );
                          })}
                        </View>
                      )}

                      {/* Text Answer */}
                      {!question.options?.length && (
                        <View className="space-y-3">
                          {answer?.textAnswer && (
                            <View>
                              <Text className="text-sm font-medium text-gray-700 mb-2">Your Answer:</Text>
                              <View className={`p-3 rounded-lg border ${
                                isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                              }`}>
                                <MathRenderer content={answer.textAnswer} className="text-gray-900" />
                              </View>
                            </View>
                          )}
                          
                          {question.correctAnswer && typeof question.correctAnswer === 'string' && (
                            <View>
                              <Text className="text-sm font-medium text-gray-700 mb-2">Correct Answer:</Text>
                              <View className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                <MathRenderer content={question.correctAnswer} className="text-green-800" />
                              </View>
                            </View>
                          )}
                          
                          {answer?.feedback && (
                            <View>
                              <Text className="text-sm font-medium text-gray-700 mb-2">Feedback:</Text>
                              <View className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                                <MathRenderer content={answer.feedback} className="text-blue-800" />
                              </View>
                            </View>
                          )}
                          
                          {answer?.score !== undefined && (
                            <View>
                              <Text className="text-sm font-medium text-gray-700 mb-2">Score:</Text>
                              <View className="flex-row items-center">
                                <Text className="text-lg font-medium text-gray-900">
                                  {answer.score} / {answer.maxScore || question.marks}
                                </Text>
                                <Text className="text-sm text-gray-500 ml-2">
                                  ({(answer.score / (answer.maxScore || question.marks) * 100).toFixed(1)}%)
                                </Text>
                              </View>
                            </View>
                          )}
                        </View>
                      )}

                      {/* Explanation */}
                      {question.explanation && (
                        <View className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                          <Text className="text-sm font-medium text-blue-800 mb-2">Explanation:</Text>
                          <MathRenderer content={question.explanation} className="text-blue-700" />
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
