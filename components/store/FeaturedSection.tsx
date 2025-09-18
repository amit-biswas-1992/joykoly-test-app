import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FeaturedSectionProps {
  title: string;
  count: number;
  children: React.ReactNode;
  onSeeAllPress?: () => void;
}

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({ 
  title, 
  count, 
  children, 
  onSeeAllPress 
}) => {
  return (
    <View className="mb-4">
      {/* Section Header */}
      <View className="flex-row items-center justify-between px-3 mb-3">
        <View>
          <Text className="text-base font-bold text-gray-900 mb-0.5">{title}</Text>
          <Text className="text-xs text-gray-500">{count} courses</Text>
        </View>
        {onSeeAllPress && (
          <TouchableOpacity 
            className="flex-row items-center bg-blue-50 px-2 py-1.5 rounded-lg"
            onPress={onSeeAllPress}
          >
            <Text className="text-blue-600 font-medium mr-1 text-xs">See All</Text>
            <Ionicons name="arrow-forward" size={12} color="#2563EB" />
          </TouchableOpacity>
        )}
      </View>
      
      {/* Horizontal Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ 
          paddingHorizontal: 12,
          gap: 12
        }}
      >
        {children}
      </ScrollView>
    </View>
  );
};
