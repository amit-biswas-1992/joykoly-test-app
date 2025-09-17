import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { storeService, StoreCourse } from '@/services/store.service';
import { bookService, Book } from '@/services/book.service';
import { router } from 'expo-router';
import { 
  StoreHeader, 
  FilterTabs, 
  CourseCard, 
  BookCard, 
  FeaturedSection, 
  GridSection,
  LoadingState
} from '~/components/store';

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
    router.push(`/course/${course.id}`);
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

  const handleSearchPress = () => {
    // TODO: Implement search functionality
    console.log('Search pressed');
  };

  const handleFilterPress = () => {
    // TODO: Implement filter functionality
    console.log('Filter pressed');
  };

  const handleSeeAllCourses = () => {
    setActiveTab('courses');
  };

  const handleSeeAllBooks = () => {
    setActiveTab('books');
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1">
        <LoadingState />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Header */}
        <StoreHeader 
          onSearchPress={handleSearchPress}
          onFilterPress={handleFilterPress}
        />

        {/* Filter Tabs */}
        <FilterTabs 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          coursesCount={allCourses.length}
          booksCount={allBooks.length}
        />

        {/* Content based on active tab */}
        {(activeTab === 'all' || activeTab === 'courses') && (
          <>
            {/* Featured Courses */}
            {featuredCourses.length > 0 && (activeTab === 'all' || activeTab === 'courses') && (
              <FeaturedSection 
                title="Featured Courses" 
                count={featuredCourses.length}
                onSeeAllPress={handleSeeAllCourses}
              >
                {featuredCourses.map((course) => (
                  <CourseCard 
                    key={course.id} 
                    course={course} 
                    isFeatured 
                    onPress={handleCoursePress}
                  />
                ))}
              </FeaturedSection>
            )}

            {/* All Courses */}
            {activeTab === 'all' || activeTab === 'courses' ? (
              <GridSection 
                title={activeTab === 'courses' ? 'All Courses' : 'Courses'}
                onFilterPress={handleFilterPress}
              >
                {allCourses.length > 0 ? (
                  allCourses.map((course) => (
                    <View key={course.id} className="w-[48%]">
                      <CourseCard 
                        course={course} 
                        onPress={handleCoursePress}
                      />
                    </View>
                  ))
                ) : (
                  <View className="py-8 w-full">
                    <Text className="text-center text-gray-500">No courses available</Text>
                  </View>
                )}
              </GridSection>
            ) : null}
          </>
        )}

        {/* Books Section */}
        {(activeTab === 'all' || activeTab === 'books') && (
          <>
            {/* Featured Books */}
            {featuredBooks.length > 0 && (activeTab === 'all' || activeTab === 'books') && (
              <FeaturedSection 
                title="Featured Books" 
                count={featuredBooks.length}
                onSeeAllPress={handleSeeAllBooks}
              >
                {featuredBooks.map((book) => (
                  <BookCard 
                    key={book.id} 
                    book={book} 
                    isFeatured 
                    onPress={handleBookPress}
                  />
                ))}
              </FeaturedSection>
            )}

            {/* All Books */}
            {activeTab === 'all' || activeTab === 'books' ? (
              <GridSection 
                title={activeTab === 'books' ? 'All Books' : 'Books'}
                onFilterPress={handleFilterPress}
              >
                {allBooks.length > 0 ? (
                  allBooks.map((book) => (
                    <View key={book.id} className="w-[48%]">
                      <BookCard 
                        book={book} 
                        onPress={handleBookPress}
                      />
                    </View>
                  ))
                ) : (
                  <View className="py-8 w-full">
                    <Text className="text-center text-gray-500">No books available</Text>
                  </View>
                )}
              </GridSection>
            ) : null}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}