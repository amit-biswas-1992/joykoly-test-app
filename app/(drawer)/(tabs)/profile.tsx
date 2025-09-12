import React from 'react';
import { View, Text } from 'react-native';

export default function Profile() {
  return (
    <View className="flex-1 items-center justify-center bg-gray-50">
      <Text className="mb-2 text-2xl font-bold text-gray-900">Profile</Text>
      <Text className="px-4 text-center text-gray-600">
        Manage your account settings, progress, and preferences
      </Text>
    </View>
  );
}
