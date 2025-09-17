import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Book } from '@/services/book.service';

// Generate a consistent color based on book ID
const getBookBackgroundColor = (bookId: string) => {
  const colors = [
    '#3B82F6', // Blue
    '#8B5CF6', // Purple
    '#10B981', // Green
    '#F59E0B', // Orange
    '#EC4899', // Pink
    '#6366F1', // Indigo
    '#EF4444', // Red
    '#14B8A6', // Teal
    '#EAB308', // Yellow
    '#06B6D4', // Cyan
  ];
  
  // Use book ID to consistently pick a color
  const hash = bookId.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  return colors[Math.abs(hash) % colors.length];
};

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
    const bookBgColor = getBookBackgroundColor(book.id);
    
    return (
      <View className="flex-1 flex-col gap-4 rounded-lg min-w-40 p-3 bg-white shadow-md border border-gray-200">
        <TouchableOpacity
          onPress={() => onPress(book)}
          className="w-full aspect-[3/4] rounded-lg shadow-md p-3"
          style={{ backgroundColor: bookBgColor }}
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
  const bookBgColor = getBookBackgroundColor(book.id);
  
  return (
    <View className="flex-1 flex-col gap-4 rounded-lg min-w-40 p-3 bg-white shadow-md border border-gray-200">
      <TouchableOpacity
        onPress={() => onPress(book)}
        className="w-full aspect-[3/4] rounded-lg shadow-md p-3"
        style={{ backgroundColor: bookBgColor }}
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
