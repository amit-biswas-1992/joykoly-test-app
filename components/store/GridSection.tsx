import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface GridSectionProps {
  title: string;
  children: React.ReactNode;
  onFilterPress?: () => void;
  showFilter?: boolean;
}

export const GridSection: React.FC<GridSectionProps> = ({ 
  title, 
  children, 
  onFilterPress,
  showFilter = true 
}) => {
  return (
    <View className="px-6 pb-8">
      <View className="flex-row items-center justify-between mb-6">
        <Text className="text-3xl font-bold text-black">
          {title}
        </Text>
        {showFilter && onFilterPress && (
          <TouchableOpacity className="flex-row items-center" onPress={onFilterPress}>
            <Text className="text-blue-600 font-semibold mr-2 text-lg">Filter</Text>
            <Ionicons name="filter" size={18} color="#2563EB" />
          </TouchableOpacity>
        )}
      </View>
      
      <View className="flex-row flex-wrap justify-between">
        {children}
      </View>
    </View>
  );
};
