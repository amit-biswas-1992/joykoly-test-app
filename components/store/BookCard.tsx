import React from 'react';
import { View, Text, TouchableOpacity, Image, Platform } from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
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
    // Featured book card with Apple Books horizontal style
    return (
      <View className="mr-4 w-72">
        <TouchableOpacity
          onPress={() => onPress(book)}
          className="bg-white rounded-2xl overflow-hidden"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.12,
            shadowRadius: 16,
            elevation: 8,
          }}
        >
          <View className="flex-row">
            {/* Book Cover */}
            <View className="w-28 h-36">
              {book.coverImageUrl ? (
                <Image
                  source={{ uri: book.coverImageUrl }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-full h-full bg-gradient-to-br from-green-500 to-blue-600 items-center justify-center">
                  <Ionicons name="book" size={32} color="white" />
                </View>
              )}
            </View>
            
            {/* Book Info */}
            <View className="flex-1 p-4">
              <View className="flex-row items-center justify-between mb-2">
                <View className="bg-orange-500 px-2 py-1 rounded-full">
                  <Text className="text-white text-xs font-semibold">Featured</Text>
                </View>
                <TouchableOpacity className="p-1">
                  <AntDesign name="heart" size={14} color="#6B7280" />
                </TouchableOpacity>
              </View>
              
              <Text className="text-base font-bold text-gray-900 mb-1" numberOfLines={2}>
                {book.title}
              </Text>
              <Text className="text-sm text-gray-600 mb-2" numberOfLines={1}>
                {book.author}
              </Text>
              
              <View className="flex-row items-center mb-2">
                <AntDesign name="star" size={12} color="#F59E0B" />
                <Text className="text-xs font-medium text-gray-700 ml-1">
                  {book.rating || 4.8}
                </Text>
                <Text className="text-xs text-gray-500 ml-1">({book.totalReviews || 0})</Text>
              </View>
              
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  {book.price > book.discountPrice ? (
                    <>
                      <Text className="text-xs text-gray-400 line-through mr-1">
                        ৳{book.price}
                      </Text>
                      <Text className="text-sm font-bold text-green-600">
                        {book.discountPrice === 0 ? 'Free' : `৳${book.discountPrice}`}
                      </Text>
                    </>
                  ) : (
                    <Text className="text-sm font-bold text-gray-900">
                      {book.discountPrice === 0 ? 'Free' : `৳${book.discountPrice}`}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  // Regular book card with Apple Books grid style
  return (
    <View className="mb-4">
      <TouchableOpacity
        onPress={() => onPress(book)}
        className="bg-white rounded-xl overflow-hidden"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 4,
        }}
      >
        {/* Book Cover - 3:4 aspect ratio */}
        <View className="relative" style={{ aspectRatio: 3/4 }}>
          {book.coverImageUrl ? (
            <Image
              source={{ uri: book.coverImageUrl }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full bg-gradient-to-br from-green-500 to-blue-600 items-center justify-center">
              <Ionicons name="book" size={32} color="white" />
            </View>
          )}
          
          {/* Heart icon */}
          <View className="absolute top-3 right-3">
            <TouchableOpacity className="bg-white/90 p-1.5 rounded-full">
              <AntDesign name="heart" size={14} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Book Content */}
        <View className="p-3">
          <Text className="text-sm font-semibold text-gray-900 mb-1" numberOfLines={2}>
            {book.title}
          </Text>
          
          <Text className="text-xs text-gray-600 mb-2" numberOfLines={1}>
            {book.author}
          </Text>
          
          {/* Rating and pages */}
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center">
              <AntDesign name="star" size={12} color="#F59E0B" />
              <Text className="text-xs font-medium text-gray-700 ml-1">
                {book.rating || 4.8}
              </Text>
              <Text className="text-xs text-gray-500 ml-1">({book.totalReviews || 0})</Text>
            </View>
            <Text className="text-xs text-gray-500">{book.pages} pages</Text>
          </View>
          
          {/* Price */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              {book.price > book.discountPrice ? (
                <>
                  <Text className="text-xs text-gray-400 line-through mr-1">
                    ৳{book.price}
                  </Text>
                  <Text className="text-base font-bold text-green-600">
                    {book.discountPrice === 0 ? 'Free' : `৳${book.discountPrice}`}
                  </Text>
                </>
              ) : (
                <Text className="text-base font-bold text-gray-900">
                  {book.discountPrice === 0 ? 'Free' : `৳${book.discountPrice}`}
                </Text>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};
