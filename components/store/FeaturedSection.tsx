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
    <View>
      <Text className="text-[#0d141b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        {title}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex overflow-y-auto"
        contentContainerStyle={{ 
          paddingHorizontal: 16,
          paddingVertical: 16,
          gap: 12
        }}
      >
        {children}
      </ScrollView>
    </View>
  );
};
