import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons, MaterialIcons, AntDesign } from '@expo/vector-icons';
import { storeService, StoreCourse } from '../../../../services/store.service';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function CourseDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [course, setCourse] = useState<StoreCourse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadCourse();
    }
  }, [id]);

  const loadCourse = async () => {
    try {
      setLoading(true);
      const courseData = await storeService.getCourseById(id);
      setCourse(courseData);
    } catch (error) {
      console.error('Error loading course:', error);
      Alert.alert('Error', 'Failed to load course details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!course) return;
    
    try {
      Alert.alert(
        'Enroll in Course',
        `Would you like to enroll in "${course.title}"?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Enroll', 
            onPress: async () => {
              try {
                await storeService.purchaseCourse(course.id);
                Alert.alert('Success', 'You have been enrolled in the course!');
                router.back();
              } catch (error: any) {
                // Handle specific error cases
                if (error?.data?.statusCode === 409 || error?.message?.includes('already enrolled')) {
                  Alert.alert(
                    'Already Enrolled',
                    'You are already enrolled in this course! You can access it from your enrolled courses.',
                    [
                      { text: 'OK', style: 'default' },
                      { 
                        text: 'View My Courses', 
                        onPress: () => {
                          // Navigate to enrolled courses or dashboard
                          router.push('/(drawer)/(tabs)/');
                        }
                      }
                    ]
                  );
                } else {
                  Alert.alert('Error', 'Failed to enroll in course. Please try again.');
                }
              }
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to enroll in course. Please try again.');
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="text-gray-600 mt-4">Loading course details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!course) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="book-outline" size={64} color="#9CA3AF" />
          <Text className="text-xl font-bold text-gray-900 mt-4 mb-2">Course Not Found</Text>
          <Text className="text-gray-600 text-center mb-6">
            The course you're looking for could not be found.
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-blue-600 px-6 py-3 rounded-xl"
          >
            <Text className="text-white font-semibold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Header with back button */}
        <View className="px-6 py-4 bg-white">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              onPress={() => router.back()}
              className="flex-row items-center"
            >
              <Ionicons name="arrow-back" size={24} color="#000" />
              <Text className="text-black font-medium ml-2">Back</Text>
            </TouchableOpacity>
            <TouchableOpacity className="p-2">
              <AntDesign name="heart" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Apple Books Style Layout */}
        <View className="px-6">
          {/* Course Image - Apple Books style */}
          <View className="items-center mb-6">
            <View className="w-48 h-60 rounded-2xl overflow-hidden shadow-2xl" style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.25,
              shadowRadius: 12,
              elevation: 10,
            }}>
              {course.imageUrl ? (
                <Image
                  source={{ uri: course.imageUrl }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 items-center justify-center">
                  <Ionicons name="play" size={48} color="white" />
                </View>
              )}
            </View>
          </View>

          {/* Course Title - Apple Books style */}
          <View className="items-center mb-6">
            <Text className="text-2xl font-bold text-black text-center leading-tight mb-2">
              {course.title}
            </Text>
            <Text className="text-base text-gray-600 text-center">
              {course.instructor}
            </Text>
          </View>

          {/* Course Stats - Apple Books style */}
          <View className="flex-row items-center justify-center mb-6">
            <View className="flex-row items-center mr-6">
              <AntDesign name="star" size={16} color="#F59E0B" />
              <Text className="text-base font-semibold text-black ml-2">
                {course.rating || 4.8}
              </Text>
            </View>
            <View className="flex-row items-center mr-6">
              <Ionicons name="people" size={16} color="#6B7280" />
              <Text className="text-base font-semibold text-black ml-2">
                {course.totalStudents || 0}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="time" size={16} color="#6B7280" />
              <Text className="text-base font-semibold text-black ml-2">
                {course.duration}
              </Text>
            </View>
          </View>

          {/* Description - Apple Books style */}
          <View className="mb-6">
            <Text className="text-base text-gray-700 leading-6 text-center">
              {course.description}
            </Text>
          </View>

          {/* What You'll Learn - Apple Books style */}
          <View className="mb-6">
            <Text className="text-xl font-bold text-black mb-4 text-center">What you'll learn</Text>
            <View className="space-y-3">
              {[
                'Master the fundamentals of the subject',
                'Build real-world projects and applications',
                'Get lifetime access to course materials',
                'Receive certificate of completion',
                'Access to community and support'
              ].map((item, index) => (
                <View key={index} className="flex-row items-start">
                  <View className="w-2 h-2 bg-blue-600 rounded-full mr-3 mt-2" />
                  <Text className="text-base text-gray-700 flex-1 leading-6">{item}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Course Content - Apple Books style */}
          <View className="mb-6">
            <Text className="text-xl font-bold text-black mb-4 text-center">Course Content</Text>
            <View className="space-y-2">
              <View className="flex-row items-center justify-between p-3 bg-gray-50 rounded-xl">
                <View className="flex-row items-center">
                  <Ionicons name="play-circle" size={20} color="#007AFF" />
                  <Text className="text-base text-black ml-3">Introduction to the Course</Text>
                </View>
                <Text className="text-gray-600 text-base">15 min</Text>
              </View>
              <View className="flex-row items-center justify-between p-3 bg-gray-50 rounded-xl">
                <View className="flex-row items-center">
                  <Ionicons name="play-circle" size={20} color="#007AFF" />
                  <Text className="text-base text-black ml-3">Core Concepts</Text>
                </View>
                <Text className="text-gray-600 text-base">45 min</Text>
              </View>
              <View className="flex-row items-center justify-between p-3 bg-gray-50 rounded-xl">
                <View className="flex-row items-center">
                  <Ionicons name="play-circle" size={20} color="#007AFF" />
                  <Text className="text-base text-black ml-3">Practical Applications</Text>
                </View>
                <Text className="text-gray-600 text-base">60 min</Text>
              </View>
              <View className="flex-row items-center justify-between p-3 bg-gray-50 rounded-xl">
                <View className="flex-row items-center">
                  <Ionicons name="play-circle" size={20} color="#007AFF" />
                  <Text className="text-base text-black ml-3">Final Project</Text>
                </View>
                <Text className="text-gray-600 text-base">30 min</Text>
              </View>
            </View>
          </View>

          {/* Bottom spacing for floating button */}
          <View className="h-24" />
        </View>
      </ScrollView>

      {/* Floating Enroll Button - Apple Books style */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold text-black">
              {course.price === 0 ? 'Free' : `৳${course.price}`}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleEnroll}
            className="bg-blue-600 px-6 py-3 rounded-2xl flex-row items-center"
            style={{
              shadowColor: '#007AFF',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <MaterialIcons name="shopping-cart" size={20} color="white" />
            <Text className="text-white font-bold text-lg ml-2">
              {course.price === 0 ? 'Enroll Free' : 'Enroll Now'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
