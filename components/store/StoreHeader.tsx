import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface StoreHeaderProps {
  onSearchPress: () => void;
  onFilterPress: () => void;
}

export const StoreHeader: React.FC<StoreHeaderProps> = ({ onSearchPress, onFilterPress }) => {
  return (
    <View className="flex items-center bg-slate-50 p-4 pb-2 justify-end">
      <View className="flex w-12 items-center justify-end">
        <TouchableOpacity
          className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 bg-transparent text-[#0d141b] gap-2 text-base font-bold leading-normal tracking-[0.015em] min-w-0 p-0"
          onPress={onSearchPress}
        >
          <View className="text-[#0d141b]">
            <Ionicons name="search" size={24} color="#0d141b" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};
