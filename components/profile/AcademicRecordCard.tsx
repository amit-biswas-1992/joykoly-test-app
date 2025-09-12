import React from 'react';
import { View, Text } from 'react-native';
import { AcademicRecord } from '~/types/profile';
import { cn } from '~/lib/cn';

interface AcademicRecordCardProps {
  record: AcademicRecord;
  onRemove?: () => void;
  editable?: boolean;
}

export function AcademicRecordCard({ record, onRemove, editable = false }: AcademicRecordCardProps) {
  return (
    <View className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-3">
      <View className="flex-row gap-3">
        <View className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg items-center justify-center">
          <Text className="text-xl">🎓</Text>
        </View>
        
        <View className="flex-1">
          <View className="flex-row items-center gap-2 mb-1">
            <Text className="font-semibold text-gray-900 dark:text-white text-base">
              {record.exam}
            </Text>
            <View className="bg-primary/10 px-2 py-1 rounded">
              <Text className="text-xs font-medium text-primary">
                GPA {record.gpa}
              </Text>
            </View>
          </View>
          
          <Text className="text-sm text-gray-700 dark:text-gray-300 mb-1">
            {record.institution}
          </Text>
          
          <Text className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            {record.board}
          </Text>
          
          {record.group && (
            <Text className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              বিভাগ: {record.group}
            </Text>
          )}
          
          <View className="flex-row items-center gap-1">
            <Text className="text-xs text-gray-500 dark:text-gray-400">📅</Text>
            <Text className="text-xs text-gray-500 dark:text-gray-400">
              {record.year}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
