import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Exam } from '../../services/dashboard.service';

interface ExamCardProps {
  exam: Exam;
  onPress: (exam: Exam) => void;
}

export const ExamCard: React.FC<ExamCardProps> = ({ exam, onPress }) => {
  const getStatusColor = () => {
    switch (exam.status) {
      case 'live':
        return 'bg-red-100 border-red-200';
      case 'upcoming':
        return 'bg-blue-100 border-blue-200';
      case 'completed':
        return 'bg-green-100 border-green-200';
      default:
        return 'bg-gray-100 border-gray-200';
    }
  };

  const getStatusText = () => {
    switch (exam.status) {
      case 'live':
        return 'Live Now';
      case 'upcoming':
        return 'Upcoming';
      case 'completed':
        return exam.passed ? 'Passed' : 'Failed';
      default:
        return 'Unknown';
    }
  };

  const getStatusTextColor = () => {
    switch (exam.status) {
      case 'live':
        return 'text-red-600';
      case 'upcoming':
        return 'text-blue-600';
      case 'completed':
        return exam.passed ? 'text-green-600' : 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      ' ' +
      date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );
  };

  return (
    <TouchableOpacity
      onPress={() => onPress(exam)}
      className={`mx-4 mb-3 rounded-lg border ${getStatusColor()}`}>
      <View className="p-4">
        <View className="mb-2 flex-row items-start justify-between">
          <View className="flex-1">
            <Text className="mb-1 text-lg font-semibold text-gray-900" numberOfLines={2}>
              {exam.title}
            </Text>
            <Text className="mb-2 text-sm text-gray-600" numberOfLines={2}>
              {exam.courseTitle}
            </Text>
          </View>
          <View className={`rounded-full px-2 py-1 ${getStatusColor()}`}>
            <Text className={`text-xs font-medium ${getStatusTextColor()}`}>{getStatusText()}</Text>
          </View>
        </View>

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center space-x-4">
            <View className="flex-row items-center">
              <Text className="text-xs text-gray-500">Duration:</Text>
              <Text className="ml-1 text-xs font-medium text-gray-700">{exam.duration}min</Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-xs text-gray-500">Questions:</Text>
              <Text className="ml-1 text-xs font-medium text-gray-700">{exam.totalQuestions}</Text>
            </View>
          </View>

          {exam.score !== undefined && (
            <View className="flex-row items-center">
              <Text className="text-xs text-gray-500">Score:</Text>
              <Text
                className={`ml-1 text-xs font-medium ${exam.passed ? 'text-green-600' : 'text-red-600'}`}>
                {exam.score}/{exam.totalMarks}
              </Text>
            </View>
          )}
        </View>

        <View className="mt-2">
          <Text className="text-xs text-gray-500">
            {exam.status === 'live'
              ? 'Ends at'
              : exam.status === 'upcoming'
                ? 'Starts at'
                : 'Ended at'}
            : {formatTime(exam.status === 'upcoming' ? exam.startTime : exam.endTime)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
