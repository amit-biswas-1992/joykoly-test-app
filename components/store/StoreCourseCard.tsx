import React from 'react';
import { View, Text, Image, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StoreCourse } from '../../services/store.service';

interface StoreCourseCardProps {
  course: StoreCourse;
  onPress: (course: StoreCourse) => void;
  isFeatured?: boolean;
  style?: 'horizontal' | 'vertical';
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 2 columns with padding

export const StoreCourseCard: React.FC<StoreCourseCardProps> = ({ 
  course, 
  onPress, 
  isFeatured = false,
  style = 'vertical'
}) => {
  const formatPrice = (price: number) => {
    if (price === 0) return 'Free';
    return `৳${price.toLocaleString()}`;
  };

  const formatRating = (rating?: number) => {
    if (!rating) return '4.5';
    return rating.toFixed(1);
  };

  const formatStudents = (students?: number) => {
    if (!students) return '0';
    if (students >= 1000) return `${(students / 1000).toFixed(1)}k`;
    return students.toString();
  };

  if (style === 'horizontal') {
    return (
      <TouchableOpacity
        onPress={() => onPress(course)}
        className="bg-white rounded-xl overflow-hidden mb-3"
        style={{
          shadowColor: Platform.OS === 'ios' ? '#000' : '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: Platform.OS === 'ios' ? 0.08 : 0.12,
          shadowRadius: Platform.OS === 'ios' ? 4 : 2,
          elevation: Platform.OS === 'android' ? 2 : 0,
        }}
      >
        <View className="flex-row">
          {/* Course Image */}
          <View className="w-24 h-20">
            {course.imageUrl ? (
              <Image
                source={{ uri: course.imageUrl }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 items-center justify-center">
                <Ionicons name="book" size={18} color="#6B7280" />
              </View>
            )}
          </View>
          
          {/* Course Content */}
          <View className="flex-1 p-3">
            <View className="flex-row items-center mb-1">
              <View className="bg-blue-100 px-1.5 py-0.5 rounded mr-2">
                <Text className="text-xs font-medium text-blue-700 uppercase">
                  {course.category || course.level}
                </Text>
              </View>
              {course.rating && (
                <View className="flex-row items-center">
                  <Ionicons name="star" size={10} color="#F59E0B" />
                  <Text className="text-xs text-gray-600 ml-0.5">{formatRating(course.rating)}</Text>
                </View>
              )}
            </View>
            
            <Text className="text-sm font-bold text-gray-900 mb-1" numberOfLines={2}>
              {course.title}
            </Text>
            
            
            
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Ionicons name="time" size={12} color="#6B7280" />
                <Text className="text-xs text-gray-600 ml-1">{course.duration}</Text>
              </View>
              <Text className="text-sm font-bold text-blue-600">
                {formatPrice(course.price)}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={() => onPress(course)}
      className="bg-white rounded-xl overflow-hidden"
      style={{
        shadowColor: Platform.OS === 'ios' ? '#000' : '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: Platform.OS === 'ios' ? 0.08 : 0.12,
        shadowRadius: Platform.OS === 'ios' ? 6 : 3,
        elevation: Platform.OS === 'android' ? 3 : 0,
        width: isFeatured ? 240 : cardWidth,
      }}
    >
      {/* Course Image */}
      <View className="h-28">
        {course.imageUrl ? (
          <Image
            source={{ uri: course.imageUrl }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 items-center justify-center">
            <Ionicons name="book" size={24} color="#6B7280" />
          </View>
        )}
        
        {/* Featured Badge */}
        {isFeatured && (
          <View className="absolute top-2 left-2 bg-orange-500 px-1.5 py-0.5 rounded">
            <Text className="text-xs font-bold text-white">Featured</Text>
          </View>
        )}
        
        {/* Price Badge */}
        <View className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded">
          <Text className="text-xs font-bold text-gray-900">
            {formatPrice(course.price)}
          </Text>
        </View>
      </View>
      
      {/* Course Content */}
      <View className="p-3">
        {/* Category and Rating */}
        <View className="flex-row items-center justify-between mb-1.5">
          <View className="bg-blue-100 px-1.5 py-0.5 rounded">
            <Text className="text-xs font-medium text-blue-700 uppercase">
              {course.category || course.level}
            </Text>
          </View>
          {course.rating && (
            <View className="flex-row items-center">
              <Ionicons name="star" size={12} color="#F59E0B" />
              <Text className="text-xs text-gray-600 ml-0.5">{formatRating(course.rating)}</Text>
            </View>
          )}
        </View>
        
        {/* Course Title */}
        <Text className="text-sm font-bold text-gray-900 mb-1" numberOfLines={2}>
          {course.title}
        </Text>
        

        
       
        
        {/* Original Price (if discounted) */}
        {course.originalPrice && course.originalPrice > course.price && (
          <View className="flex-row items-center mb-2">
            <Text className="text-xs text-gray-500 line-through mr-1">
              ৳{course.originalPrice.toLocaleString()}
            </Text>
            <View className="bg-red-100 px-1.5 py-0.5 rounded">
              <Text className="text-xs font-medium text-red-600">
                {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}% OFF
              </Text>
            </View>
          </View>
        )}
        
        {/* Enroll Button */}
        <TouchableOpacity 
          className={`py-2 rounded-lg items-center ${
            course.enrolled 
              ? 'bg-green-100' 
              : course.price === 0 
                ? 'bg-blue-600' 
                : 'bg-gray-900'
          }`}
          onPress={() => onPress(course)}
        >
          <Text className={`font-medium text-xs ${
            course.enrolled 
              ? 'text-green-700' 
              : 'text-white'
          }`}>
            {course.enrolled ? 'Continue' : course.price === 0 ? 'Enroll Free' : 'Enroll Now'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};
