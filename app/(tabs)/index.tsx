import React, { useEffect } from 'react';
import { View, Text, Alert, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator, Platform } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { DashboardView } from '~/components/dashboard/DashboardView';
import { Course, Exam, getDashboardData, DashboardData } from '~/services/dashboard.service';
import { useColorScheme } from '~/lib/useColorScheme';

export default function Dashboard() {
  const { setColorScheme } = useColorScheme();
  const [data, setData] = React.useState<DashboardData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Force light mode for this page
  useEffect(() => {
    setColorScheme('light');
  }, [setColorScheme]);

  const loadData = async () => {
    try {
      setError(null);
      const dashboardData = await getDashboardData();
      setData(dashboardData);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleCoursePress = (course: Course) => {
    Alert.alert('Course Selected', `You selected: ${course.title}`);
  };

  const handleExamPress = (exam: Exam) => {
    if (exam.status === 'live' || exam.status === 'upcoming') {
      router.push(`/exam/${exam.id}`);
    } else {
      Alert.alert('Exam Completed', `You have already completed: ${exam.title}`);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center">
          <View className="items-center">
            <View className="relative mb-4">
              <ActivityIndicator size="large" color="#3B82F6" />
            </View>
            <View>
              <Text className="text-lg font-medium text-gray-700 mb-2">Loading your dashboard...</Text>
              <Text className="text-sm text-gray-500">This won't take long</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center px-6">
          <View className="items-center">
            <View className="w-24 h-24 bg-red-100 rounded-full items-center justify-center mb-4">
              <Ionicons name="alert-circle-outline" size={32} color="#EF4444" />
            </View>
            <View className="items-center mb-4">
              <Text className="text-lg font-medium text-gray-700 mb-2">Failed to load dashboard</Text>
              <Text className="text-sm text-gray-500 text-center">{error}</Text>
            </View>
            <TouchableOpacity 
              className="bg-blue-500 px-6 py-3 rounded-full"
              onPress={() => loadData()}
            >
              <Text className="text-white font-semibold">Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const inProgressCourses = data?.enrolledCourses?.filter(course => (course.progress || 0) < 100) || [];
  const completedCourses = data?.enrolledCourses?.filter(course => (course.progress || 0) >= 100) || [];
  const liveExams = data?.liveExams || [];
  const upcomingExams = data?.upcomingExams || [];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View className="px-6 py-6 bg-white">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-3xl font-bold text-gray-900">My Dashboard</Text>
              <Text className="text-gray-600 mt-1">
                {inProgressCourses.length} in progress • {completedCourses.length} completed
              </Text>
            </View>
            <TouchableOpacity 
              className={`${Platform.OS === 'ios' ? 'bg-gray-100' : 'bg-gray-200'} p-3 rounded-full`}
              style={{
                shadowColor: Platform.OS === 'ios' ? '#000' : 'transparent',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: Platform.OS === 'ios' ? 0.1 : 0,
                shadowRadius: Platform.OS === 'ios' ? 2 : 0,
              }}
            >
              <Ionicons name="search" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          {/* Quick stats */}
          <View className="flex-row">
            <View className="flex-1 bg-green-50 p-4 rounded-2xl mr-2">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-2xl font-bold text-green-600">
                    {inProgressCourses.length}
                  </Text>
                  <Text className="text-sm text-green-700">In Progress</Text>
                </View>
                <Ionicons name="play-circle" size={24} color="#059669" />
              </View>
            </View>
            
            <View className="flex-1 bg-blue-50 p-4 rounded-2xl ml-2">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-2xl font-bold text-blue-600">
                    {liveExams.length}
                  </Text>
                  <Text className="text-sm text-blue-700">Live Exams</Text>
                </View>
                <Ionicons name="flash" size={24} color="#2563EB" />
              </View>
            </View>
          </View>
        </View>

        {/* Main Content */}
        <DashboardView onCoursePress={handleCoursePress} onExamPress={handleExamPress} />
      </ScrollView>
    </SafeAreaView>
  );
}
