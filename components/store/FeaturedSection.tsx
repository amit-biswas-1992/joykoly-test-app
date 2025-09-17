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
    <View className="py-8">
      <View className="px-6 mb-6">
        <View className="flex-row items-center justify-between">
          <Text className="text-3xl font-bold text-black">
            {title}
          </Text>
          {onSeeAllPress && (
            <TouchableOpacity className="flex-row items-center" onPress={onSeeAllPress}>
              <Text className="text-blue-600 font-semibold mr-2 text-lg">See All</Text>
              <Ionicons name="chevron-forward" size={18} color="#2563EB" />
            </TouchableOpacity>
          )}
        </View>
        <Text className="text-gray-600 text-lg mt-1">
          {count} {count === 1 ? 'item' : 'items'}
        </Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-6"
        contentContainerStyle={{ paddingRight: 24 }}
      >
        {children}
      </ScrollView>
    </View>
  );
};
