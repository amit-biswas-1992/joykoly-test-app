import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '~/components/nativewindui/Button';
import { Text as NativeWindUIText } from '~/components/nativewindui/Text';

interface MoreOption {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  description?: string;
}

const moreOptions: MoreOption[] = [
  {
    id: 'profile',
    title: 'Profile',
    icon: 'person-outline',
    route: '/profile',
    description: 'View and edit your profile information',
  },
  {
    id: 'courses',
    title: 'My Courses',
    icon: 'book-outline',
    route: '/courses',
    description: 'View your enrolled courses',
  },
  {
    id: 'exams',
    title: 'My Exams',
    icon: 'document-text-outline',
    route: '/exams',
    description: 'View your exam history and results',
  },
  {
    id: 'settings',
    title: 'Settings',
    icon: 'settings-outline',
    route: '/modal',
    description: 'App settings and preferences',
  },
  {
    id: 'help',
    title: 'Help & Support',
    icon: 'help-circle-outline',
    route: '/help',
    description: 'Get help and contact support',
  },
  {
    id: 'about',
    title: 'About',
    icon: 'information-circle-outline',
    route: '/about',
    description: 'App version and information',
  },
];

export default function MoreScreen() {
  const router = useRouter();

  const handleOptionPress = (option: MoreOption) => {
    router.push(option.route as any);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>More Options</Text>
          <Text style={styles.headerSubtitle}>
            Access additional features and settings
          </Text>
        </View>

        <View style={styles.optionsList}>
          {moreOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.optionItem}
              onPress={() => handleOptionPress(option)}
              activeOpacity={0.7}
            >
              <View style={styles.optionLeft}>
                <View style={styles.iconContainer}>
                  <Ionicons name={option.icon} size={24} color="#3B82F6" />
                </View>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  {option.description && (
                    <Text style={styles.optionDescription}>
                      {option.description}
                    </Text>
                  )}
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Joykoly Academy v1.0.0
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
  optionsList: {
    paddingHorizontal: 20,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 8,
    borderRadius: Platform.OS === 'ios' ? 16 : 12,
    shadowColor: Platform.OS === 'ios' ? '#000' : '#000',
    shadowOffset: {
      width: 0,
      height: Platform.OS === 'ios' ? 2 : 1,
    },
    shadowOpacity: Platform.OS === 'ios' ? 0.1 : 0.05,
    shadowRadius: Platform.OS === 'ios' ? 8 : 2,
    elevation: Platform.OS === 'ios' ? 0 : 1,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: Platform.OS === 'ios' ? 12 : 20,
    backgroundColor: '#EBF4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
});
