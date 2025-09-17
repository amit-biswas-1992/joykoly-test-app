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
import { examsService } from '@/services/exams.service';

interface LeaderboardEntry {
  id: string;
  rank: number;
  score: number;
  totalMarks: number;
  correctAnswers: number;
  totalQuestions: number;
  timeTaken: number;
  submittedAt: string;
  user: {
    id: string;
    name: string;
    email?: string;
    avatar?: string;
  };
}

interface Exam {
  id: string;
  title: string;
  description?: string;
  course?: { name: string; code: string };
  totalMarks: number;
  duration: number;
  questionType: string;
}

export default function ExamLeaderboardPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [exam, setExam] = useState<Exam | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use proper service methods
      const [examData, leaderboardData] = await Promise.all([
        examsService.getExam(id),
        examsService.getLeaderboard(id)
      ]);

      // Handle different response structures
      const exam = (examData as any)?.data || examData;
      const leaderboard = Array.isArray(leaderboardData) 
        ? leaderboardData 
        : (leaderboardData as any)?.data || [];

      setExam(exam);
      setLeaderboard(leaderboard);
    } catch (err: any) {
      console.error('Error fetching leaderboard:', err);
      
      // Handle specific error cases
      if (err?.response?.status === 404) {
        setError('Exam not found');
      } else if (err?.response?.status === 403) {
        setError('You do not have permission to view this leaderboard');
      } else if (err?.code === 'NETWORK_ERROR' || err?.message?.includes('Network Error')) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError(err?.message || 'Failed to load leaderboard');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchLeaderboard();
    }
  }, [id]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchLeaderboard();
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return { name: 'trophy' as const, color: '#FFD700' };
      case 2:
        return { name: 'medal' as const, color: '#C0C0C0' };
      case 3:
        return { name: 'medal' as const, color: '#CD7F32' };
      default:
        return { name: 'person' as const, color: '#6B7280' };
    }
  };

  const getRankBackground = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-100';
      case 2:
        return 'bg-gray-100';
      case 3:
        return 'bg-orange-100';
      default:
        return 'bg-white';
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50">
        {/* Header Skeleton */}
        <LinearGradient
          colors={['#3B82F6', '#1D4ED8']}
          style={{ paddingHorizontal: 24, paddingTop: 48, paddingBottom: 24 }}
        >
          <View className="flex-row items-center justify-between">
            <View className="w-8 h-8 bg-white rounded opacity-20" />
            <View className="flex-1 items-center mr-8">
              <View className="w-32 h-6 bg-white rounded mb-2 opacity-20" />
              <View className="w-24 h-4 bg-white rounded opacity-20" />
            </View>
          </View>
        </LinearGradient>
        
        {/* Content Skeleton */}
        <View className="flex-1 items-center justify-center px-6">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="text-gray-600 mt-4 text-center">Loading leaderboard...</Text>
        </View>
      </View>
    );
  }

  if (error || !exam) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center px-6">
        <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
        <Text className="text-xl font-bold text-gray-900 mt-4 text-center">
          Error loading leaderboard
        </Text>
        <Text className="text-gray-600 mt-2 text-center">
          {error || 'An unknown error occurred'}
        </Text>
        <TouchableOpacity
          onPress={fetchLeaderboard}
          className="mt-6 bg-blue-600 px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-semibold">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <LinearGradient
        colors={['#3B82F6', '#1D4ED8']}
        style={{ paddingHorizontal: 24, paddingTop: 48, paddingBottom: 24 }}
      >
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-2 -ml-2"
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-bold flex-1 text-center mr-8">
            Leaderboard
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
        {/* Stats Summary */}
        <View className="mx-4 mt-4 mb-6">
          <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <View className="flex-row justify-around">
              <View className="items-center flex-1">
                <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mb-2">
                  <Ionicons name="people" size={20} color="#3B82F6" />
                </View>
                <Text className="text-lg font-bold text-gray-900">
                  {leaderboard.length}
                </Text>
                <Text className="text-xs text-gray-500 text-center">Participants</Text>
              </View>
              
              <View className="items-center flex-1">
                <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center mb-2">
                  <Ionicons name="trophy" size={20} color="#10B981" />
                </View>
                <Text className="text-lg font-bold text-gray-900">
                  {exam.totalMarks}
                </Text>
                <Text className="text-xs text-gray-500 text-center">Total Marks</Text>
              </View>
              
              <View className="items-center flex-1">
                <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center mb-2">
                  <Ionicons name="time" size={20} color="#8B5CF6" />
                </View>
                <Text className="text-lg font-bold text-gray-900">
                  {exam.duration}
                </Text>
                <Text className="text-xs text-gray-500 text-center">Minutes</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Leaderboard */}
        <View className="mx-4 mb-6">
          <View className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <View className="px-6 py-4 border-b border-gray-100">
              <Text className="text-lg font-bold text-gray-900">Top Performers</Text>
            </View>
            
            {leaderboard.length === 0 ? (
              <View className="p-8 items-center">
                <Ionicons name="trophy-outline" size={48} color="#9CA3AF" />
                <Text className="text-gray-500 mt-2 text-center">
                  No participants yet
                </Text>
              </View>
            ) : (
              <View className="p-4">
                {leaderboard.map((entry, index) => {
                  const rankIcon = getRankIcon(entry.rank);
                  const scorePercentage = (entry.score / entry.totalMarks) * 100;
                  
                  return (
                    <View
                      key={entry.id}
                      className={`flex-row items-center p-4 rounded-xl mb-3 ${
                        entry.rank <= 3 ? 'border-2' : 'border border-gray-200'
                      } ${
                        entry.rank === 1 ? 'border-yellow-300' :
                        entry.rank === 2 ? 'border-gray-300' :
                        entry.rank === 3 ? 'border-orange-300' :
                        'border-gray-200'
                      }`}
                    >
                      {/* Rank */}
                      <View className="w-12 h-12 items-center justify-center mr-4">
                        {entry.rank <= 3 ? (
                          <View className={`w-10 h-10 rounded-full items-center justify-center ${
                            entry.rank === 1 ? 'bg-yellow-100' :
                            entry.rank === 2 ? 'bg-gray-100' :
                            'bg-orange-100'
                          }`}>
                            <Ionicons 
                              name={rankIcon.name} 
                              size={16} 
                              color={rankIcon.color} 
                            />
                          </View>
                        ) : (
                          <View className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center">
                            <Text className="text-sm font-bold text-gray-600">
                              {entry.rank}
                            </Text>
                          </View>
                        )}
                      </View>

                      {/* User Info */}
                      <View className="flex-1 min-w-0">
                        <Text className="text-base font-semibold text-gray-900" numberOfLines={1}>
                          {entry.user.name}
                        </Text>
                        <Text className="text-sm text-gray-500" numberOfLines={1}>
                          {entry.user.email || 'Student'}
                        </Text>
                      </View>

                      {/* Score */}
                      <View className="items-end ml-2">
                        <Text className="text-lg font-bold text-gray-900">
                          {entry.score}/{entry.totalMarks}
                        </Text>
                        <Text className="text-sm text-gray-500">
                          {scorePercentage.toFixed(1)}%
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </View>

        {/* Additional Actions */}
        <View className="mx-4 mb-6">
          <TouchableOpacity
            onPress={() => router.push(`/exams/${id}/submissions` as any)}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex-row items-center justify-between"
          >
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
                <Ionicons name="document-text" size={20} color="#3B82F6" />
              </View>
              <View>
                <Text className="text-base font-semibold text-gray-900">
                  View My Submissions
                </Text>
                <Text className="text-sm text-gray-500">
                  See detailed answers and feedback
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
