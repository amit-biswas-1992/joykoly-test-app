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
      className="mx-4 mb-3 rounded-2xl bg-white shadow-lg"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
      }}>
      <View className="p-5">
        <View className="flex-row items-center">
          {course?.imageUrl ? (
            <Image
              source={{ uri: course?.imageUrl }}
              className="mr-4 h-20 w-20 rounded-xl"
              resizeMode="cover"
            />
          ) : (
            <View className="mr-4 h-20 w-20 rounded-xl bg-gray-100" />
          )}
          <View className="flex-1">
            <Text className="mb-2 text-lg font-semibold text-gray-900" numberOfLines={2}>
              {course.title}
            </Text>
            <View className="rounded-full bg-blue-50 px-3 py-1 self-start">
              <Text className="text-sm font-medium text-blue-600 capitalize">
                {course.level}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
