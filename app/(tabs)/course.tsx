import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { storeService, StoreCourse } from '@/services/store.service';
import { 
  StoreHeader, 
  FeaturedSection, 
  GridSection,
  LoadingState
} from '~/components/store';
import { StoreCourseCard } from '~/components/store/StoreCourseCard';

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

        {/* Category Tabs */}
        <View style={styles.tabContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScrollContent}>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'featured' && styles.activeTab]}
              onPress={() => setActiveTab('featured')}
            >
              <Text style={[styles.tabText, activeTab === 'featured' && styles.activeTabText]}>
                Featured
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'all' && styles.activeTab]}
              onPress={() => setActiveTab('all')}
            >
              <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
                All Courses
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tab}>
              <Text style={styles.tabText}>Admission</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tab}>
              <Text style={styles.tabText}>HSC</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tab}>
              <Text style={styles.tabText}>Free</Text>
            </TouchableOpacity>
          </ScrollView>
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
                  <StoreCourseCard 
                    key={course.id} 
                    course={course} 
                    isFeatured 
                    onPress={handleCoursePress}
                  />
                ))}
              </FeaturedSection>
            )}

            {/* Popular Categories */}
            <View className="px-3 mb-4">
              <Text className="text-base font-bold text-gray-900 mb-3">Popular Categories</Text>
              <View className="flex-row flex-wrap gap-2">
                {['Medical', 'Engineering', 'University', 'Nursing', 'GST'].map((category) => (
                  <TouchableOpacity key={category} className="bg-blue-50 px-3 py-1.5 rounded-full">
                    <Text className="text-blue-700 font-medium text-xs">{category}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Recently Added */}
            {allCourses.length > 0 && (
              <FeaturedSection 
                title="Recently Added" 
                count={allCourses.slice(0, 3).length}
              >
                {allCourses.slice(0, 3).map((course) => (
                  <StoreCourseCard 
                    key={course.id} 
                    course={course} 
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
            count={allCourses.length}
            onFilterPress={handleFilterPress}
          >
            {allCourses.length > 0 ? (
              allCourses.map((course) => (
                <View key={course.id} style={styles.courseItem}>
                  <StoreCourseCard 
                    course={course} 
                    onPress={handleCoursePress}
                  />
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="book-outline" size={32} color="#9CA3AF" />
                <Text style={styles.emptyText}>No courses available</Text>
                <Text style={styles.emptySubText}>Check back later for new courses</Text>
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
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 8,
  },
  tabScrollContent: {
    paddingHorizontal: 12,
    gap: 6,
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    minWidth: 70,
  },
  activeTab: {
    backgroundColor: '#2563EB',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  courseItem: {
    width: '48%',
    marginBottom: 12,
  },
  emptyState: {
    paddingVertical: 32,
    width: '100%',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
  emptySubText: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 12,
    marginTop: 4,
  },
});
