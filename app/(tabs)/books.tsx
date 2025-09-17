import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { bookService, Book } from '@/services/book.service';
import { 
  StoreHeader, 
  BookCard, 
  FeaturedSection, 
  GridSection,
  LoadingState
} from '~/components/store';

export default function BooksScreen() {
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'featured' | 'all'>('featured');

  useEffect(() => {
    loadBookData();
  }, []);

  const loadBookData = async () => {
    try {
      setLoading(true);
      
      const [featuredBooks, allBooks] = await Promise.all([
        bookService.getFeaturedBooks(),
        bookService.getAllBooks()
      ]);
      
      setFeaturedBooks(featuredBooks);
      setAllBooks(allBooks);
    } catch (error) {
      console.error('Error loading book data:', error);
      Alert.alert('Error', 'Failed to load book data. Please try again.');
    } finally {
      setLoading(false);
    }
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
    console.log('Search pressed');
  };

  const handleFilterPress = () => {
    console.log('Filter pressed');
  };

  const handleSeeAllBooks = () => {
    setActiveTab('all');
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50">
        <LoadingState />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Header */}
        <StoreHeader 
          onSearchPress={handleSearchPress}
          onFilterPress={handleFilterPress}
        />

        {/* Filter Tabs */}
        <View className="flex-row px-5 py-4 bg-white border-b border-gray-200">
          <TouchableOpacity 
            className={`flex-1 py-3 px-4 mx-1 rounded-xl items-center ${
              activeTab === 'featured' ? 'bg-indigo-600' : 'bg-slate-100'
            }`}
            onPress={() => setActiveTab('featured')}
          >
            <Text className={`text-sm font-semibold ${
              activeTab === 'featured' ? 'text-white' : 'text-slate-600'
            }`}>
              Featured ({featuredBooks.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className={`flex-1 py-3 px-4 mx-1 rounded-xl items-center ${
              activeTab === 'all' ? 'bg-indigo-600' : 'bg-slate-100'
            }`}
            onPress={() => setActiveTab('all')}
          >
            <Text className={`text-sm font-semibold ${
              activeTab === 'all' ? 'text-white' : 'text-slate-600'
            }`}>
              All Books ({allBooks.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content based on active tab */}
        {activeTab === 'featured' ? (
          <>
            {/* Featured Books */}
            {featuredBooks.length > 0 && (
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
          </>
        ) : (
          /* All Books */
          <GridSection 
            title="All Books"
            onFilterPress={handleFilterPress}
          >
            {allBooks.length > 0 ? (
              allBooks.map((book) => (
                <View key={book.id} className="w-[48%] mb-4">
                  <BookCard 
                    book={book} 
                    onPress={handleBookPress}
                  />
                </View>
              ))
            ) : (
              <View className="py-8 w-full items-center">
                <Text className="text-center text-slate-600 text-base">No books available</Text>
              </View>
            )}
          </GridSection>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

