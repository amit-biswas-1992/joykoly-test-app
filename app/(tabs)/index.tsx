import React from 'react';
import { View, Text, Alert } from 'react-native';
import { router } from 'expo-router';
import { DashboardView } from '~/components/dashboard/DashboardView';
import { Course, Exam } from '~/services/dashboard.service';

export default function Dashboard() {
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

  return (
    <View className="flex-1 bg-gray-50">
      <DashboardView onCoursePress={handleCoursePress} onExamPress={handleExamPress} />
    </View>
  );
}
