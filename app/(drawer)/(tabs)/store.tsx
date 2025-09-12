import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { storeService, StoreCourse } from '../../../services/store.service';
import { bookService, Book } from '../../../services/book.service';
import { router } from 'expo-router';
import { Ionicons, MaterialIcons, AntDesign } from '@expo/vector-icons';

export default function Store() {
  const [featuredCourses, setFeaturedCourses] = useState<StoreCourse[]>([]);
  const [allCourses, setAllCourses] = useState<StoreCourse[]>([]);
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'courses' | 'books'>('all');

  useEffect(() => {
    loadStoreData();
  }, []);


  const loadStoreData = async () => {
    try {
      setLoading(true);
      
      const [featuredCourses, allCourses, featuredBooks, allBooks] = await Promise.all([
        storeService.getFeaturedCourses(),
        storeService.getAllCourses(),
        bookService.getFeaturedBooks(),
        bookService.getAllBooks()
      ]);
      
      setFeaturedCourses(featuredCourses);
      setAllCourses(allCourses);
      setFeaturedBooks(featuredBooks);
      setAllBooks(allBooks);
    } catch (error) {
      console.error('Error loading store data:', error);
      Alert.alert('Error', 'Failed to load store data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCoursePress = (course: StoreCourse) => {
    router.push(`/(drawer)/(tabs)/course/${course.id}`);
  };

  const handleBookPress = (book: Book) => {
    const bookUrl = book.externalUrl || `https://joykolyacademy.com/books/${book.id}`;
    
    Alert.alert(
      book.title,
      `Author: ${book.author}\nCategory: ${book.category}\nPages: ${book.pages}\nFormat: ${book.format}\n\n${book.description || 'A comprehensive guide for students.'}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Visit Book', 
          onPress: () => {
            Linking.openURL(bookUrl).catch(err => {
              console.error('Failed to open URL:', err);
              Alert.alert('Error', 'Failed to open the book URL. Please try again.');
            });
          }
        }
      ]
    );
  };


  const CourseCard = ({ course, isFeatured = false }: { course: StoreCourse; isFeatured?: boolean }) => {
    if (isFeatured) {
      // Featured course card (simplified layout - only image, title, tags, and price)
      return (
        <View className="mr-4 w-64">
          <TouchableOpacity
            onPress={() => handleCoursePress(course)}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 12,
              elevation: 5,
            }}
          >
            <View className="relative">
              {course.imageUrl ? (
                <Image
                  source={{ uri: course.imageUrl }}
                  className="w-full h-48"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 items-center justify-center">
                  <Ionicons name="play" size={48} color="white" />
                </View>
              )}
              
              {/* Featured tag */}
              <View className="absolute top-3 left-3 bg-orange-500 px-2 py-1 rounded-full">
                <Text className="text-white text-xs font-semibold">Featured</Text>
              </View>
              
              {/* Favorite button */}
              <View className="absolute top-3 right-3">
                <TouchableOpacity className="bg-white/90 p-2 rounded-full">
                  <AntDesign name="heart" size={16} color="#6B7280" />
                </TouchableOpacity>
              </View>
              
              {/* Price in bottom right corner */}
              <View className="absolute bottom-3 right-3">
                <View className="bg-white/95 px-3 py-1.5 rounded-full shadow-sm">
                  <Text className="text-sm font-bold text-gray-900 text-center">
                    {course.price === 0 ? 'Free' : `৳${course.price}`}
                  </Text>
                </View>
              </View>
            </View>
            
            {/* Course title at bottom */}
            <View className="p-3">
              <Text className="text-base font-bold text-gray-900 text-center" numberOfLines={2}>
                {course.title || 'No Title'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    }

    // All courses card (Coursera-style vertical layout with 4:3 aspect ratio)
    return (
      <View className="mb-4">
        <TouchableOpacity
          onPress={() => handleCoursePress(course)}
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          {/* 4:3 Aspect Ratio Thumbnail */}
          <View className="relative" style={{ aspectRatio: 4/3 }}>
            {course.imageUrl ? (
              <Image
                source={{ uri: course.imageUrl }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 items-center justify-center">
                <Ionicons name="play" size={32} color="white" />
              </View>
            )}
            {/* Course category badge */}
            <View className="absolute top-2 left-2">
              <View className="bg-white/90 px-2 py-1 rounded-md">
                <Text className="text-xs font-medium text-gray-700">{course.category}</Text>
              </View>
            </View>
            {/* Heart icon */}
            <View className="absolute top-2 right-2">
              <TouchableOpacity className="bg-white/90 p-1.5 rounded-full">
                <AntDesign name="heart" size={14} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Course Content */}
          <View className="p-3">
            {/* Title */}
            <Text className="text-base font-semibold text-gray-900 mb-1" numberOfLines={2}>
              {course.title || 'No Title'}
            </Text>
            
            
            
            {/* Rating and Duration */}
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center">
                <AntDesign name="star" size={14} color="#F59E0B" />
                <Text className="text-sm font-medium text-gray-700 ml-1">
                  {course.rating || 4.8}
                </Text>
              </View>
              <Text className="text-xs text-gray-500">{course.duration}</Text>
            </View>
            
            {/* Price */}
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                {course.originalPrice && course.originalPrice > course.price ? (
                  <>
                    <Text className="text-sm text-gray-400 line-through mr-2">
                      ৳{course.originalPrice}
                    </Text>
                    <Text className="text-lg font-bold text-green-600">
                      {course.price === 0 ? 'Free' : `৳${course.price}`}
                    </Text>
                  </>
                ) : (
                  <Text className="text-lg font-bold text-gray-900">
                    {course.price === 0 ? 'Free' : `৳${course.price}`}
                  </Text>
                )}
              </View>
              
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const TabButton = ({ 
    tab, 
    label, 
    count, 
    icon 
  }: { 
    tab: string; 
    label: string; 
    count: number; 
    icon: string; 
  }) => (
    <TouchableOpacity
      onPress={() => setActiveTab(tab as any)}
      className={`flex-row items-center px-4 py-3 rounded-2xl mr-3 transition-all duration-300 ${
        activeTab === tab 
          ? 'bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg shadow-blue-500/25' 
          : 'bg-gray-100 hover:bg-gray-200'
      }`}
      style={{
        shadowColor: activeTab === tab ? '#3B82F6' : 'transparent',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: activeTab === tab ? 0.25 : 0,
        shadowRadius: 8,
        elevation: activeTab === tab ? 4 : 0,
      }}
    >
      <View className={`p-1 rounded-full ${
        activeTab === tab ? 'bg-white/20' : 'bg-transparent'
      }`}>
        <Ionicons 
          name={icon as any} 
          size={16} 
          color={activeTab === tab ? 'white' : '#6B7280'} 
        />
      </View>
      <Text className={`ml-2 font-semibold ${
        activeTab === tab ? 'text-white' : 'text-gray-700'
      }`}>
        {label}
      </Text>
      <View className={`ml-2 px-2 py-1 rounded-full ${
        activeTab === tab ? 'bg-white/20' : 'bg-gray-200'
      }`}>
        <Text className={`text-xs font-bold ${
          activeTab === tab ? 'text-white' : 'text-gray-600'
        }`}>
          {count}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const BookCard = ({ book, isFeatured = false }: { book: Book; isFeatured?: boolean }) => {
    if (isFeatured) {
      // Featured book card (horizontal layout)
      return (
        <View className="mr-4 w-64">
          <TouchableOpacity
            onPress={() => handleBookPress(book)}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 12,
              elevation: 5,
            }}
          >
            <View className="flex-row">
              {/* Book Cover */}
              <View className="w-24 h-32">
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
              <View className="flex-1 p-3">
                <View className="flex-row items-center justify-between mb-1">
                  <View className="bg-orange-500 px-2 py-1 rounded-full">
                    <Text className="text-white text-xs font-semibold">Featured</Text>
                  </View>
                  <TouchableOpacity className="p-1">
                    <AntDesign name="heart" size={14} color="#6B7280" />
                  </TouchableOpacity>
                </View>
                
                <Text className="text-sm font-bold text-gray-900 mb-1" numberOfLines={2}>
                  {book.title}
                </Text>
                <Text className="text-xs text-gray-600 mb-2" numberOfLines={1}>
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

    // All books card (vertical layout)
    return (
      <View className="mb-4">
        <TouchableOpacity
          onPress={() => handleBookPress(book)}
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
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
            <View className="absolute top-2 right-2">
              <TouchableOpacity className="bg-white/90 p-1.5 rounded-full">
                <AntDesign name="heart" size={14} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Book Content */}
          <View className="p-3">
            {/* Title */}
            <Text className="text-sm font-semibold text-gray-900 mb-1" numberOfLines={2}>
              {book.title}
            </Text>
            
            
            
            {/* Rating */}
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


  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="text-gray-600 mt-4">Loading store data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Header */}
        <View className="px-6 py-4 bg-white border-b border-gray-100">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-3xl font-bold text-gray-900">Store</Text>
            <View className="flex-row items-center space-x-3">
              <TouchableOpacity className="bg-gray-100 p-3 rounded-full">
                <Ionicons name="search" size={20} color="#6B7280" />
              </TouchableOpacity>
              <TouchableOpacity className="bg-gray-100 p-3 rounded-full">
                <Ionicons name="filter" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>
        <Text className="text-gray-600">
          Discover amazing courses and books to start learning today
        </Text>
        </View>

        {/* Filter Tabs */}
        <View className="px-6 py-4">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TabButton 
              tab="all" 
              label="All Products" 
              count={allCourses.length + allBooks.length} 
              icon="grid-outline" 
            />
            <TabButton 
              tab="courses" 
              label="Courses" 
              count={allCourses.length} 
              icon="play-circle-outline" 
            />
            <TabButton 
              tab="books" 
              label="Books" 
              count={allBooks.length} 
              icon="book-outline" 
            />
          </ScrollView>
        </View>


        {/* Content based on active tab */}
        {(activeTab === 'all' || activeTab === 'courses') && (
          <>
            {/* Featured Courses */}
            {featuredCourses.length > 0 && (activeTab === 'all' || activeTab === 'courses') && (
              <View className="py-6">
                <View className="px-6 mb-4">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-2xl font-bold text-gray-900">Featured Courses ({featuredCourses.length})</Text>
                    <TouchableOpacity className="flex-row items-center">
                      <Text className="text-blue-600 font-semibold mr-1">See All</Text>
                      <Ionicons name="chevron-forward" size={16} color="#2563EB" />
                    </TouchableOpacity>
                  </View>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="px-6"
                  contentContainerStyle={{ paddingRight: 24 }}
                >
                  {featuredCourses.map((course, index) => (
                    <CourseCard key={course.id} course={course} isFeatured />
                  ))}
                </ScrollView>
              </View>
            )}

            {/* All Courses */}
            {activeTab === 'all' || activeTab === 'courses' ? (
              <View className="px-6 pb-6">
                <View className="flex-row items-center justify-between mb-4">
                  <Text className="text-2xl font-bold text-gray-900">
                    {activeTab === 'courses' ? 'All Courses' : 'Courses'}
                  </Text>
                  <TouchableOpacity className="flex-row items-center">
                    <Text className="text-blue-600 font-semibold mr-1">Filter</Text>
                    <Ionicons name="filter" size={16} color="#2563EB" />
                  </TouchableOpacity>
                </View>
                
                {allCourses.length > 0 ? (
                  <View className="flex-row flex-wrap justify-between">
                    {allCourses.map((course, index) => (
                      <View key={course.id} className="w-[48%]">
                        <CourseCard course={course} />
                      </View>
                    ))}
                  </View>
                ) : (
                  <View className="py-8">
                    <Text className="text-center text-gray-500">No courses available</Text>
                  </View>
                )}
              </View>
            ) : null}
          </>
        )}

        {/* Books Section */}
        {(activeTab === 'all' || activeTab === 'books') && (
          <>
            {/* Featured Books */}
            {featuredBooks.length > 0 && (activeTab === 'all' || activeTab === 'books') && (
              <View className="py-6">
                <View className="px-6 mb-4">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-2xl font-bold text-gray-900">Featured Books ({featuredBooks.length})</Text>
                    <TouchableOpacity className="flex-row items-center">
                      <Text className="text-blue-600 font-semibold mr-1">See All</Text>
                      <Ionicons name="chevron-forward" size={16} color="#2563EB" />
                    </TouchableOpacity>
                  </View>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="px-6"
                  contentContainerStyle={{ paddingRight: 24 }}
                >
                  {featuredBooks.map((book) => (
                    <BookCard key={book.id} book={book} isFeatured />
                  ))}
                </ScrollView>
              </View>
            )}

            {/* All Books */}
            {activeTab === 'all' || activeTab === 'books' ? (
              <View className="px-6 pb-6">
                <View className="flex-row items-center justify-between mb-4">
                  <Text className="text-2xl font-bold text-gray-900">
                    {activeTab === 'books' ? 'All Books' : 'Books'}
                  </Text>
                  <TouchableOpacity className="flex-row items-center">
                    <Text className="text-blue-600 font-semibold mr-1">Filter</Text>
                    <Ionicons name="filter" size={16} color="#2563EB" />
                  </TouchableOpacity>
                </View>
                
                {allBooks.length > 0 ? (
                  <View className="flex-row flex-wrap justify-between">
                    {allBooks.map((book) => (
                      <View key={book.id} className="w-[48%]">
                        <BookCard book={book} />
                      </View>
                    ))}
                  </View>
                ) : (
                  <View className="py-8">
                    <Text className="text-center text-gray-500">No books available</Text>
                  </View>
                )}
              </View>
            ) : null}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
