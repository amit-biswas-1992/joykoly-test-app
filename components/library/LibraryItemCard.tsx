import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EXAM_TYPE_COLORS, EXAM_TYPE_ICONS, ExamType } from './constants';

interface LibraryItem {
  id: string;
  title: string;
  type: 'live' | 'upcoming' | 'completed';
  thumbnail?: string;
  progress?: number;
  lastAccessed?: string;
  isCompleted?: boolean;
  category?: string;
  course?: string;
  duration?: number;
  totalMarks?: number;
  status?: string;
  score?: number;
  scheduledAt?: string;
  startTime?: string;
  endTime?: string;
}

interface LibraryItemCardProps {
  item: LibraryItem;
  onPress: (item: LibraryItem) => void;
}

const formatExamTime = (item: LibraryItem) => {
  if (item.startTime && item.endTime) {
    const startTime = new Date(item.startTime).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
    const endTime = new Date(item.endTime).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
    return `${startTime} - ${endTime}`
  }
  if (item.scheduledAt) {
    return new Date(item.scheduledAt).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }
  return 'Time not specified'
}

export const LibraryItemCard: React.FC<LibraryItemCardProps> = ({ item, onPress }) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(item)}
      className={`bg-white rounded-2xl shadow-sm border overflow-hidden mb-4 bg-${EXAM_TYPE_COLORS[item.type as ExamType]?.background || 'gray-50'} border-${EXAM_TYPE_COLORS[item.type as ExamType]?.border || 'gray-200'}`}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      }}
      activeOpacity={0.7}
    >
      <View className="flex-row">
        {/* Exam Icon */}
        <View className="w-24 h-32 relative items-center justify-center">
          <View 
            className={`w-full h-full items-center justify-center bg-${EXAM_TYPE_COLORS[item.type as ExamType]?.primary || 'gray-500'}`}
          >
            <Ionicons 
              name={EXAM_TYPE_ICONS[item.type as ExamType] as any || 'help-circle'} 
              size={32} 
              color="white" 
            />
          </View>
          
          {/* Status badge */}
          <View 
            className={`absolute top-2 left-2 px-2 py-1 rounded-full bg-${EXAM_TYPE_COLORS[item.type as ExamType]?.primary || 'gray-500'}`}
          >
            <Text className="text-white text-xs font-semibold">
              {item.status ? item.status : item.type}
            </Text>
          </View>
          
          {/* Score badge for completed */}
          {item.type === 'completed' && item.score ? (
            <View className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full">
              <Text className="text-green-600 text-xs font-bold">{item.score}</Text>
            </View>
          ) : null}
        </View>
        
        {/* Content */}
        <View className="flex-1 p-4">
          <View className="flex-row items-start justify-between mb-2">
            <View className="flex-1 mr-2">
              <Text className="text-base font-bold text-gray-900 mb-1" numberOfLines={2}>
                {item.title}
              </Text>
              <Text className="text-sm text-gray-600 mb-1">
                {item.course ? item.course : item.category}
              </Text>
            </View>
            
            <TouchableOpacity className="p-1">
              <Ionicons name="ellipsis-vertical" size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          {/* Progress bar for live exams */}
          {item.type === 'live' ? (
            <View className="mb-3">
              <View className="flex-row items-center justify-between mb-1">
                <Text className="text-xs text-gray-500">Progress</Text>
                <Text className="text-xs font-medium text-gray-700">{item.progress ? item.progress : 0}%</Text>
              </View>
              <View className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <View 
                  className="h-full rounded-full bg-red-500"
                  style={{ width: `${item.progress ? item.progress : 0}%` }}
                />
              </View>
            </View>
          ) : null}
          
          {/* Exam details */}
          <View>
            <View className="flex-row items-center mb-2">
              <Ionicons name="time-outline" size={14} color="#6B7280" />
              <Text className="text-xs text-gray-600 ml-2">
                {item.duration ? item.duration : 0} min • {item.totalMarks ? item.totalMarks : 0} marks
              </Text>
            </View>
            
            {item.type === 'live' ? (
              <View className="flex-row items-center mb-2">
                <Ionicons name="flash" size={14} color="#EF4444" />
                <Text className="text-xs text-red-600 ml-2 font-medium">
                  {formatExamTime(item)}
                </Text>
              </View>
            ) : null}
            
            {item.type === 'upcoming' && item.scheduledAt ? (
              <View className="flex-row items-center mb-2">
                <Ionicons name="calendar-outline" size={14} color="#3B82F6" />
                <Text className="text-xs text-blue-600 ml-2">
                  {new Date(item.scheduledAt).toLocaleDateString()}
                </Text>
              </View>
            ) : null}
            
            {item.type === 'completed' && item.score ? (
              <View className="flex-row items-center">
                <Ionicons name="trophy-outline" size={14} color="#10B981" />
                <Text className="text-xs text-green-600 ml-2 font-medium">
                  Score: {item.score ? item.score : 0}/{item.totalMarks ? item.totalMarks : 0}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

LibraryItemCard.displayName = 'LibraryItemCard';
