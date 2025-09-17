import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Exam } from '../../services/dashboard.service';

interface ExamCardProps {
  exam: Exam;
  onPress: (exam: Exam) => void;
}

export const ExamCard: React.FC<ExamCardProps> = ({ exam, onPress }) => {
  const getStatusColor = () => {
    switch (exam.status) {
      case 'live':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-700',
          icon: 'flash',
          iconColor: '#EF4444'
        };
      case 'upcoming':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-700',
          icon: 'time',
          iconColor: '#2563EB'
        };
      case 'completed':
        return {
          bg: exam.passed ? 'bg-green-50' : 'bg-red-50',
          border: exam.passed ? 'border-green-200' : 'border-red-200',
          text: exam.passed ? 'text-green-700' : 'text-red-700',
          icon: exam.passed ? 'checkmark-circle' : 'close-circle',
          iconColor: exam.passed ? '#10B981' : '#EF4444'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-700',
          icon: 'help-circle',
          iconColor: '#6B7280'
        };
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

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      ' ' +
      date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );
  };

  const statusColors = getStatusColor();

  return (
    <TouchableOpacity
      onPress={() => onPress(exam)}
      className={`mx-4 mb-3 bg-white rounded-xl border ${statusColors.border} overflow-hidden`}
      style={{
        shadowColor: Platform.OS === 'ios' ? '#000' : 'transparent',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: Platform.OS === 'ios' ? 0.25 : 0,
        shadowRadius: Platform.OS === 'ios' ? 20 : 0,
        elevation: Platform.OS === 'android' ? 15 : 0,
        // Additional 3D shadow effects
        borderWidth: 1,
      }}>
      
      <View className="flex-row items-center p-4">
        {/* Status Icon */}
        <View className={`w-12 h-12 rounded-xl ${statusColors.bg} items-center justify-center mr-4 flex-shrink-0`}>
          <Ionicons name={statusColors.icon} size={20} color={statusColors.iconColor} />
        </View>
        
        {/* Exam Content */}
        <View className="flex-1 mr-3">
          <View className="flex-row items-center mb-1">
            <Text className={`text-xs font-semibold ${statusColors.text} uppercase tracking-wide mr-2`}>
              {getStatusText()}
            </Text>
            {exam.score !== undefined && (
              <View className={`px-2 py-0.5 rounded-full ${statusColors.bg}`}>
                <Text className={`text-xs font-semibold ${statusColors.text}`}>
                  {exam.score}/{exam.totalMarks}
                </Text>
              </View>
            )}
          </View>
          
          <Text className="text-base font-bold text-gray-900 mb-1" numberOfLines={1}>
            {exam.title}
          </Text>
          
          <Text className="text-sm text-gray-600 mb-2" numberOfLines={1}>
            {exam.courseTitle}
          </Text>
          
          {/* Exam Details */}
          <View className="flex-row items-center">
            <View className="flex-row items-center mr-4">
              <Ionicons name="time-outline" size={14} color="#6B7280" />
              <Text className="ml-1 text-xs text-gray-600">{exam.duration}min</Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="help-circle-outline" size={14} color="#6B7280" />
              <Text className="ml-1 text-xs text-gray-600">{exam.totalQuestions} Q</Text>
            </View>
          </View>
        </View>
        
        {/* Action Button */}
        <TouchableOpacity 
          className={`w-10 h-10 rounded-full items-center justify-center ${statusColors.bg}`}
          onPress={() => onPress(exam)}>
          <Ionicons 
            name={exam.status === 'live' ? 'play' : exam.status === 'upcoming' ? 'eye' : 'document-text'} 
            size={18} 
            color={statusColors.iconColor} 
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

