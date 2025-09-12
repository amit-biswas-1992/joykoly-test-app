import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons, MaterialIcons, AntDesign, Feather } from '@expo/vector-icons';
import { getLiveExams, getUpcomingExams, getCompletedExams, Exam as DashboardExam } from '../../../services/dashboard.service';

interface LibraryItem {
  id: string;
  title: string;
  type: 'live' | 'upcoming' | 'completed';
  thumbnail?: string;
  progress?: number;
  lastAccessed?: string;
  isCompleted?: boolean;
  category?: string;
  course?: string;
  duration?: number;
  totalMarks?: number;
  status?: string;
  score?: number;
  scheduledAt?: string;
  startTime?: string;
  endTime?: string;
}

interface LibraryProps {
  selectedCourse?: string;
}

export default function Library({ selectedCourse = 'all' }: LibraryProps) {
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'live' | 'upcoming' | 'completed'>('all');

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
      
      // Transform exams to library items based on their source
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

  const handleItemPress = (item: LibraryItem) => {
    if (item.type === 'live') {
      // Navigate to live exam
      Alert.alert(
        'Enter Live Exam',
        `Continue with ${item.title}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Enter Exam', onPress: () => router.push(`/(drawer)/(tabs)/exams/${item.id}` as any) }
        ]
      );
    } else if (item.type === 'upcoming') {
      // Show upcoming exam details
      Alert.alert(
        item.title,
        `Course: ${item.course}\nDuration: ${item.duration} minutes\nMarks: ${item.totalMarks}\nScheduled: ${new Date(item.scheduledAt || '').toLocaleDateString()}`,
        [
          { text: 'OK', style: 'default' }
        ]
      );
    } else if (item.type === 'completed') {
      // Show completed exam results
      Alert.alert(
        item.title,
        `Course: ${item.course}\nScore: ${item.score}/${item.totalMarks}\nStatus: ${item.status}\nCompleted: ${new Date(item.lastAccessed || '').toLocaleDateString()}`,
        [
          { text: 'View Results', onPress: () => router.push(`/(drawer)/(tabs)/exams/${item.id}/results` as any) },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    }
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

  const formatExamTime = (item: LibraryItem) => {
    if (item.startTime && item.endTime) {
      const startTime = new Date(item.startTime).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
      const endTime = new Date(item.endTime).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
      return `${startTime} - ${endTime}`
    }
    if (item.scheduledAt) {
      return new Date(item.scheduledAt).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
    }
    return 'Time not specified'
  }

  const LibraryItemCard = ({ item }: { item: LibraryItem }) => (
    <TouchableOpacity
      onPress={() => handleItemPress(item)}
      className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4 ${
        item.type === 'live' ? 'border-red-200 bg-red-50' :
        item.type === 'upcoming' ? 'border-blue-200 bg-blue-50' :
        'border-gray-200 bg-gray-50'
      }`}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      <View className="flex-row">
        {/* Exam Icon */}
        <View className="w-24 h-32 relative items-center justify-center">
          <View className={`w-full h-full items-center justify-center ${
            item.type === 'live' 
              ? 'bg-gradient-to-br from-red-500 to-red-600' 
              : item.type === 'upcoming'
              ? 'bg-gradient-to-br from-blue-500 to-blue-600'
              : 'bg-gradient-to-br from-green-500 to-green-600'
          }`}>
            <Ionicons 
              name={item.type === 'live' ? 'flash' : item.type === 'upcoming' ? 'time' : 'checkmark-circle'} 
              size={32} 
              color="white" 
            />
          </View>
          
          {/* Status badge */}
          <View className={`absolute top-2 left-2 px-2 py-1 rounded-full ${
            item.type === 'live' ? 'bg-red-500' : 
            item.type === 'upcoming' ? 'bg-blue-500' : 'bg-green-500'
          }`}>
            <Text className="text-white text-xs font-semibold">
              {item.status || item.type}
            </Text>
          </View>
          
          {/* Score badge for completed */}
          {item.type === 'completed' && item.score && (
            <View className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full">
              <Text className="text-green-600 text-xs font-bold">{item.score}</Text>
            </View>
          )}
        </View>
        
        {/* Content */}
        <View className="flex-1 p-4">
          <View className="flex-row items-start justify-between mb-2">
            <View className="flex-1 mr-2">
              <Text className="text-base font-bold text-gray-900 mb-1" numberOfLines={2}>
                {item.title}
              </Text>
              <Text className="text-sm text-gray-600 mb-1">
                {item.course || item.category}
              </Text>
            </View>
            
            <TouchableOpacity className="p-1">
              <Ionicons name="ellipsis-vertical" size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          {/* Progress bar for live exams */}
          {item.type === 'live' && (
            <View className="mb-3">
              <View className="flex-row items-center justify-between mb-1">
                <Text className="text-xs text-gray-500">Progress</Text>
                <Text className="text-xs font-medium text-gray-700">{item.progress}%</Text>
              </View>
              <View className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <View 
                  className="h-full rounded-full bg-red-500"
                  style={{ width: `${item.progress || 0}%` }}
                />
              </View>
            </View>
          )}
          
          {/* Exam details */}
          <View className="space-y-2">
            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={14} color="#6B7280" />
              <Text className="text-xs text-gray-600 ml-2">
                {item.duration} min • {item.totalMarks} marks
              </Text>
            </View>
            
            {item.type === 'live' && (
              <View className="flex-row items-center">
                <Ionicons name="flash" size={14} color="#EF4444" />
                <Text className="text-xs text-red-600 ml-2 font-medium">
                  {formatExamTime(item)}
                </Text>
              </View>
            )}
            
            {item.type === 'upcoming' && item.scheduledAt && (
              <View className="flex-row items-center">
                <Ionicons name="calendar-outline" size={14} color="#3B82F6" />
                <Text className="text-xs text-blue-600 ml-2">
                  {new Date(item.scheduledAt).toLocaleDateString()}
                </Text>
              </View>
            )}
            
            {item.type === 'completed' && item.score && (
              <View className="flex-row items-center">
                <Ionicons name="trophy-outline" size={14} color="#10B981" />
                <Text className="text-xs text-green-600 ml-2 font-medium">
                  Score: {item.score}/{item.totalMarks}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

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

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center">
          <View className="items-center space-y-4">
            <View className="relative">
              <View className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></View>
              <View className="absolute inset-0 rounded-full h-12 w-12 border-4 border-transparent border-r-purple-600 animate-spin opacity-75" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></View>
            </View>
            <View className="space-y-2">
              <Text className="text-lg font-medium text-gray-700">Loading your exams...</Text>
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
          <View className="items-center space-y-4">
            <View className="w-24 h-24 bg-red-100 rounded-full items-center justify-center">
              <Ionicons name="alert-circle-outline" size={32} color="#EF4444" />
            </View>
            <View className="items-center space-y-2">
              <Text className="text-lg font-medium text-gray-700">Failed to load exams</Text>
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
            <TouchableOpacity className="bg-gray-100 p-3 rounded-full">
              <Ionicons name="search" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          {/* Quick stats */}
          <View className="flex-row space-x-4">
            <View className="flex-1 bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-2xl">
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
            
            <View className="flex-1 bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-2xl">
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
            />
            <TabButton 
              tab="live" 
              label="Live" 
              count={libraryItems.filter(item => item.type === 'live').length} 
              icon="flash-outline" 
            />
            <TabButton 
              tab="upcoming" 
              label="Upcoming" 
              count={libraryItems.filter(item => item.type === 'upcoming').length} 
              icon="time-outline" 
            />
            <TabButton 
              tab="completed" 
              label="Completed" 
              count={libraryItems.filter(item => item.type === 'completed').length} 
              icon="checkmark-circle-outline" 
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
                    <LibraryItemCard key={`recent-${item.id}`} item={item} />
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
                  <LibraryItemCard key={item.id} item={item} />
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
                onPress={() => router.push('/(drawer)/(tabs)/store')}
              >
                <Text className="text-white font-semibold">Browse Courses</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
