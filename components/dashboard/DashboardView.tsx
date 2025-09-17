import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CourseCard } from './CourseCard';
import { ExamCard } from './ExamCard';
import { getDashboardData, DashboardData, Course, Exam } from '../../services/dashboard.service';

interface DashboardViewProps {
  onCoursePress?: (course: Course) => void;
  onExamPress?: (exam: Exam) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onCoursePress, onExamPress }) => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    if (onCoursePress) {
      onCoursePress(course);
    }
  };

  const handleExamPress = (exam: Exam) => {
    if (onExamPress) {
      onExamPress(exam);
    }
  };

  if (loading && !data) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <View className="items-center">
          <View className="relative mb-4">
            <ActivityIndicator size="large" color="#3B82F6" />
          </View>
          <View>
            <Text className="text-lg font-medium text-gray-700 mb-2">Loading your courses...</Text>
            <Text className="text-sm text-gray-500">This won't take long</Text>
          </View>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <View className="items-center">
          <View className="w-24 h-24 bg-red-100 rounded-full items-center justify-center mb-4">
            <Ionicons name="alert-circle-outline" size={32} color="#EF4444" />
          </View>
          <View className="items-center mb-4">
            <Text className="text-lg font-medium text-gray-700 mb-2">Failed to load courses</Text>
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
    );
  }

  // Separate courses into in progress and completed
  const inProgressCourses = data?.enrolledCourses?.filter(course => (course.progress || 0) < 100) || [];
  const completedCourses = data?.enrolledCourses?.filter(course => (course.progress || 0) >= 100) || [];

  return (
    <ScrollView
      className="flex-1 bg-background-light"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      
      {/* In Progress Section */}
      {inProgressCourses.length > 0 && (
        <View className="mt-6">
          <View className="px-6 mb-4">
            <Text className="text-xl font-bold text-gray-900">In Progress</Text>
            <Text className="text-sm text-gray-600 mt-1">{inProgressCourses.length} courses</Text>
          </View>
          {inProgressCourses.map((course) => (
            <CourseCard key={course.id} course={course} onPress={handleCoursePress} isCompleted={false} />
          ))}
        </View>
      )}

      {/* Completed Section */}
      {completedCourses.length > 0 && (
        <View className="mt-6">
          <View className="px-6 mb-4">
            <Text className="text-xl font-bold text-gray-900">Completed</Text>
            <Text className="text-sm text-gray-600 mt-1">{completedCourses.length} courses</Text>
          </View>
          {completedCourses.map((course) => (
            <CourseCard key={course.id} course={course} onPress={handleCoursePress} isCompleted={true} />
          ))}
        </View>
      )}

      {/* Live Exams Section */}
      {data?.liveExams && data.liveExams.length > 0 && (
        <View className="mt-6">
          <View className="px-6 mb-4">
            <Text className="text-xl font-bold text-gray-900">Live Exams</Text>
            <Text className="text-sm text-gray-600 mt-1">{data.liveExams.length} exams</Text>
          </View>
          {data.liveExams.map((exam) => (
            <ExamCard key={exam.id} exam={exam} onPress={handleExamPress} />
          ))}
        </View>
      )}

      {/* Upcoming Exams Section */}
      {data?.upcomingExams && data.upcomingExams.length > 0 && (
        <View className="mt-6">
          <View className="px-6 mb-4">
            <Text className="text-xl font-bold text-gray-900">Upcoming Exams</Text>
            <Text className="text-sm text-gray-600 mt-1">{data.upcomingExams.length} exams</Text>
          </View>
          {data.upcomingExams.map((exam) => (
            <ExamCard key={exam.id} exam={exam} onPress={handleExamPress} />
          ))}
        </View>
      )}

      {/* Empty State */}
      {inProgressCourses.length === 0 && completedCourses.length === 0 && 
       (!data?.liveExams || data.liveExams.length === 0) && 
       (!data?.upcomingExams || data.upcomingExams.length === 0) && (
        <View className="px-6 py-12 items-center">
          <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center mb-4">
            <Ionicons name="school-outline" size={32} color="#9CA3AF" />
          </View>
          <Text className="text-lg font-medium text-gray-600 mb-2">No courses or exams yet</Text>
          <Text className="text-sm text-gray-500 text-center px-8">
            Start your learning journey by enrolling in courses or check back later for scheduled exams.
          </Text>
        </View>
      )}

    </ScrollView>
  );
};
