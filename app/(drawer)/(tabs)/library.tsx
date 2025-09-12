import React from 'react';
import { View, Text } from 'react-native';

export default function Library() {
  return (
    <View className="flex-1 items-center justify-center bg-gray-50">
      <Text className="mb-2 text-2xl font-bold text-gray-900">Library</Text>
      <Text className="px-4 text-center text-gray-600">
        Access your purchased books, notes, and study materials
      </Text>
    </View>
  );
}
