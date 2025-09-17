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

export default function ExamsScreen() {
  const router = useRouter();

  // Mock exam data
  const exams = [
    {
      id: '1',
      title: 'Mathematics Midterm Exam',
      course: 'Mathematics Fundamentals',
      date: '2024-01-15',
      status: 'completed',
      score: 85,
      totalMarks: 100,
      duration: 120,
    },
    {
      id: '2',
      title: 'Physics Quiz 1',
      course: 'Physics for Beginners',
      date: '2024-01-10',
      status: 'completed',
      score: 92,
      totalMarks: 100,
      duration: 60,
    },
    {
      id: '3',
      title: 'Chemistry Final Exam',
      course: 'Chemistry Basics',
      date: '2024-01-20',
      status: 'upcoming',
      score: null,
      totalMarks: 100,
      duration: 180,
    },
  ];

  const handleExamPress = (examId: string) => {
    router.push(`/exams/${examId}/submissions` as any);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#10B981';
      case 'upcoming':
        return '#F59E0B';
      case 'in-progress':
        return '#3B82F6';
      default:
        return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return 'checkmark-circle';
      case 'upcoming':
        return 'time';
      case 'in-progress':
        return 'play-circle';
      default:
        return 'help-circle';
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Exams</Text>
          <Text style={styles.headerSubtitle}>
            View your exam history and results
          </Text>
        </View>

        <View style={styles.examsList}>
          {exams.map((exam) => (
            <TouchableOpacity
              key={exam.id}
              style={styles.examCard}
              onPress={() => handleExamPress(exam.id)}
              activeOpacity={0.7}
            >
              <View style={styles.examHeader}>
                <View style={styles.examInfo}>
                  <Text style={styles.examTitle}>{exam.title}</Text>
                  <Text style={styles.examCourse}>{exam.course}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(exam.status) + '20' }]}>
                  <Ionicons 
                    name={getStatusIcon(exam.status) as any} 
                    size={16} 
                    color={getStatusColor(exam.status)} 
                  />
                  <Text style={[styles.statusText, { color: getStatusColor(exam.status) }]}>
                    {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                  </Text>
                </View>
              </View>
              
              <View style={styles.examDetails}>
                <View style={styles.detailItem}>
                  <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                  <Text style={styles.detailText}>
                    {new Date(exam.date).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="time-outline" size={16} color="#6B7280" />
                  <Text style={styles.detailText}>
                    {exam.duration} minutes
                  </Text>
                </View>
                {exam.score !== null && (
                  <View style={styles.detailItem}>
                    <Ionicons name="trophy-outline" size={16} color="#6B7280" />
                    <Text style={styles.detailText}>
                      {exam.score}/{exam.totalMarks} marks
                    </Text>
                  </View>
                )}
              </View>

              {exam.score !== null && (
                <View style={styles.scoreContainer}>
                  <View style={styles.scoreBar}>
                    <View 
                      style={[
                        styles.scoreFill, 
                        { 
                          width: `${(exam.score / exam.totalMarks) * 100}%`,
                          backgroundColor: exam.score >= 80 ? '#10B981' : 
                                         exam.score >= 60 ? '#F59E0B' : '#EF4444'
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.scoreText}>
                    {((exam.score / exam.totalMarks) * 100).toFixed(1)}%
                  </Text>
                </View>
              )}

              <View style={styles.examActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="eye-outline" size={16} color="#3B82F6" />
                  <Text style={styles.actionButtonText}>View Details</Text>
                </TouchableOpacity>
                {exam.status === 'completed' && (
                  <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="bar-chart-outline" size={16} color="#3B82F6" />
                    <Text style={styles.actionButtonText}>Leaderboard</Text>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.emptyState}>
          <Ionicons name="document-text-outline" size={64} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>No More Exams</Text>
          <Text style={styles.emptySubtitle}>
            You've completed all your available exams
          </Text>
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
  examsList: {
    paddingHorizontal: 20,
  },
  examCard: {
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
  examHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  examInfo: {
    flex: 1,
    marginRight: 12,
  },
  examTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  examCourse: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  examDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  scoreBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginRight: 8,
  },
  scoreFill: {
    height: '100%',
    borderRadius: 3,
  },
  scoreText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
  },
  examActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#EBF4FF',
  },
  actionButtonText: {
    fontSize: 12,
    color: '#3B82F6',
    marginLeft: 4,
    fontWeight: '500',
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
  },
});
