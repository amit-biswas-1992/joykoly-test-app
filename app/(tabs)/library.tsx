import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, RefreshControl, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getLiveExams, getUpcomingExams, getCompletedExams, Exam as DashboardExam } from '@/services/dashboard.service';
import { ExamModal, LibraryItemCard, TabButton } from '~/components/library';
import { LibraryItem } from '~/components/library/types';


interface LibraryProps {
  selectedCourse?: string;
}

export default function Library({ selectedCourse = 'all' }: LibraryProps) {
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'live' | 'upcoming' | 'completed'>('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);

  useEffect(() => {
    loadLibraryData();
  }, [selectedCourse]);

  const loadLibraryData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use existing dashboard service functions
      const [liveExamsData, upcomingExamsData, completedExamsData] = await Promise.all([
        getLiveExams(selectedCourse === 'all' ? undefined : selectedCourse),
        getUpcomingExams(10, selectedCourse === 'all' ? undefined : selectedCourse),
        getCompletedExams(selectedCourse === 'all' ? undefined : selectedCourse)
      ]);
      
      // Debug logging
      console.log('Live exams data:', liveExamsData);
      console.log('Upcoming exams data:', upcomingExamsData);
      console.log('Completed exams data:', completedExamsData);
      console.log('Live exams count:', liveExamsData.length);
      console.log('Upcoming exams count:', upcomingExamsData.length);
      console.log('Completed exams count:', completedExamsData.length);
      
      const examItems: LibraryItem[] = [];
      
      // Process live exams
      liveExamsData.forEach((exam: DashboardExam) => {
        examItems.push({
          id: exam.id,
          title: exam.title,
          type: 'live' as const,
          thumbnail: '',
          progress: Math.floor(Math.random() * 80) + 10, // Random progress between 10-90%
          lastAccessed: exam.startTime || new Date().toISOString(),
          isCompleted: false,
          category: exam.courseTitle?.split(' ')[0] || 'General',
          course: exam.courseTitle || 'Unknown Course',
          duration: exam.duration || 60,
          totalMarks: exam.totalMarks || 100,
          status: 'Live',
          scheduledAt: exam.startTime,
          startTime: exam.startTime,
          endTime: exam.endTime
        });
      });
      
      // Process upcoming exams
      upcomingExamsData.forEach((exam: DashboardExam) => {
        examItems.push({
          id: exam.id,
          title: exam.title,
          type: 'upcoming' as const,
          thumbnail: '',
          progress: 0,
          lastAccessed: exam.startTime || new Date().toISOString(),
          isCompleted: false,
          category: exam.courseTitle?.split(' ')[0] || 'General',
          course: exam.courseTitle || 'Unknown Course',
          duration: exam.duration || 60,
          totalMarks: exam.totalMarks || 100,
          status: 'Upcoming',
          scheduledAt: exam.startTime
        });
      });
      
      // Process completed exams
      completedExamsData.forEach((exam: DashboardExam) => {
        examItems.push({
          id: exam.id,
          title: exam.title,
          type: 'completed' as const,
          thumbnail: '',
          progress: 100,
          lastAccessed: exam.endTime || new Date().toISOString(),
          isCompleted: true,
          category: exam.courseTitle?.split(' ')[0] || 'General',
          course: exam.courseTitle || 'Unknown Course',
          duration: exam.duration || 60,
          totalMarks: exam.totalMarks || 100,
          status: 'Completed',
          score: exam.score || 0,
          scheduledAt: exam.startTime
        });
      });
      
      console.log('Final exam items:', examItems);
      console.log('Final exam items count:', examItems.length);
      setLibraryItems(examItems);
    } catch (error) {
      console.error('Error loading exam data:', error);
      setError('Failed to load exam data. Please try again.');
      Alert.alert(
        'Error', 
        'Failed to load exam data. Please check your internet connection and try again.',
        [
          { text: 'Retry', onPress: () => loadLibraryData() },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadLibraryData();
  };

  const showModal = (item: LibraryItem) => {
    console.log('Showing modal for:', item.title);
    setSelectedItem(item);
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

  const handleItemPress = (item: LibraryItem) => {
    console.log('Exam card pressed:', item.title);
    showModal(item);
  };

  const handleTabPress = (tab: string) => {
    setActiveTab(tab as 'all' | 'live' | 'upcoming' | 'completed');
  };

  const filteredItems = libraryItems.filter(item => {
    switch (activeTab) {
      case 'live':
        return item.type === 'live';
      case 'upcoming':
        return item.type === 'upcoming';
      case 'completed':
        return item.type === 'completed';
      default:
        return true;
    }
  });




  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center">
          <View className="items-center">
            <View className="relative mb-4">
              <ActivityIndicator size="large" color="#3B82F6" />
            </View>
            <View>
              <Text className="text-lg font-medium text-gray-700 mb-2">Loading your exams...</Text>
              <Text className="text-sm text-gray-500">This won't take long</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center px-6">
          <View className="items-center">
            <View className="w-24 h-24 bg-red-100 rounded-full items-center justify-center mb-4">
              <Ionicons name="alert-circle-outline" size={32} color="#EF4444" />
            </View>
            <View className="items-center mb-4">
              <Text className="text-lg font-medium text-gray-700 mb-2">Failed to load exams</Text>
              <Text className="text-sm text-gray-500 text-center">{error}</Text>
            </View>
            <TouchableOpacity 
              className="bg-blue-500 px-6 py-3 rounded-full"
              onPress={() => loadLibraryData()}
            >
              <Text className="text-white font-semibold">Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View className="px-6 py-6 bg-white">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-3xl font-bold text-gray-900">My Exams</Text>
              <Text className="text-gray-600 mt-1">
                {libraryItems.length} exams • {filteredItems.filter(item => item.type === 'completed').length} completed
              </Text>
            </View>
            <TouchableOpacity 
              className={`${Platform.OS === 'ios' ? 'bg-gray-100' : 'bg-gray-200'} p-3 rounded-full`}
              style={{
                shadowColor: Platform.OS === 'ios' ? '#000' : 'transparent',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: Platform.OS === 'ios' ? 0.1 : 0,
                shadowRadius: Platform.OS === 'ios' ? 2 : 0,
              }}
            >
              <Ionicons name="search" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          {/* Quick stats */}
          <View className="flex-row">
            <View className="flex-1 bg-red-50 p-4 rounded-2xl mr-2">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-2xl font-bold text-red-600">
                    {libraryItems.filter(item => item.type === 'live').length}
                  </Text>
                  <Text className="text-sm text-red-700">Live Exams</Text>
                </View>
                <Ionicons name="flash" size={24} color="#EF4444" />
              </View>
            </View>
            
            <View className="flex-1 bg-blue-50 p-4 rounded-2xl ml-2">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-2xl font-bold text-blue-600">
                    {libraryItems.filter(item => item.type === 'upcoming').length}
                  </Text>
                  <Text className="text-sm text-blue-700">Upcoming</Text>
                </View>
                <Ionicons name="time" size={24} color="#2563EB" />
              </View>
            </View>
          </View>
        </View>

        {/* Filter Tabs */}
        <View className="px-6 py-4">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TabButton 
              tab="all" 
              label="All Exams" 
              count={libraryItems.length} 
              icon="grid-outline"
              isActive={activeTab === 'all'}
              onPress={handleTabPress}
            />
            <TabButton 
              tab="live" 
              label="Live" 
              count={libraryItems.filter(item => item.type === 'live').length} 
              icon="flash-outline"
              isActive={activeTab === 'live'}
              onPress={handleTabPress}
            />
            <TabButton 
              tab="upcoming" 
              label="Upcoming" 
              count={libraryItems.filter(item => item.type === 'upcoming').length} 
              icon="time-outline"
              isActive={activeTab === 'upcoming'}
              onPress={handleTabPress}
            />
            <TabButton 
              tab="completed" 
              label="Completed" 
              count={libraryItems.filter(item => item.type === 'completed').length} 
              icon="checkmark-circle-outline"
              isActive={activeTab === 'completed'}
              onPress={handleTabPress}
            />
          </ScrollView>
        </View>

        {/* Library Items */}
        <View className="px-6 pb-6">
          {filteredItems.length > 0 ? (
            <>
              {/* Recently Accessed */}
              <View className="mb-6">
                <Text className="text-xl font-bold text-gray-900 mb-4">Recently Accessed</Text>
                {filteredItems
                  .sort((a, b) => new Date(b.lastAccessed || 0).getTime() - new Date(a.lastAccessed || 0).getTime())
                  .slice(0, 3)
                  .map((item) => (
                    <LibraryItemCard key={`recent-${item.id}`} item={item} onPress={handleItemPress} />
                  ))}
              </View>

              {/* All Items */}
              <View>
                <Text className="text-xl font-bold text-gray-900 mb-4">
                  {activeTab === 'all' ? 'All Exams' : 
                   activeTab === 'live' ? 'Live Exams' :
                   activeTab === 'upcoming' ? 'Upcoming Exams' : 'Completed Exams'}
                </Text>
                {filteredItems.map((item) => (
                  <LibraryItemCard key={item.id} item={item} onPress={handleItemPress} />
                ))}
              </View>
            </>
          ) : (
            <View className="py-12 items-center">
              <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center mb-4">
                <Ionicons name="library-outline" size={32} color="#9CA3AF" />
              </View>
              <Text className="text-lg font-medium text-gray-600 mb-2">No exams found</Text>
              <Text className="text-sm text-gray-500 text-center px-8">
                {activeTab === 'all' 
                  ? "You don't have any exams yet. Check back later for scheduled exams!"
                  : `No ${activeTab} exams found.`
                }
              </Text>
              <TouchableOpacity 
                className="mt-4 bg-blue-500 px-6 py-3 rounded-full"
                onPress={() => router.push('/(tabs)/store')}
              >
                <Text className="text-white font-semibold">Browse Courses</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
      
      {/* Exam Modal */}
      <ExamModal 
        visible={modalVisible}
        selectedItem={selectedItem}
        onClose={hideModal}
      />
    </SafeAreaView>
  );
}
