import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TabButtonProps {
  tab: string;
  label: string;
  count: number;
  icon: string;
  isActive: boolean;
  onPress: (tab: string) => void;
}

export const TabButton: React.FC<TabButtonProps> = ({ 
  tab, 
  label, 
  count, 
  icon, 
  isActive, 
  onPress 
}) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(tab)}
      className={`flex-row items-center px-4 py-3 mr-3 ${
        isActive 
          ? 'bg-blue-500' 
          : Platform.OS === 'ios' ? 'bg-gray-100' : 'bg-gray-200'
      }`}
      style={{
        borderRadius: Platform.OS === 'ios' ? 20 : 16,
        shadowColor: isActive ? '#007AFF' : Platform.OS === 'ios' ? '#000' : 'transparent',
        shadowOffset: { width: 0, height: isActive ? 2 : 1 },
        shadowOpacity: isActive ? 0.25 : Platform.OS === 'ios' ? 0.1 : 0,
        shadowRadius: isActive ? 8 : Platform.OS === 'ios' ? 2 : 0,
        elevation: isActive ? 4 : Platform.OS === 'ios' ? 0 : 1,
      }}
    >
      <View className={`p-1 rounded-full ${
        isActive ? 'bg-white/20' : 'bg-transparent'
      }`}>
        <Ionicons 
          name={icon as any} 
          size={16} 
          color={isActive ? 'white' : '#6B7280'} 
        />
      </View>
      <Text className={`ml-2 font-semibold ${
        isActive ? 'text-white' : 'text-gray-700'
      }`}>
        {label}
      </Text>
      <View className={`ml-2 px-2 py-1 rounded-full ${
        isActive ? 'bg-white/20' : 'bg-gray-300'
      }`}>
        <Text className={`text-xs font-bold ${
          isActive ? 'text-white' : 'text-gray-600'
        }`}>
          {count}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

TabButton.displayName = 'TabButton';
