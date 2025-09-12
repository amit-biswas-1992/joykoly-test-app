import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { cn } from '~/lib/cn';

interface SubjectBadgeProps {
  subject: string;
  variant?: 'default' | 'secondary' | 'outline';
  onRemove?: () => void;
  editable?: boolean;
}

export function SubjectBadge({ 
  subject, 
  variant = 'default', 
  onRemove, 
  editable = false 
}: SubjectBadgeProps) {
  const variantStyles = {
    default: 'bg-primary',
    secondary: 'bg-gray-100 dark:bg-gray-700',
    outline: 'border border-gray-300 dark:border-gray-600 bg-transparent',
  };

  const textStyles = {
    default: 'text-white',
    secondary: 'text-gray-700 dark:text-gray-300',
    outline: 'text-gray-700 dark:text-gray-300',
  };

  return (
    <View className={cn(
      'flex-row items-center px-3 py-1.5 rounded-full',
      variantStyles[variant]
    )}>
      <Text className={cn(
        'text-sm font-medium',
        textStyles[variant]
      )}>
        {subject}
      </Text>
      
      {editable && onRemove && (
        <Pressable
          onPress={onRemove}
          className="ml-2 p-0.5"
        >
          <Text className={`text-xs ${variant === 'default' ? 'text-white' : 'text-gray-500'}`}>
            ✕
          </Text>
        </Pressable>
      )}
    </View>
  );
}
