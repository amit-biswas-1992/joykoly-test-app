import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { storeService, StoreCourse } from '@/services/store.service';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function CourseDetail() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [course, setCourse] = useState<StoreCourse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      loadCourse()
    }
  }, [id])

  const loadCourse = async () => {
    try {
      setLoading(true)
      const courseData = await storeService.getCourseById(id)
      setCourse(courseData)
    } catch (error) {
      console.error("Error loading course:", error)
      Alert.alert("Error", "Failed to load course details. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleEnroll = async () => {
    if (!course) return

    try {
      Alert.alert("Enroll in Course", `Would you like to enroll in "${course.title}"?`, [
        { text: "Cancel", style: "cancel" },
        {
          text: "Enroll",
          onPress: async () => {
            try {
              await storeService.purchaseCourse(course.id)
              Alert.alert("Success", "You have been enrolled in the course!")
              router.back()
            } catch (error: any) {
              if (error?.data?.statusCode === 409 || error?.message?.includes("already enrolled")) {
                Alert.alert(
                  "Already Enrolled",
                  "You are already enrolled in this course! You can access it from your enrolled courses.",
                  [
                    { text: "OK", style: "default" },
                    {
                      text: "View My Courses",
                      onPress: () => {
                        router.push("/(tabs)/" as any)
                      },
                    },
                  ],
                )
              } else {
                Alert.alert("Error", "Failed to enroll in course. Please try again.")
              }
            }
          },
        },
      ])
    } catch (error) {
      Alert.alert("Error", "Failed to enroll in course. Please try again.")
    }
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="text-gray-600 mt-4">Loading course details...</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (!course) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="book-outline" size={64} color="#9CA3AF" />
          <Text className="text-xl font-bold text-gray-900 mt-4 mb-2">Course Not Found</Text>
          <Text className="text-gray-600 text-center mb-6">The course you're looking for could not be found.</Text>
          <TouchableOpacity onPress={() => router.back()} className="bg-blue-600 px-6 py-3 rounded-xl">
            <Text className="text-white font-semibold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Sticky Header */}
      <View className="sticky top-0 bg-white/90 backdrop-blur-lg z-10 shadow-sm">
        <View className="flex-row items-center p-4">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 rounded-full">
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>
          <Text className="text-xl font-bold flex-1 text-center pr-10 text-gray-900">Course Details</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Hero Section */}
        <View className="relative h-64">
          <View className="absolute inset-0 w-full h-full">
            {course.imageUrl ? (
              <Image source={{ uri: course.imageUrl }} className="w-full h-full" resizeMode="cover" />
            ) : (
              <View className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600" />
            )}
          </View>
          <View className="absolute inset-0 bg-gradient-to-t from-gray-50 to-transparent" />
          <View className="absolute bottom-4 left-4 right-4 flex-row items-center justify-between">
            <TouchableOpacity className="bg-white/30 backdrop-blur-md rounded-full p-3 shadow-lg">
              <Ionicons name="play" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="p-5 -mt-8">
          {/* Course Title and Description */}
          <View className="bg-white p-6 rounded-xl shadow-lg mb-6">
            <Text className="text-3xl font-extrabold text-gray-900 mb-4">{course.title}</Text>
            <Text className="text-gray-600 leading-6">{course.description}</Text>
          </View>

          {/* Course Curriculum */}
          <View className="bg-white p-6 rounded-xl shadow-lg mb-6">
            <Text className="text-xl font-bold text-gray-900 mb-6">Course Curriculum</Text>
            <View>
              <View className="flex-row items-center gap-4 mb-4">
                <View className="w-8 h-8 rounded-full bg-emerald-100 items-center justify-center">
                  <Ionicons name="checkmark" size={16} color="#10B981" />
                </View>
                <Text className="text-gray-700">Introduction to {course.category}</Text>
              </View>
              <View className="flex-row items-center gap-4 mb-4">
                <View className="w-8 h-8 rounded-full bg-emerald-100 items-center justify-center">
                  <Ionicons name="checkmark" size={16} color="#10B981" />
                </View>
                <Text className="text-gray-700">Core Concepts and Fundamentals</Text>
              </View>
              <View className="flex-row items-center gap-4 mb-4">
                <View className="w-8 h-8 rounded-full bg-emerald-100 items-center justify-center">
                  <Ionicons name="checkmark" size={16} color="#10B981" />
                </View>
                <Text className="text-gray-700">Practice Tests and Mock Exams</Text>
              </View>
              <View className="flex-row items-center gap-4 mb-4">
                <View className="w-8 h-8 rounded-full bg-emerald-100 items-center justify-center">
                  <Ionicons name="checkmark" size={16} color="#10B981" />
                </View>
                <Text className="text-gray-700">Advanced Problem Solving</Text>
              </View>
              <View className="flex-row items-center gap-4">
                <View className="w-8 h-8 rounded-full bg-emerald-100 items-center justify-center">
                  <Ionicons name="checkmark" size={16} color="#10B981" />
                </View>
                <Text className="text-gray-700">Final Assessment and Certification</Text>
              </View>
            </View>
          </View>

          {/* Course Details */}
          <View className="bg-white p-6 rounded-xl shadow-lg mb-6">
            <Text className="text-xl font-bold text-gray-900 mb-4">Course Details</Text>
            <View>
              <View className="flex-row items-center justify-between p-3 bg-gray-100 rounded-lg mb-4">
                <View className="flex-row items-center gap-3">
                  <Ionicons name="time-outline" size={20} color="#3B82F6" />
                  <Text className="text-gray-600">Duration</Text>
                </View>
                <Text className="font-semibold text-gray-900">{course.duration}</Text>
              </View>
              <View className="flex-row items-center justify-between p-3 bg-gray-100 rounded-lg mb-4">
                <View className="flex-row items-center gap-3">
                  <Ionicons name="bar-chart-outline" size={20} color="#3B82F6" />
                  <Text className="text-gray-600">Skill Level</Text>
                </View>
                <Text className="font-semibold text-gray-900 capitalize">{course.level}</Text>
              </View>
              <View className="flex-row items-center justify-between p-3 bg-gray-100 rounded-lg mb-4">
                <View className="flex-row items-center gap-3">
                  <Ionicons name="school-outline" size={20} color="#3B82F6" />
                  <Text className="text-gray-600">Classes</Text>
                </View>
                <Text className="font-semibold text-gray-900">{course.numberOfClasses || 0} classes</Text>
              </View>
              {course.batchName && (
                <View className="flex-row items-center justify-between p-3 bg-gray-100 rounded-lg">
                  <View className="flex-row items-center gap-3">
                    <Ionicons name="people-outline" size={20} color="#3B82F6" />
                    <Text className="text-gray-600">Batch</Text>
                  </View>
                  <Text className="font-semibold text-gray-900">{course.batchName}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Reviews Section */}
          <View className="bg-white p-6 rounded-xl shadow-lg mb-6">
            <Text className="text-xl font-bold text-gray-900 mb-6">Reviews</Text>
            <View className="flex-row items-center gap-6 mb-6">
              <View className="items-center gap-2">
                <Text className="text-6xl font-extrabold text-amber-500">{course.rating || 4.8}</Text>
                <View className="flex-row">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons
                      key={star}
                      name={star <= Math.floor(course.rating || 4.8) ? "star" : "star-outline"}
                      size={20}
                      color="#F59E0B"
                    />
                  ))}
                </View>
                <Text className="text-sm text-gray-500">Based on {course.totalStudents || 0} reviews</Text>
              </View>
              <View className="flex-1">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <View key={rating} className="flex-row items-center gap-2 mb-2">
                    <Text className="text-sm text-gray-500 w-4">{rating}</Text>
                    <View className="flex-1 h-2 bg-gray-200 rounded-full">
                      <View className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.random() * 100}%` }} />
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Sample Reviews */}
            <View className="pt-6 border-t border-gray-200">
              <View className="mb-6">
                <View className="flex-row items-center gap-3 mb-3">
                  <View className="w-10 h-10 rounded-full bg-blue-500 items-center justify-center">
                    <Text className="text-white font-semibold">A</Text>
                  </View>
                  <View>
                    <Text className="font-semibold text-gray-900">Ahmed Rahman</Text>
                    <Text className="text-sm text-gray-500">2 months ago</Text>
                  </View>
                </View>
                <View className="flex-row mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons key={star} name="star" size={16} color="#F59E0B" />
                  ))}
                </View>
                <Text className="text-gray-600">
                  This course is fantastic! The content is comprehensive and the instructor is very knowledgeable.
                  Highly recommended for anyone preparing for admission tests.
                </Text>
              </View>

              <View>
                <View className="flex-row items-center gap-3 mb-3">
                  <View className="w-10 h-10 rounded-full bg-green-500 items-center justify-center">
                    <Text className="text-white font-semibold">S</Text>
                  </View>
                  <View>
                    <Text className="font-semibold text-gray-900">Sara Khan</Text>
                    <Text className="text-sm text-gray-500">3 months ago</Text>
                  </View>
                </View>
                <View className="flex-row mb-3">
                  {[1, 2, 3, 4].map((star) => (
                    <Ionicons key={star} name="star" size={16} color="#F59E0B" />
                  ))}
                  <Ionicons name="star-outline" size={16} color="#F59E0B" />
                </View>
                <Text className="text-gray-600">
                  Great course overall. The curriculum is well-structured and easy to follow. Some advanced topics could
                  be explained in more detail.
                </Text>
              </View>
            </View>
          </View>

          {/* Bottom spacing for sticky footer */}
          <View className="h-32" />
        </View>
      </ScrollView>

      {/* Sticky Footer */}
      <View className="sticky bottom-0 bg-white/90 backdrop-blur-lg pt-2 border-t border-gray-200">
        <View className="p-4 space-y-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-sm text-gray-500">Price</Text>
              <View className="flex-row items-center">
                {course.originalPrice && course.originalPrice > course.price && (
                  <Text className="text-lg text-gray-400 line-through mr-2">৳{course.originalPrice}</Text>
                )}
                <Text className="text-2xl font-bold text-gray-900">
                  {course.price === 0 ? "Free" : `৳${course.price}`}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={handleEnroll}
              className="bg-blue-500 px-8 py-3 rounded-full shadow-lg flex-row items-center gap-2"
            >
              <Text className="text-white font-bold text-lg">{course.price === 0 ? "Enroll Free" : "Enroll Now"}</Text>
              <Ionicons name="arrow-forward" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}