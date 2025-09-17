import React from 'react';
import { View, Text, Image, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Course } from '../../services/dashboard.service';

interface CourseCardProps {
  course: Course;
  onPress: (course: Course) => void;
  isCompleted?: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onPress, isCompleted = false }) => {
  const progress = course.progress || 0;
  
  const getProgressColor = () => {
    if (isCompleted) return '#10B981';
    if (progress > 50) return '#3B82F6';
    if (progress > 25) return '#F59E0B';
    return '#EF4444';
  };

  const getStatusIcon = () => {
    if (isCompleted) return 'checkmark-circle';
    if (progress > 0) return 'play-circle';
    return 'play-circle-outline';
  };

  return (
    <TouchableOpacity
      onPress={() => onPress(course)}
      className="mx-4 mb-3 bg-white rounded-xl overflow-hidden"
      style={{
        shadowColor: Platform.OS === 'ios' ? '#000' : '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: Platform.OS === 'ios' ? 0.15 : 0.2,
        shadowRadius: Platform.OS === 'ios' ? 8 : 4,
        elevation: Platform.OS === 'android' ? 8 : 0,
        // Enhanced border shadow
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.1)',
      }}>
      
      <View className="flex-row items-center p-4">
        {/* Course Thumbnail */}
        <View className="w-16 h-16 rounded-xl overflow-hidden mr-4 flex-shrink-0">
          {course?.imageUrl || course?.thumbnail ? (
            <Image
              source={{ uri: course?.imageUrl || course?.thumbnail }}
              className="h-full w-full"
              resizeMode="cover"
            />
          ) : (
            <View className="h-full w-full bg-gradient-to-br from-blue-100 to-purple-100 items-center justify-center">
              <Ionicons name="book" size={24} color="#6B7280" />
            </View>
          )}
        </View>
        
        {/* Course Content */}
        <View className="flex-1 mr-3">
          <View className="flex-row items-center mb-1">
            <Text className="text-xs font-semibold text-blue-600 uppercase tracking-wide mr-2">
              {course.level}
            </Text>
            {isCompleted && (
              <View className="bg-green-100 px-2 py-0.5 rounded-full">
                <Text className="text-xs font-semibold text-green-700">Completed</Text>
              </View>
            )}
          </View>
          
          <Text className="text-base font-bold text-gray-900 mb-1" numberOfLines={1}>
            {course.title}
          </Text>
        </View>
        
        {/* Action Button */}
        <TouchableOpacity 
          className={`w-10 h-10 rounded-full items-center justify-center ${
            isCompleted ? 'bg-green-100' : 'bg-blue-100'
          }`}
          onPress={() => onPress(course)}>
          <Ionicons 
            name={getStatusIcon()} 
            size={20} 
            color={isCompleted ? '#10B981' : '#3B82F6'} 
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};
