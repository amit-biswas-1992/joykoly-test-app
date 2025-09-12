import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { ProfileData } from '~/types/profile';
import { cn } from '~/lib/cn';

interface ProfileCardProps {
  profile: ProfileData;
  onEdit?: () => void;
}

export function ProfileCard({ profile, onEdit }: ProfileCardProps) {
  const completionPercentage = Math.round(
    ([profile.firstName, profile.lastName, profile.bio, profile.headline, profile.location, profile.currentClass, profile.institution, profile.targetExam]
      .filter(field => field && field.trim().length > 0).length / 8) * 100
  );

  return (
    <View className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Profile Header */}
      <View className="items-center mb-6">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {profile.firstName} {profile.lastName}
        </Text>
        
        {profile.headline && (
          <Text className="text-gray-600 dark:text-gray-300 text-sm mb-2">
            {profile.headline}
          </Text>
        )}
        
        {profile.location && (
          <View className="flex-row items-center gap-1 mb-4">
            <Text className="text-sm text-gray-500 dark:text-gray-400">📍</Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400">
              {profile.location}
            </Text>
          </View>
        )}
      </View>

      {/* Academic Info */}
      <View className="mb-6">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="font-semibold text-gray-900 dark:text-white">একাডেমিক তথ্য</Text>
          {onEdit && (
            <Text className="text-primary text-sm">এডিট</Text>
          )}
        </View>
        
        <View className="space-y-2">
          {profile.currentClass && (
            <View className="flex-row items-center gap-2">
              <Text className="text-sm text-gray-700 dark:text-gray-300">🎓</Text>
              <Text className="text-sm text-gray-700 dark:text-gray-300">
                {profile.currentClass}
              </Text>
            </View>
          )}
          
          {profile.institution && (
            <Text className="text-sm text-gray-500 dark:text-gray-400 ml-6">
              {profile.institution}
            </Text>
          )}
          
          {profile.targetExam && (
            <View className="flex-row items-center gap-2">
              <Text className="text-sm text-primary font-medium">🎯</Text>
              <Text className="text-sm text-primary font-medium">
                {profile.targetExam}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Academic Stats */}
      <View className="mb-6">
        <Text className="font-semibold text-gray-900 dark:text-white mb-3 flex-row items-center gap-2">
          <Text className="text-base">🏆</Text>
          <Text>একাডেমিক পরিসংখ্যান</Text>
        </Text>
        
        <View className="flex-row gap-4">
          <View className="flex-1 bg-gray-50 dark:bg-gray-700 rounded-lg p-3 items-center">
            <Text className="text-xl font-bold text-primary">
              {profile.stats.coursesCompleted}
            </Text>
            <Text className="text-xs text-gray-500 dark:text-gray-400">
              সম্পন্ন কোর্স
            </Text>
          </View>
          
          <View className="flex-1 bg-gray-50 dark:bg-gray-700 rounded-lg p-3 items-center">
            <Text className="text-xl font-bold text-primary">
              {profile.batch || 'HSC27'}
            </Text>
            <Text className="text-xs text-gray-500 dark:text-gray-400">
              ব্যাচ
            </Text>
          </View>
        </View>
      </View>

      {/* Profile Completion */}
      <View className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
            প্রোফাইল সম্পূর্ণতা
          </Text>
          <Text className="text-sm font-medium text-primary">
            {completionPercentage}%
          </Text>
        </View>
        
        <View className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
          <View 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          />
        </View>
      </View>

      {/* Quick Stats */}
      <View className="flex-row justify-around">
        <View className="items-center">
          <Text className="text-lg">📚</Text>
          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">
            {profile.favoriteSubjects.length}
          </Text>
          <Text className="text-xs text-gray-500 dark:text-gray-400">
            পছন্দের বিষয়
          </Text>
        </View>
        
        <View className="items-center">
          <Text className="text-lg">⭐</Text>
          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">
            {profile.achievements.length}
          </Text>
          <Text className="text-xs text-gray-500 dark:text-gray-400">
            অর্জন
          </Text>
        </View>
        
        <View className="items-center">
          <Text className="text-lg">🎯</Text>
          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">
            {profile.studyGoals.length}
          </Text>
          <Text className="text-xs text-gray-500 dark:text-gray-400">
            লক্ষ্য
          </Text>
        </View>
      </View>
    </View>
  );
}
