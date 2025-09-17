import React from 'react';
import { View, ScrollView } from 'react-native';
import { TabButton } from './TabButton';

interface FilterTabsProps {
  activeTab: 'all' | 'courses' | 'books';
  onTabChange: (tab: 'all' | 'courses' | 'books') => void;
  coursesCount: number;
  booksCount: number;
}

export const FilterTabs: React.FC<FilterTabsProps> = ({ 
  activeTab, 
  onTabChange, 
  coursesCount, 
  booksCount 
}) => {
  return (
    <View className="px-6 py-6">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TabButton 
          tab="all" 
          label="All Products" 
          count={coursesCount + booksCount} 
          icon="grid-outline"
          isActive={activeTab === 'all'}
          onPress={onTabChange}
        />
        <TabButton 
          tab="courses" 
          label="Courses" 
          count={coursesCount} 
          icon="play-circle-outline"
          isActive={activeTab === 'courses'}
          onPress={onTabChange}
        />
        <TabButton 
          tab="books" 
          label="Books" 
          count={booksCount} 
          icon="book-outline"
          isActive={activeTab === 'books'}
          onPress={onTabChange}
        />
      </ScrollView>
    </View>
  );
};
