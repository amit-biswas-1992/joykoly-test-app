import React from 'react';
import { TouchableOpacity, Text, View, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TabButtonProps {
  tab: string;
  label: string;
  count: number;
  icon: string;
  isActive: boolean;
  onPress: (tab: 'all' | 'courses' | 'books') => void;
}

export const TabButton: React.FC<TabButtonProps> = ({ 
  tab, 
  label, 
  count, 
  icon, 
  isActive,
  onPress 
}) => (
  <TouchableOpacity
    onPress={() => onPress(tab as 'all' | 'courses' | 'books')}
    className={`flex-row items-center px-6 py-4 mr-4 ${
      isActive 
        ? 'bg-blue-600' 
        : 'bg-gray-100'
    }`}
    style={{
      borderRadius: 20,
      shadowColor: isActive ? '#2563EB' : '#000',
      shadowOffset: { width: 0, height: isActive ? 4 : 2 },
      shadowOpacity: isActive ? 0.3 : 0.1,
      shadowRadius: isActive ? 12 : 4,
      elevation: isActive ? 6 : 2,
    }}
  >
    <View className={`p-1.5 rounded-full ${
      isActive ? 'bg-white/20' : 'bg-transparent'
    }`}>
      <Ionicons 
        name={icon as any} 
        size={18} 
        color={isActive ? 'white' : '#6B7280'} 
      />
    </View>
    <Text className={`ml-3 font-semibold text-base ${
      isActive ? 'text-white' : 'text-gray-700'
    }`}>
      {label}
    </Text>
    <View className={`ml-3 px-3 py-1.5 rounded-full ${
      isActive ? 'bg-white/20' : 'bg-gray-300'
    }`}>
      <Text className={`text-sm font-bold ${
        isActive ? 'text-white' : 'text-gray-600'
      }`}>
        {count}
      </Text>
    </View>
  </TouchableOpacity>
);
