import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { storeService, StoreCourse } from '@/services/store.service';
import { 
  StoreHeader, 
  FilterTabs, 
  CourseCard, 
  FeaturedSection, 
  GridSection,
  LoadingState
} from '~/components/store';

export default function CourseScreen() {
  const [featuredCourses, setFeaturedCourses] = useState<StoreCourse[]>([]);
  const [allCourses, setAllCourses] = useState<StoreCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'featured' | 'all'>('featured');

  useEffect(() => {
    loadCourseData();
  }, []);

  const loadCourseData = async () => {
    try {
      setLoading(true);
      
      const [featuredCourses, allCourses] = await Promise.all([
        storeService.getFeaturedCourses(),
        storeService.getAllCourses()
      ]);
      
      setFeaturedCourses(featuredCourses);
      setAllCourses(allCourses);
    } catch (error) {
      console.error('Error loading course data:', error);
      Alert.alert('Error', 'Failed to load course data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCoursePress = (course: StoreCourse) => {
    router.push(`/course/${course.id}`);
  };

  const handleSearchPress = () => {
    console.log('Search pressed');
  };

  const handleFilterPress = () => {
    console.log('Filter pressed');
  };

  const handleSeeAllCourses = () => {
    setActiveTab('all');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingState />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Header */}
        <StoreHeader 
          onSearchPress={handleSearchPress}
          onFilterPress={handleFilterPress}
        />

        {/* Filter Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'featured' && styles.activeTab]}
            onPress={() => setActiveTab('featured')}
          >
            <Text style={[styles.tabText, activeTab === 'featured' && styles.activeTabText]}>
              Featured ({featuredCourses.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'all' && styles.activeTab]}
            onPress={() => setActiveTab('all')}
          >
            <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
              All Courses ({allCourses.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content based on active tab */}
        {activeTab === 'featured' ? (
          <>
            {/* Featured Courses */}
            {featuredCourses.length > 0 && (
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
          </>
        ) : (
          /* All Courses */
          <GridSection 
            title="All Courses"
            onFilterPress={handleFilterPress}
          >
            {allCourses.length > 0 ? (
              allCourses.map((course) => (
                <View key={course.id} style={styles.courseItem}>
                  <CourseCard 
                    course={course} 
                    onPress={handleCoursePress}
                  />
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No courses available</Text>
              </View>
            )}
          </GridSection>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#6366F1',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  courseItem: {
    width: '48%',
    marginBottom: 16,
  },
  emptyState: {
    paddingVertical: 32,
    width: '100%',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#64748B',
    fontSize: 16,
  },
});
