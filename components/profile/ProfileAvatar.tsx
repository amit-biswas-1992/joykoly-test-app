import React from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { Avatar, AvatarFallback, AvatarImage } from '../nativewindui/Avatar';
import { cn } from '~/lib/cn';

interface ProfileAvatarProps {
  avatar?: string;
  firstName?: string;
  lastName?: string;
  onAvatarChange?: (uri: string) => void;
  size?: 'sm' | 'md' | 'lg';
  editable?: boolean;
}

export function ProfileAvatar({
  avatar,
  firstName,
  lastName,
  onAvatarChange,
  size = 'lg',
  editable = true,
}: ProfileAvatarProps) {
  const sizeClasses = {
    sm: 'h-16 w-16',
    md: 'h-20 w-20',
    lg: 'h-24 w-24',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  const handleImagePicker = async () => {
    if (!editable) return;

    Alert.alert(
      'প্রোফাইল ছবি',
      'আপনি কি করতে চান?',
      [
        {
          text: 'বাতিল',
          style: 'cancel',
        },
        {
          text: 'গ্যালারি',
          onPress: () => pickImage(),
        },
        ...(avatar ? [{ text: 'ছবি সরান', onPress: removeImage, style: 'destructive' as const }] : []),
      ]
    );
  };

  const pickImage = async () => {
    try {
      // Simple implementation for now - in real app you'd use expo-image-picker
      Alert.alert('Info', 'Image picker functionality would be implemented here');
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('ত্রুটি', 'ছবি নির্বাচন করতে সমস্যা হয়েছে');
    }
  };

  const removeImage = () => {
    Alert.alert(
      'ছবি সরান',
      'আপনি কি নিশ্চিত যে আপনি এই ছবিটি সরাতে চান?',
      [
        { text: 'বাতিল', style: 'cancel' },
        { text: 'সরান', onPress: () => onAvatarChange?.(''), style: 'destructive' },
      ]
    );
  };

  return (
    <View className="items-center">
      <Pressable
        onPress={handleImagePicker}
        disabled={!editable}
        className={cn(
          'relative',
          editable && 'active:opacity-70'
        )}
      >
        <Avatar className={cn(sizeClasses[size], editable && 'ring-2 ring-primary/20')} alt={`${firstName} ${lastName}`}>
          <AvatarImage 
            source={avatar ? { uri: avatar } : undefined}
            className="object-cover"
          />
          <AvatarFallback className={cn(
            'bg-primary/10',
            size === 'sm' && 'text-lg',
            size === 'md' && 'text-xl',
            size === 'lg' && 'text-2xl'
          )}>
            <Text className="font-semibold text-primary">
              {(firstName?.[0] || 'U').toUpperCase()}
              {(lastName?.[0] || '').toUpperCase()}
            </Text>
          </AvatarFallback>
        </Avatar>

        {editable && (
          <View className={cn(
            'absolute bottom-0 right-0 bg-primary rounded-full p-2 shadow-lg',
            size === 'sm' && 'p-1.5',
            size === 'md' && 'p-2',
            size === 'lg' && 'p-2.5'
          )}>
            <Text className="text-white text-xs">📷</Text>
          </View>
        )}
      </Pressable>

      {editable && (
        <Text className="text-xs text-muted-foreground mt-2 text-center">
          {avatar ? 'ছবি পরিবর্তন করুন' : 'ছবি যোগ করুন'}
        </Text>
      )}
    </View>
  );
}
