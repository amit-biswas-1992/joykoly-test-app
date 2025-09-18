import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { EXAM_TYPE_COLORS, EXAM_TYPE_ICONS, ExamType } from './constants';

const { height: screenHeight } = Dimensions.get('window');

interface LibraryItem {
  id: string;
  title: string;
  type: 'live' | 'upcoming' | 'completed';
  thumbnail?: string;
  status?: string;
  score?: number;
  totalMarks?: number;
  duration?: number;
  questions?: number;
  progress?: number;
  scheduledAt?: string;
  startTime?: string;
  endTime?: string;
}

interface ExamModalProps {
  visible: boolean;
  selectedItem: LibraryItem | null;
  onClose: () => void;
}

const formatExamTime = (item: LibraryItem) => {
  if (item.startTime && item.endTime) {
    const startTime = new Date(item.startTime).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
    const endTime = new Date(item.endTime).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
    return `${startTime} - ${endTime}`;
  }
  return 'Time not specified';
}

const ExamModal: React.FC<ExamModalProps> = ({ visible, selectedItem, onClose }) => {
  const [isClosePressed, setIsClosePressed] = useState(false);

  if (!selectedItem) return null;

  const handleStartExam = () => {
    onClose();
    router.push(`/exams/${selectedItem.id}` as any);
  };

  const handleViewResults = () => {
    onClose();
    router.push(`/exams/${selectedItem.id}/submissions` as any);
  };

  const handleViewLeaderboard = () => {
    onClose();
    router.push(`/exams/${selectedItem.id}/leaderboard` as any);
  };

  const handleStartPractice = () => {
    onClose();
    router.push(`/exam/${selectedItem.id}?mode=practice` as any);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View className="flex-1 justify-end bg-black/50">
        <View 
          className="bg-white rounded-t-3xl"
          style={{ 
            minHeight: screenHeight * 0.7,
            maxHeight: screenHeight * 0.9,
          }}
        >
          <View className="flex-1 px-6 pt-4">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-1">
            <Text className="text-2xl font-bold text-gray-900 mb-2">
              {selectedItem.title}
            </Text>
            <Text className="text-gray-600 text-base">
              {selectedItem.type === 'live' ? 'Live Exam' : 
               selectedItem.type === 'upcoming' ? 'Upcoming Exam' : 
               'Completed Exam'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={onClose}
            onPressIn={() => setIsClosePressed(true)}
            onPressOut={() => setIsClosePressed(false)}
            className={`w-10 h-10 rounded-full items-center justify-center ${
              isClosePressed ? 'bg-red-100' : 'bg-gray-100'
            }`}
            activeOpacity={0.7}
          >
            <Ionicons 
              name="close" 
              size={24} 
              color={isClosePressed ? "#EF4444" : "#6B7280"} 
            />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Status Badge */}
          <View className="flex-row items-center mb-6">
            <View 
              className={`px-4 py-2 rounded-full flex-row items-center bg-${EXAM_TYPE_COLORS[selectedItem.type as ExamType]?.background || 'gray-50'}`}
            >
              <Ionicons 
                name={EXAM_TYPE_ICONS[selectedItem.type as ExamType] as any || 'help-circle'} 
                size={16} 
                color={EXAM_TYPE_COLORS[selectedItem.type as ExamType]?.icon || '#6B7280'} 
              />
              <Text 
                className={`ml-2 font-semibold text-sm text-${EXAM_TYPE_COLORS[selectedItem.type as ExamType]?.text || 'gray-600'}`}
              >
                {selectedItem.status ? selectedItem.status : selectedItem.type}
              </Text>
            </View>
            
            {selectedItem.type === 'completed' && selectedItem.score ? (
              <View className="ml-3 px-3 py-2 bg-green-100 rounded-full">
                <Text className="text-green-700 font-bold text-sm">
                  {selectedItem.score ? selectedItem.score : 0}/{selectedItem.totalMarks ? selectedItem.totalMarks : 0}
                </Text>
              </View>
            ) : null}
          </View>

          {/* Exam Details */}
          <View className="bg-gray-50 rounded-2xl p-6 mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-4">Exam Details</Text>
            
            <View className="space-y-4">
              {/* Duration */}
              {selectedItem.duration ? (
                <View className="flex-row items-center">
                  <Ionicons name="time-outline" size={20} color="#6B7280" />
                  <Text className="ml-3 text-gray-700 flex-1">Duration</Text>
                  <Text className="text-gray-900 font-medium">{selectedItem.duration} minutes</Text>
                </View>
              ) : null}

              {/* Questions */}
              {selectedItem.questions ? (
                <View className="flex-row items-center">
                  <Ionicons name="help-circle-outline" size={20} color="#6B7280" />
                  <Text className="ml-3 text-gray-700 flex-1">Questions</Text>
                  <Text className="text-gray-900 font-medium">{selectedItem.questions}</Text>
                </View>
              ) : null}

              {/* Total Marks */}
              {selectedItem.totalMarks ? (
                <View className="flex-row items-center">
                  <Ionicons name="trophy-outline" size={20} color="#6B7280" />
                  <Text className="ml-3 text-gray-700 flex-1">Total Marks</Text>
                  <Text className="text-gray-900 font-medium">{selectedItem.totalMarks}</Text>
                </View>
              ) : null}

              {/* Time */}
              {selectedItem.type === 'live' || selectedItem.type === 'upcoming' ? (
                <View className="flex-row items-center">
                  <Ionicons name="calendar-outline" size={20} color="#6B7280" />
                  <Text className="ml-3 text-gray-700 flex-1">Time</Text>
                  <Text className="text-gray-900 font-medium">{formatExamTime(selectedItem)}</Text>
                </View>
              ) : null}

              {/* Scheduled Date */}
              {selectedItem.scheduledAt ? (
                <View className="flex-row items-center">
                  <Ionicons name="calendar-outline" size={20} color="#6B7280" />
                  <Text className="ml-3 text-gray-700 flex-1">Scheduled</Text>
                  <Text className="text-gray-900 font-medium">
                    {new Date(selectedItem.scheduledAt).toLocaleDateString()}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>

          {/* Progress for Live/Upcoming */}
          {selectedItem.type !== 'completed' && selectedItem.progress !== undefined ? (
            <View className="bg-white rounded-2xl p-6 mb-6 border border-gray-200">
              <Text className="text-lg font-semibold text-gray-900 mb-4">Progress</Text>
              <View className="flex-row items-center">
                <View className="flex-1 bg-gray-200 rounded-full h-3 mr-4">
                  <View 
                    className="bg-blue-500 h-3 rounded-full"
                    style={{ width: `${selectedItem.progress}%` }}
                  />
                </View>
                <Text className="text-gray-700 font-medium">{selectedItem.progress}%</Text>
              </View>
            </View>
          ) : null}

          {/* Action Buttons */}
          <View className="space-y-3 mb-8">
            {selectedItem.type === 'live' ? (
              <TouchableOpacity
                onPress={handleStartExam}
                className="bg-red-500 rounded-2xl py-4 px-6 flex-row items-center justify-center"
              >
                <Ionicons name="play" size={20} color="white" />
                <Text className="text-white font-semibold text-lg ml-2">Start Exam</Text>
              </TouchableOpacity>
            ) : selectedItem.type === 'upcoming' ? (
              <TouchableOpacity
                onPress={handleStartExam}
                className="bg-blue-500 rounded-2xl py-4 px-6 flex-row items-center justify-center"
              >
                <Ionicons name="time" size={20} color="white" />
                <Text className="text-white font-semibold text-lg ml-2">View Details</Text>
              </TouchableOpacity>
            ) : (
              <View>
                <TouchableOpacity
                  onPress={handleViewResults}
                  className="bg-green-500 rounded-2xl py-4 px-6 flex-row items-center justify-center shadow-lg"
                  style={{ marginBottom: 16 }}
                  activeOpacity={0.8}
                >
                  <Ionicons name="analytics" size={20} color="white" />
                  <Text className="text-white font-semibold text-lg ml-2">View Results</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={handleStartPractice}
                  className="bg-purple-500 rounded-2xl py-4 px-6 flex-row items-center justify-center shadow-lg"
                  style={{ marginBottom: 16 }}
                  activeOpacity={0.8}
                >
                  <Ionicons name="book" size={20} color="white" />
                  <Text className="text-white font-semibold text-lg ml-2">Start Practice Exam</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={handleViewLeaderboard}
                  className="bg-blue-500 rounded-2xl py-4 px-6 flex-row items-center justify-center shadow-lg"
                  activeOpacity={0.8}
                >
                  <Ionicons name="trophy" size={20} color="white" />
                  <Text className="text-white font-semibold text-lg ml-2">Leaderboard</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
};

ExamModal.displayName = 'ExamModal';

export { ExamModal };