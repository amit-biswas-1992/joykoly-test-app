import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, Alert, Linking } from 'react-native';
import { Ionicons, MaterialIcons, AntDesign, Feather } from '@expo/vector-icons';
import { ProfileData, Purchase } from '~/types/profile';
import { userService } from '~/services/user.service';
import { ProfileCard } from '~/components/profile/ProfileCard';
import { ProfileAvatar } from '~/components/profile/ProfileAvatar';
import { SubjectBadge } from '~/components/profile/SubjectBadge';
import { AchievementCard } from '~/components/profile/AchievementCard';
import { AcademicRecordCard } from '~/components/profile/AcademicRecordCard';
import { Button } from '~/components/nativewindui/Button';
import { Container } from '~/components/Container';

export default function Profile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newGoal, setNewGoal] = useState('');

  // Available subjects - predefined list of common subjects in Bengali
  const availableSubjects = [
    { name: 'গণিত', nameEn: 'Mathematics' },
    { name: 'পদার্থবিজ্ঞান', nameEn: 'Physics' },
    { name: 'রসায়ন', nameEn: 'Chemistry' },
    { name: 'জীববিজ্ঞান', nameEn: 'Biology' },
    { name: 'বাংলা', nameEn: 'Bangla' },
    { name: 'ইংরেজি', nameEn: 'English' },
    { name: 'অর্থনীতি', nameEn: 'Economics' },
    { name: 'হিসাববিজ্ঞান', nameEn: 'Accounting' },
    { name: 'ব্যবসায় সংগঠন ও ব্যবস্থাপনা', nameEn: 'Business Organization & Management' },
    { name: 'ফিন্যান্স', nameEn: 'Finance' },
    { name: 'বিপণন', nameEn: 'Marketing' },
    { name: 'ইতিহাস', nameEn: 'History' },
    { name: 'ভূগোল', nameEn: 'Geography' },
    { name: 'পৌরনীতি ও সুশাসন', nameEn: 'Civics & Good Governance' },
    { name: 'সমাজকর্ম', nameEn: 'Social Work' },
    { name: 'সমাজবিজ্ঞান', nameEn: 'Sociology' },
    { name: 'মনোবিজ্ঞান', nameEn: 'Psychology' },
    { name: 'দর্শন', nameEn: 'Philosophy' },
    { name: 'ইসলামের ইতিহাস ও সংস্কৃতি', nameEn: 'Islamic History & Culture' },
    { name: 'যুক্তিবিদ্যা', nameEn: 'Logic' },
    { name: 'তথ্য ও যোগাযোগ প্রযুক্তি', nameEn: 'ICT' },
    { name: 'কৃষিশিক্ষা', nameEn: 'Agricultural Studies' },
    { name: 'গার্হস্থ্য বিজ্ঞান', nameEn: 'Home Science' }
  ];

  useEffect(() => {
    fetchProfile();
    fetchPurchases();
  }, []);

  const fetchProfile = async () => {
    try {
      const result = await userService.getProfile();
      if (result.success && result.data) {
        setProfile(result.data);
      } else {
        Alert.alert('ত্রুটি', result.error || 'প্রোফাইল লোড করতে সমস্যা হয়েছে');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('ত্রুটি', 'প্রোফাইল লোড করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const fetchPurchases = async () => {
    try {
      const result = await userService.getPurchases();
      if (result.success && result.data) {
        setPurchases(result.data);
      }
    } catch (error) {
      console.error('Error fetching purchases:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchProfile(), fetchPurchases()]);
    setRefreshing(false);
  };

  const handleAvatarChange = async (uri: string) => {
    if (!profile) return;
    
    try {
      // For now, just update local state
      // In a real app, you'd upload the image to server
      setProfile(prev => prev ? { ...prev, avatar: uri } : null);
      Alert.alert('সফল', 'প্রোফাইল ছবি আপডেট হয়েছে!');
    } catch (error) {
      console.error('Error updating avatar:', error);
      Alert.alert('ত্রুটি', 'প্রোফাইল ছবি আপডেট করতে সমস্যা হয়েছে');
    }
  };

  const addSubject = async () => {
    if (newSubject.trim() && profile) {
      try {
        const result = await userService.addFavoriteSubject(newSubject.trim());
        if (result.success) {
          setProfile(prev => prev ? {
            ...prev,
            favoriteSubjects: [...prev.favoriteSubjects, newSubject.trim()]
          } : null);
          setNewSubject('');
          Alert.alert('সফল', 'পছন্দের বিষয় যোগ করা হয়েছে!');
        } else {
          Alert.alert('ত্রুটি', result.error || 'বিষয় যোগ করতে সমস্যা হয়েছে');
        }
      } catch (error) {
        console.error('Error adding subject:', error);
        Alert.alert('ত্রুটি', 'বিষয় যোগ করতে সমস্যা হয়েছে');
      }
    }
  };

  const removeSubject = async (subject: string) => {
    if (profile) {
      try {
        const result = await userService.removeFavoriteSubject(subject);
        if (result.success) {
          setProfile(prev => prev ? {
            ...prev,
            favoriteSubjects: prev.favoriteSubjects.filter(s => s !== subject)
          } : null);
          Alert.alert('সফল', 'পছন্দের বিষয় সরানো হয়েছে!');
        } else {
          Alert.alert('ত্রুটি', result.error || 'বিষয় সরাতে সমস্যা হয়েছে');
        }
      } catch (error) {
        console.error('Error removing subject:', error);
        Alert.alert('ত্রুটি', 'বিষয় সরাতে সমস্যা হয়েছে');
      }
    }
  };

  const addGoal = async () => {
    if (newGoal.trim() && profile) {
      try {
        const result = await userService.addStudyGoal(newGoal.trim());
        if (result.success) {
          setProfile(prev => prev ? {
            ...prev,
            studyGoals: [...prev.studyGoals, newGoal.trim()]
          } : null);
          setNewGoal('');
          Alert.alert('সফল', 'লক্ষ্য যোগ করা হয়েছে!');
        } else {
          Alert.alert('ত্রুটি', result.error || 'লক্ষ্য যোগ করতে সমস্যা হয়েছে');
        }
      } catch (error) {
        console.error('Error adding goal:', error);
        Alert.alert('ত্রুটি', 'লক্ষ্য যোগ করতে সমস্যা হয়েছে');
      }
    }
  };

  const removeGoal = async (goal: string) => {
    if (profile) {
      try {
        const result = await userService.removeStudyGoal(goal);
        if (result.success) {
          setProfile(prev => prev ? {
            ...prev,
            studyGoals: prev.studyGoals.filter(g => g !== goal)
          } : null);
          Alert.alert('সফল', 'লক্ষ্য সরানো হয়েছে!');
        } else {
          Alert.alert('ত্রুটি', result.error || 'লক্ষ্য সরাতে সমস্যা হয়েছে');
        }
      } catch (error) {
        console.error('Error removing goal:', error);
        Alert.alert('ত্রুটি', 'লক্ষ্য সরাতে সমস্যা হয়েছে');
      }
    }
  };

  if (loading) {
    return (
      <Container>
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg text-gray-600">প্রোফাইল লোড হচ্ছে...</Text>
        </View>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container>
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg text-gray-600 mb-4">প্রোফাইল লোড করতে সমস্যা হয়েছে</Text>
          <Button onPress={fetchProfile}>
            <Text>আবার চেষ্টা করুন</Text>
          </Button>
        </View>
      </Container>
    );
  }

  return (
    <Container>
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">প্রোফাইল</Text>
          <Button
            variant="secondary"
            size="icon"
            onPress={() => {/* Navigate to settings */}}
          >
            <Ionicons name="settings-outline" size={20} color="#6B7280" />
          </Button>
        </View>

        {/* Profile Card */}
        <View className="mb-6">
          <ProfileCard 
            profile={profile} 
            onEdit={() => setEditing(!editing)}
          />
        </View>

        {/* About Section */}
        <View className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white">আমার সম্পর্কে</Text>
            <Button
              variant="secondary"
              size="icon"
              onPress={() => setEditing(!editing)}
            >
              <Feather name="edit-3" size={16} color="#6B7280" />
            </Button>
          </View>

          <View className="space-y-3">
            {profile.bio ? (
              <Text className="text-gray-700 dark:text-gray-300">{profile.bio}</Text>
            ) : (
              <Text className="text-gray-500 dark:text-gray-400 italic">
                নিজের সম্পর্কে কিছু লিখুন...
              </Text>
            )}
          </View>
        </View>

        {/* Study Goals */}
        <View className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="flag" size={20} color="#8B5CF6" />
              <Text className="text-lg font-semibold text-gray-900 dark:text-white">আমার লক্ষ্যসমূহ</Text>
            </View>
            <Button
              variant="secondary"
              size="icon"
              onPress={() => setEditing(!editing)}
            >
              <Feather name="edit-3" size={16} color="#6B7280" />
            </Button>
          </View>

          <View className="flex-row flex-wrap gap-2 mb-4">
            {profile.studyGoals.map((goal, index) => (
              <SubjectBadge
                key={index}
                subject={goal}
                variant="outline"
                onRemove={editing ? () => removeGoal(goal) : undefined}
                editable={editing}
              />
            ))}
          </View>

          {editing && (
            <View className="flex-row gap-2">
              <View className="flex-1">
                <Text className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  নতুন লক্ষ্য যোগ করুন
                </Text>
                <View className="flex-row gap-2">
                  <View className="flex-1">
                    <Text className="text-sm text-gray-700 dark:text-gray-300">
                      {newGoal || 'লক্ষ্য লিখুন...'}
                    </Text>
                  </View>
                  <Button
                    size="sm"
                    onPress={addGoal}
                    disabled={!newGoal.trim()}
                  >
                    <Ionicons name="add" size={16} color="white" />
                  </Button>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Favorite Subjects */}
        <View className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center gap-2">
              <Ionicons name="book-outline" size={20} color="#10B981" />
              <Text className="text-lg font-semibold text-gray-900 dark:text-white">পছন্দের বিষয়সমূহ</Text>
            </View>
            <Button
              variant="secondary"
              size="icon"
              onPress={() => setEditing(!editing)}
            >
              <Feather name="edit-3" size={16} color="#6B7280" />
            </Button>
          </View>

          <View className="flex-row flex-wrap gap-2 mb-4">
            {profile.favoriteSubjects.map((subject, index) => (
              <SubjectBadge
                key={index}
                subject={subject}
                variant="secondary"
                onRemove={editing ? () => removeSubject(subject) : undefined}
                editable={editing}
              />
            ))}
          </View>

          {editing && (
            <View className="space-y-3">
              <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
                উপলব্ধ বিষয়সমূহ
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {availableSubjects
                  .filter(subject => !profile.favoriteSubjects.includes(subject.name))
                  .slice(0, 6) // Show only first 6 to avoid overwhelming
                  .map((subject, index) => (
                    <Button
                      key={index}
                      variant="secondary"
                      size="sm"
                      onPress={() => {
                        if (profile) {
                          setProfile(prev => prev ? {
                            ...prev,
                            favoriteSubjects: [...prev.favoriteSubjects, subject.name]
                          } : null);
                        }
                      }}
                    >
                      <Ionicons name="add" size={14} color="#6B7280" />
                      <Text className="text-xs">{subject.name}</Text>
                    </Button>
                  ))}
              </View>
            </View>
          )}
        </View>

        {/* Academic History */}
        {profile.academicHistory.length > 0 && (
          <View className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <View className="flex-row items-center gap-2 mb-4">
              <Ionicons name="school-outline" size={20} color="#3B82F6" />
              <Text className="text-lg font-semibold text-gray-900 dark:text-white">একাডেমিক ইতিহাস</Text>
            </View>

            {profile.academicHistory.map((record) => (
              <AcademicRecordCard key={record.id} record={record} />
            ))}
          </View>
        )}

        {/* Achievements */}
        {profile.achievements.length > 0 && (
          <View className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <View className="flex-row items-center gap-2 mb-4">
              <Ionicons name="trophy-outline" size={20} color="#F59E0B" />
              <Text className="text-lg font-semibold text-gray-900 dark:text-white">ব্যক্তিগত অর্জনসমূহ</Text>
            </View>

            {profile.achievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </View>
        )}

        {/* Purchases */}
        <View className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <View className="flex-row items-center gap-2 mb-4">
            <Ionicons name="bag-outline" size={20} color="#EF4444" />
            <Text className="text-lg font-semibold text-gray-900 dark:text-white">আমার ক্রয়কৃত বিষয়সমূহ</Text>
          </View>

          {purchases.length === 0 ? (
            <Text className="text-gray-500 dark:text-gray-400 text-center py-4">
              আপনি এখনো কোনো কোর্স ক্রয় করেননি।
            </Text>
          ) : (
            <View className="space-y-3">
              {purchases.slice(0, 3).map((purchase) => (
                <View key={purchase.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                  <Text className="font-semibold text-gray-900 dark:text-white mb-1">
                    {purchase.itemDetails?.title || 'শিরোনাম পাওয়া যায়নি'}
                  </Text>
                  <Text className="text-sm text-gray-500 dark:text-gray-400">
                    ধরন: {purchase.itemType} | তারিখ: {new Date(purchase.purchaseDate).toLocaleDateString('bn-BD')}
                  </Text>
                </View>
              ))}
              {purchases.length > 3 && (
                <Text className="text-center text-primary text-sm">
                  আরও {purchases.length - 3}টি আইটেম দেখুন
                </Text>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </Container>
  );
}
