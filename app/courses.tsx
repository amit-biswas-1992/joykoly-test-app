import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function CoursesScreen() {
  const router = useRouter();

  // Mock course data
  const courses = [
    {
      id: '1',
      title: 'Mathematics Fundamentals',
      instructor: 'Dr. Sarah Johnson',
      progress: 75,
      totalLessons: 20,
      completedLessons: 15,
      thumbnail: '📚',
    },
    {
      id: '2',
      title: 'Physics for Beginners',
      instructor: 'Prof. Michael Chen',
      progress: 45,
      totalLessons: 15,
      completedLessons: 7,
      thumbnail: '🔬',
    },
    {
      id: '3',
      title: 'Chemistry Basics',
      instructor: 'Dr. Emily Davis',
      progress: 90,
      totalLessons: 12,
      completedLessons: 11,
      thumbnail: '🧪',
    },
  ];

  const handleCoursePress = (courseId: string) => {
    router.push(`/course/${courseId}` as any);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Courses</Text>
          <Text style={styles.headerSubtitle}>
            Continue your learning journey
          </Text>
        </View>

        <View style={styles.coursesList}>
          {courses.map((course) => (
            <TouchableOpacity
              key={course.id}
              style={styles.courseCard}
              onPress={() => handleCoursePress(course.id)}
              activeOpacity={0.7}
            >
              <View style={styles.courseHeader}>
                <View style={styles.courseThumbnail}>
                  <Text style={styles.thumbnailText}>{course.thumbnail}</Text>
                </View>
                <View style={styles.courseInfo}>
                  <Text style={styles.courseTitle}>{course.title}</Text>
                  <Text style={styles.courseInstructor}>{course.instructor}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </View>
              
              <View style={styles.progressContainer}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressText}>Progress</Text>
                  <Text style={styles.progressPercentage}>{course.progress}%</Text>
                </View>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${course.progress}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.lessonCount}>
                  {course.completedLessons} of {course.totalLessons} lessons completed
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.emptyState}>
          <Ionicons name="book-outline" size={64} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>No More Courses</Text>
          <Text style={styles.emptySubtitle}>
            You've completed all your enrolled courses
          </Text>
          <TouchableOpacity style={styles.browseButton}>
            <Text style={styles.browseButtonText}>Browse More Courses</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  coursesList: {
    paddingHorizontal: 20,
  },
  courseCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  courseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  courseThumbnail: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#EBF4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  thumbnailText: {
    fontSize: 24,
  },
  courseInfo: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  courseInstructor: {
    fontSize: 14,
    color: '#6B7280',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 3,
  },
  lessonCount: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});
