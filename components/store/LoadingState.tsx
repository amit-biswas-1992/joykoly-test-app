import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

export const LoadingState: React.FC = () => {
  return (
    <View className="flex-1 items-center justify-center bg-gray-50">
      <ActivityIndicator size="large" color="#3B82F6" />
      <Text className="text-gray-600 mt-4">Loading store data...</Text>
    </View>
  );
};
