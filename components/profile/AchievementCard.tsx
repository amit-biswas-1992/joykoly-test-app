import React from 'react';
import { View, Text } from 'react-native';
import { Achievement } from '~/types/profile';
import { cn } from '~/lib/cn';

interface AchievementCardProps {
  achievement: Achievement;
  onRemove?: () => void;
  editable?: boolean;
}

export function AchievementCard({ achievement, onRemove, editable = false }: AchievementCardProps) {
  const categoryColors = {
    academic: '#3B82F6',
    professional: '#10B981',
    personal: '#F59E0B',
  };

  const categoryLabels = {
    academic: 'একাডেমিক',
    professional: 'পেশাগত',
    personal: 'ব্যক্তিগত',
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('bn-BD', {
      year: 'numeric',
      month: 'short',
    }).format(new Date(date));
  };

  return (
    <View className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-3">
      <View className="flex-row items-start gap-3">
        <View className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
          <Text className="text-lg">🏆</Text>
        </View>
        
        <View className="flex-1">
          <Text className="font-semibold text-gray-900 dark:text-white text-base mb-1">
            {achievement.title}
          </Text>
          
          {achievement.description && (
            <Text className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              {achievement.description}
            </Text>
          )}
          
          <View className="flex-row items-center gap-4">
            <View className="flex-row items-center gap-1">
              <View 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: categoryColors[achievement.category] }}
              />
              <Text className="text-xs text-gray-500 dark:text-gray-400">
                {categoryLabels[achievement.category]}
              </Text>
            </View>
            
            <View className="flex-row items-center gap-1">
              <Text className="text-xs text-gray-500 dark:text-gray-400">📅</Text>
              <Text className="text-xs text-gray-500 dark:text-gray-400">
                {formatDate(achievement.date)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
