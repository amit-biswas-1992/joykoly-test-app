import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface StoreHeaderProps {
  onSearchPress: () => void;
  onFilterPress: () => void;
}

export const StoreHeader: React.FC<StoreHeaderProps> = ({ onSearchPress, onFilterPress }) => {
  return (
    <View className="px-6 py-8 bg-white">
      <View className="flex-row items-center justify-between mb-6">
        <View>
          <Text className="text-4xl font-bold text-black">Store</Text>
          <Text className="text-gray-600 mt-2 text-lg">
            Discover amazing courses and books
          </Text>
        </View>
        <View className="flex-row items-center space-x-3">
          <TouchableOpacity 
            className="bg-gray-100 p-3 rounded-full"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
            onPress={onSearchPress}
          >
            <Ionicons name="search" size={22} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity 
            className="bg-gray-100 p-3 rounded-full"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
            onPress={onFilterPress}
          >
            <Ionicons name="filter" size={22} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
