import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

export const LoadingState: React.FC = () => {
  return (
    <View className="flex-1 items-center justify-center bg-gray-50">
      <View className="items-center">
        <ActivityIndicator size="large" color="#2563EB" />
        <Text className="text-gray-700 mt-3 text-base font-semibold">Loading Courses</Text>
        <Text className="text-gray-500 mt-1 text-center text-sm">Discovering amazing courses for you...</Text>
      </View>
    </View>
  );
};
