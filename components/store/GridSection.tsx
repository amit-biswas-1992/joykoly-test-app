import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface GridSectionProps {
  title: string;
  children: React.ReactNode;
  onFilterPress?: () => void;
  showFilter?: boolean;
  count?: number;
}

export const GridSection: React.FC<GridSectionProps> = ({ 
  title, 
  children, 
  onFilterPress,
  showFilter = true,
  count
}) => {
  return (
    <View className="px-3 pb-6">
      {/* Section Header */}
      <View className="flex-row items-center justify-between mb-4">
        <View>
          <Text className="text-base font-bold text-gray-900 mb-0.5">{title}</Text>
          {count !== undefined && (
            <Text className="text-xs text-gray-500">{count} courses</Text>
          )}
        </View>
        {showFilter && onFilterPress && (
          <TouchableOpacity 
            className="flex-row items-center bg-gray-100 px-2 py-1.5 rounded-lg"
            onPress={onFilterPress}
          >
            <Ionicons name="filter" size={12} color="#6B7280" />
            <Text className="text-gray-700 font-medium ml-1.5 text-xs">Filter</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {/* Grid Layout */}
      <View className="flex-row flex-wrap justify-between">
        {children}
      </View>
    </View>
  );
};
