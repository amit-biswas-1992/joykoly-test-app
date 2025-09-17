import React from 'react';
import { View, Text, TouchableOpacity, Image, Platform } from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { StoreCourse } from '@/services/store.service';

interface CourseCardProps {
  course: StoreCourse;
  isFeatured?: boolean;
  onPress: (course: StoreCourse) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ 
  course, 
  isFeatured = false, 
  onPress 
}) => {
  if (isFeatured) {
    // Featured course card with Apple Books style
    return (
      <View className="mr-4 w-64">
        <TouchableOpacity
          onPress={() => onPress(course)}
          className="bg-white rounded-2xl overflow-hidden"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.12,
            shadowRadius: 16,
            elevation: 8,
          }}
        >
          <View className="relative">
            {course.imageUrl ? (
              <Image
                source={{ uri: course.imageUrl }}
                className="w-full h-56"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-56 bg-gradient-to-br from-blue-500 to-purple-600 items-center justify-center">
                <Ionicons name="play" size={48} color="white" />
              </View>
            )}
            
            {/* Featured badge */}
            <View className="absolute top-4 left-4 bg-orange-500 px-3 py-1.5 rounded-full">
              <Text className="text-white text-xs font-semibold">Featured</Text>
            </View>
            
            {/* Favorite button */}
            <View className="absolute top-4 right-4">
              <TouchableOpacity className="bg-white/90 p-2.5 rounded-full">
                <AntDesign name="heart" size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            {/* Price badge */}
            <View className="absolute bottom-4 right-4">
              <View className="bg-white/95 px-3 py-2 rounded-full shadow-sm">
                <Text className="text-sm font-bold text-gray-900 text-center">
                  {course.price === 0 ? 'Free' : `৳${course.price}`}
                </Text>
              </View>
            </View>
          </View>
          
          {/* Course info */}
          <View className="p-4">
            <Text className="text-lg font-bold text-gray-900 mb-2" numberOfLines={2}>
              {course.title || 'No Title'}
            </Text>
            <Text className="text-sm text-gray-600 mb-2" numberOfLines={1}>
              {course.instructor}
            </Text>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <AntDesign name="star" size={14} color="#F59E0B" />
                <Text className="text-sm font-medium text-gray-700 ml-1">
                  {course.rating || 4.8}
                </Text>
              </View>
              <Text className="text-xs text-gray-500">{course.duration}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  // Regular course card with Apple Books grid style
  return (
    <View className="mb-4">
      <TouchableOpacity
        onPress={() => onPress(course)}
        className="bg-white overflow-hidden"
        style={{
          borderRadius: Platform.OS === 'ios' ? 12 : 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 4,
        }}
      >
        {/* Course thumbnail */}
        <View className="relative" style={{ aspectRatio: 3/4 }}>
          {course.imageUrl ? (
            <Image
              source={{ uri: course.imageUrl }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 items-center justify-center">
              <Ionicons name="play" size={32} color="white" />
            </View>
          )}
          
          {/* Category badge */}
          <View className="absolute top-3 left-3">
            <View className="bg-white/90 px-2 py-1 rounded-md">
              <Text className="text-xs font-medium text-gray-700">{course.category}</Text>
            </View>
          </View>
          
          {/* Heart icon */}
          <View className="absolute top-3 right-3">
            <TouchableOpacity className="bg-white/90 p-1.5 rounded-full">
              <AntDesign name="heart" size={14} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Course content */}
        <View className="p-3">
          <Text className="text-base font-semibold text-gray-900 mb-1" numberOfLines={2}>
            {course.title || 'No Title'}
          </Text>
          
          <Text className="text-sm text-gray-600 mb-2" numberOfLines={1}>
            {course.instructor}
          </Text>
          
          {/* Rating and duration */}
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center">
              <AntDesign name="star" size={12} color="#F59E0B" />
              <Text className="text-xs font-medium text-gray-700 ml-1">
                {course.rating || 4.8}
              </Text>
            </View>
            <Text className="text-xs text-gray-500">{course.duration}</Text>
          </View>
          
          {/* Price */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              {course.originalPrice && course.originalPrice > course.price ? (
                <>
                  <Text className="text-sm text-gray-400 line-through mr-2">
                    ৳{course.originalPrice}
                  </Text>
                  <Text className="text-lg font-bold text-green-600">
                    {course.price === 0 ? 'Free' : `৳${course.price}`}
                  </Text>
                </>
              ) : (
                <Text className="text-lg font-bold text-gray-900">
                  {course.price === 0 ? 'Free' : `৳${course.price}`}
                </Text>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};
