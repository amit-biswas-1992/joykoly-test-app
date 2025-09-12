import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Course } from '../../services/dashboard.service';

interface CourseCardProps {
  course: Course;
  onPress: (course: Course) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onPress }) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(course)}
      className="mx-4 mb-3 rounded-lg border border-gray-200 bg-white shadow-sm">
      <View className="p-4">
        <View className="flex-row items-start space-x-3">
          {course.thumbnail && (
            <Image
              source={{ uri: course.thumbnail }}
              className="h-16 w-16 rounded-lg"
              resizeMode="cover"
            />
          )}
          <View className="flex-1">
            <Text className="mb-1 text-lg font-semibold text-gray-900" numberOfLines={2}>
              {course.title}
            </Text>
            <Text className="mb-2 text-sm text-gray-600" numberOfLines={2}>
              {course.description}
            </Text>
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-gray-500">{course.instructor}</Text>
              <View className="flex-row items-center space-x-2">
                {course.progress !== undefined && (
                  <View className="flex-row items-center">
                    <View className="mr-2 h-2 w-16 rounded-full bg-gray-200">
                      <View
                        className="h-2 rounded-full bg-blue-500"
                        style={{ width: `${course.progress}%` }}
                      />
                    </View>
                    <Text className="text-xs text-gray-500">{Math.round(course.progress)}%</Text>
                  </View>
                )}
                <Text className="text-sm font-medium text-blue-600">{course.duration}h</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
