import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
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
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-500">Loading dashboard...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="mb-4 text-center text-red-500">{error}</Text>
        <TouchableOpacity onPress={loadData} className="rounded-lg bg-blue-500 px-4 py-2">
          <Text className="font-medium text-white">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      {/* Enrolled Courses Section */}
      <View className="mt-4">
        <View className="mb-3 flex-row items-center justify-between px-4">
          <Text className="text-xl font-bold text-gray-900">My Courses</Text>
          <TouchableOpacity>
            <Text className="font-medium text-blue-500">View All</Text>
          </TouchableOpacity>
        </View>

        {data?.enrolledCourses && data.enrolledCourses.length > 0 ? (
          data.enrolledCourses.map((course) => (
            <CourseCard key={course.id} course={course} onPress={handleCoursePress} />
          ))
        ) : (
          <View className="mx-4 rounded-lg border border-gray-200 bg-white p-4">
            <Text className="text-center text-gray-500">No enrolled courses</Text>
          </View>
        )}
      </View>

      {/* Live Exams Section */}
      {data?.liveExams && data.liveExams.length > 0 && (
        <View className="mt-6">
          <View className="mb-3 flex-row items-center justify-between px-4">
            <Text className="text-xl font-bold text-gray-900">Live Exams</Text>
            <TouchableOpacity>
              <Text className="font-medium text-blue-500">View All</Text>
            </TouchableOpacity>
          </View>

          {data.liveExams.map((exam) => (
            <ExamCard key={exam.id} exam={exam} onPress={handleExamPress} />
          ))}
        </View>
      )}

      {/* Practice Exams Section */}
      {data?.practiceExams && data.practiceExams.length > 0 && (
        <View className="mt-6">
          <View className="mb-3 flex-row items-center justify-between px-4">
            <Text className="text-xl font-bold text-gray-900">Practice Exams</Text>
            <TouchableOpacity>
              <Text className="font-medium text-blue-500">View All</Text>
            </TouchableOpacity>
          </View>

          {data.practiceExams.map((exam) => (
            <ExamCard key={exam.id} exam={exam} onPress={handleExamPress} />
          ))}
        </View>
      )}

      {/* Upcoming Exams Section */}
      {data?.upcomingExams && data.upcomingExams.length > 0 && (
        <View className="mt-6">
          <View className="mb-3 flex-row items-center justify-between px-4">
            <Text className="text-xl font-bold text-gray-900">Upcoming Exams</Text>
            <TouchableOpacity>
              <Text className="font-medium text-blue-500">View All</Text>
            </TouchableOpacity>
          </View>

          {data.upcomingExams.map((exam) => (
            <ExamCard key={exam.id} exam={exam} onPress={handleExamPress} />
          ))}
        </View>
      )}

      {/* Completed Exams Section */}
      {data?.completedExams && data.completedExams.length > 0 && (
        <View className="mb-6 mt-6">
          <View className="mb-3 flex-row items-center justify-between px-4">
            <Text className="text-xl font-bold text-gray-900">Recent Results</Text>
            <TouchableOpacity>
              <Text className="font-medium text-blue-500">View All</Text>
            </TouchableOpacity>
          </View>

          {data.completedExams.slice(0, 3).map((exam) => (
            <ExamCard key={exam.id} exam={exam} onPress={handleExamPress} />
          ))}
        </View>
      )}
    </ScrollView>
  );
};
