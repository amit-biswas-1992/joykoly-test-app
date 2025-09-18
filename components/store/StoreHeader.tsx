import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface StoreHeaderProps {
  onSearchPress: () => void;
  onFilterPress: () => void;
}

const { width } = Dimensions.get('window');

export const StoreHeader: React.FC<StoreHeaderProps> = ({ onSearchPress, onFilterPress }) => {
  return (
    <View className="bg-white px-3 py-2 border-b border-gray-100">
      {/* Title */}
      <View className="mb-3">
        <Text className="text-lg font-bold text-gray-900 mb-0.5">Courses</Text>
        <Text className="text-xs text-gray-500">Discover and enroll in courses</Text>
      </View>
      
      {/* Search Bar */}
      <TouchableOpacity
        className="flex-row items-center bg-gray-50 rounded-lg px-3 py-2.5 mb-2"
        onPress={onSearchPress}
      >
        <Ionicons name="search" size={16} color="#6B7280" />
        <Text className="ml-2 text-gray-500 flex-1 text-sm">Search courses...</Text>
        <Ionicons name="mic" size={16} color="#6B7280" />
      </TouchableOpacity>
      
      {/* Filter Button */}
      <TouchableOpacity
        className="flex-row items-center justify-center bg-blue-600 rounded-lg py-2"
        onPress={onFilterPress}
      >
        <Ionicons name="filter" size={14} color="white" />
        <Text className="text-white font-medium ml-1.5 text-sm">Filter & Sort</Text>
      </TouchableOpacity>
    </View>
  );
};
