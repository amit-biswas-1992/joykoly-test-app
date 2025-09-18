import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Book } from '@/services/book.service';


interface BookCardProps {
  book: Book;
  isFeatured?: boolean;
  onPress: (book: Book) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ 
  book, 
  isFeatured = false, 
  onPress 
}) => {
  if (isFeatured) {
    // Featured book card - horizontal scroll style
    
    return (
      <View className="flex-1 flex-col gap-4 rounded-lg min-w-40 p-3 bg-white shadow-md border border-gray-200">
        <TouchableOpacity
          onPress={() => onPress(book)}
          className="w-full aspect-[3/4] rounded-lg shadow-md p-3 bg-gray-200"
        >
          {book.coverImageUrl ? (
            <View className="w-full h-full rounded-lg overflow-hidden">
              <Image
                source={{ uri: book.coverImageUrl }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
          ) : (
            <View className="w-full h-full items-center justify-center rounded-lg">
              <Ionicons name="book" size={32} color="white" />
            </View>
          )}
        </TouchableOpacity>
        <View className="px-1">
          <Text className="text-[#0d141b] text-base font-medium leading-normal" numberOfLines={2}>
            {book.title}
          </Text>
         
        </View>
      </View>
    );
  }

  // Regular book card - grid style with 3:4 aspect ratio
  
  return (
    <View className="flex-1 flex-col gap-4 rounded-lg min-w-40 p-3 bg-white shadow-md border border-gray-200">
      <TouchableOpacity
        onPress={() => onPress(book)}
        className="w-full aspect-[3/4] rounded-lg shadow-md p-3 bg-gray-200"
      >
        {book.coverImageUrl ? (
          <View className="w-full h-full rounded-lg overflow-hidden">
            <Image
              source={{ uri: book.coverImageUrl }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
        ) : (
          <View className="w-full h-full items-center justify-center rounded-lg">
            <Ionicons name="book" size={32} color="white" />
          </View>
        )}
      </TouchableOpacity>
      <View className="px-1">
        <Text className="text-[#0d141b] text-base font-medium leading-normal" numberOfLines={2}>
          {book.title}
        </Text>
        
      </View>
    </View>
  );
};
