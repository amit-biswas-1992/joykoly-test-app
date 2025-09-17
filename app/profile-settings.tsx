import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, TextInput, Pressable } from 'react-native';
import { Ionicons, MaterialIcons, AntDesign, Feather } from '@expo/vector-icons';
import { ProfileData, ProfileUpdateData, Address } from '~/types/profile';
import { userService } from '~/services/user.service';
import { Button } from '~/components/nativewindui/Button';
import { Container } from '~/components/Container';
import { ProfileAvatar } from '~/components/profile/ProfileAvatar';
import { ThemeToggle } from '~/components/ThemeToggle';
import { useColorScheme } from '~/lib/useColorScheme';
import { router } from 'expo-router';

export default function ProfileSettings() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const { colorScheme, setColorScheme } = useColorScheme();
  const [themePreference, setThemePreference] = useState<'light' | 'dark' | 'system'>('light');

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [headline, setHeadline] = useState('');
  const [location, setLocation] = useState('');
  const [currentClass, setCurrentClass] = useState('');
  const [institution, setInstitution] = useState('');
  const [targetExam, setTargetExam] = useState('');
  const [batch, setBatch] = useState('');
  const [group, setGroup] = useState('');

  // Address management states
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [newAddress, setNewAddress] = useState({
    label: '',
    division: '',
    district: '',
    upazila: '',
    address: '',
    postalCode: ''
  });

  // Divisions and districts data (simplified)
  const divisions = [
    { value: 'dhaka', label: 'ঢাকা' },
    { value: 'chittagong', label: 'চট্টগ্রাম' },
    { value: 'rajshahi', label: 'রাজশাহী' },
    { value: 'khulna', label: 'খুলনা' },
    { value: 'barisal', label: 'বরিশাল' },
    { value: 'sylhet', label: 'সিলেট' },
    { value: 'rangpur', label: 'রংপুর' },
    { value: 'mymensingh', label: 'ময়মনসিংহ' },
  ];

  const districts = {
    dhaka: ['ঢাকা', 'গাজীপুর', 'নারায়ণগঞ্জ', 'মানিকগঞ্জ', 'মুন্সিগঞ্জ', 'রাজবাড়ী'],
    chittagong: ['চট্টগ্রাম', 'কক্সবাজার', 'রাঙ্গামাটি', 'বান্দরবান', 'খাগড়াছড়ি', 'ফেনী'],
    rajshahi: ['রাজশাহী', 'বগুড়া', 'পাবনা', 'নওগাঁ', 'নাটোর', 'চাঁপাইনবাবগঞ্জ'],
    khulna: ['খুলনা', 'বাগেরহাট', 'যশোর', 'সাতক্ষীরা', 'মেহেরপুর', 'কুষ্টিয়া'],
    barisal: ['বরিশাল', 'পটুয়াখালী', 'ভোলা', 'ঝালকাঠি', 'পিরোজপুর', 'বরগুনা'],
    sylhet: ['সিলেট', 'হবিগঞ্জ', 'মৌলভীবাজার', 'সুনামগঞ্জ'],
    rangpur: ['রংপুর', 'কুড়িগ্রাম', 'লালমনিরহাট', 'নীলফামারী', 'গাইবান্ধা', 'ঠাকুরগাঁও', 'পঞ্চগড়'],
    mymensingh: ['ময়মনসিংহ', 'জামালপুর', 'শেরপুর', 'নেত্রকোনা'],
  };

  const targetExams = [
    { value: 'hsc', label: 'HSC পরীক্ষা' },
    { value: 'university', label: 'বিশ্ববিদ্যালয় ভর্তি পরীক্ষা' },
    { value: 'engineering', label: 'ইঞ্জিনিয়ারিং ভর্তি পরীক্ষা' },
    { value: 'medical', label: 'মেডিকেল ভর্তি পরীক্ষা' },
    { value: 'job', label: 'চাকরির পরীক্ষা' },
    { value: 'ssc', label: 'SSC পরীক্ষা' },
  ];

  const batches = [
    { value: 'HSC24', label: 'HSC 24' },
    { value: 'HSC25', label: 'HSC 25' },
    { value: 'HSC26', label: 'HSC 26' },
    { value: 'HSC27', label: 'HSC 27' },
    { value: 'HSC28', label: 'HSC 28' },
    { value: 'SSC24', label: 'SSC 24' },
    { value: 'SSC25', label: 'SSC 25' },
    { value: 'SSC26', label: 'SSC 26' },
    { value: 'SSC27', label: 'SSC 27' },
    { value: 'SSC28', label: 'SSC 28' },
  ];

  const groups = [
    { value: 'science', label: 'বিজ্ঞান (Science)' },
    { value: 'humanities', label: 'মানবিক (Humanities/Arts)' },
    { value: 'commerce', label: 'ব্যবসায় শিক্ষা (Commerce)' },
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const result = await userService.getProfile();
      if (result.success && result.data) {
        const data = result.data;
        setProfile(data);
        
        // Populate form fields
        setFirstName(data.firstName || '');
        setLastName(data.lastName || '');
        setBio(data.bio || '');
        setHeadline(data.headline || '');
        setLocation(data.location || '');
        setCurrentClass(data.currentClass || '');
        setInstitution(data.institution || '');
        setTargetExam(data.targetExam || '');
        setBatch(data.batch || '');
        setGroup(data.group || '');
        setAddresses(data.addresses || []);
        
        // Load theme preference from profile
        if (data.preferences?.theme) {
          setThemePreference(data.preferences.theme);
          // Only set the actual color scheme if it's not 'system'
          if (data.preferences.theme !== 'system') {
            setColorScheme(data.preferences.theme);
          }
        }
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

  const handleSaveProfile = async () => {
    if (!profile) return;

    try {
      setSaving(true);
      
      const updatedData: ProfileUpdateData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        bio: bio.trim(),
        headline: headline.trim(),
        location: location.trim(),
        currentClass: currentClass.trim(),
        institution: institution.trim(),
        targetExam: targetExam.trim(),
        batch: batch.trim(),
        group: group.trim(),
        addresses: addresses,
        preferences: {
          ...profile.preferences,
          theme: themePreference
        }
      };
      
      const result = await userService.updateProfile(updatedData);
      
      if (result.success) {
        setProfile(result.data || profile);
        Alert.alert('সফল', 'প্রোফাইল সফলভাবে আপডেট হয়েছে!');
      } else {
        Alert.alert('ত্রুটি', result.error || 'প্রোফাইল আপডেট করতে সমস্যা হয়েছে');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('ত্রুটি', 'প্রোফাইল আপডেট করতে সমস্যা হয়েছে');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (uri: string) => {
    if (!profile) return;
    
    try {
      setProfile(prev => prev ? { ...prev, avatar: uri } : null);
      Alert.alert('সফল', 'প্রোফাইল ছবি আপডেট হয়েছে!');
    } catch (error) {
      console.error('Error updating avatar:', error);
      Alert.alert('ত্রুটি', 'প্রোফাইল ছবি আপডেট করতে সমস্যা হয়েছে');
    }
  };

  const addAddress = () => {
    if (!newAddress.label || !newAddress.division || !newAddress.district || !newAddress.address) {
      Alert.alert('ত্রুটি', 'অনুগ্রহ করে সকল প্রয়োজনীয় ক্ষেত্র পূরণ করুন');
      return;
    }

    const address: Address = {
      id: Date.now().toString(),
      ...newAddress,
      isPrimary: addresses.length === 0
    };

    setAddresses(prev => [...prev, address]);
    setNewAddress({
      label: '',
      division: '',
      district: '',
      upazila: '',
      address: '',
      postalCode: ''
    });
    Alert.alert('সফল', 'ঠিকানা যোগ করা হয়েছে!');
  };

  const removeAddress = (addressId: string) => {
    setAddresses(prev => prev.filter(addr => addr.id !== addressId));
    Alert.alert('সফল', 'ঠিকানা সরানো হয়েছে!');
  };

  const setPrimaryAddress = (addressId: string) => {
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      isPrimary: addr.id === addressId
    })));
    Alert.alert('সফল', 'প্রাথমিক ঠিকানা সেট করা হয়েছে!');
  };

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    setThemePreference(theme);
    if (theme !== 'system') {
      setColorScheme(theme);
    }
  };

  const filteredDistricts = newAddress.division
    ? districts[newAddress.division as keyof typeof districts] || []
    : [];

  if (loading) {
    return (
      <Container>
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg text-gray-600">লোড হচ্ছে...</Text>
        </View>
      </Container>
    );
  }

  return (
    <Container>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center gap-4 mb-6">
          <Button
            variant="secondary"
            size="icon"
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back-outline" size={20} color="#6B7280" />
          </Button>
          <View className="flex-1">
            <Text className="text-2xl font-bold text-gray-900 dark:text-white">প্রোফাইল সেটিংস</Text>
            <Text className="text-gray-600 dark:text-gray-400">আপনার প্রোফাইল তথ্য পরিবর্তন করুন</Text>
          </View>
        </View>

        {/* Avatar Section */}
        <View className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 shadow-sm border border-gray-200 dark:border-gray-700 items-center">
          <ProfileAvatar
            avatar={profile?.avatar}
            firstName={profile?.firstName}
            lastName={profile?.lastName}
            onAvatarChange={handleAvatarChange}
            size="lg"
            editable={true}
          />
        </View>

        {/* Tab Navigation */}
        <View className="flex-row bg-gray-100 dark:bg-gray-700 rounded-lg p-1 mb-6">
            {[
              { id: 'personal', label: 'ব্যক্তিগত', icon: 'person-outline' },
              { id: 'academic', label: 'একাডেমিক', icon: 'school-outline' },
              { id: 'address', label: 'ঠিকানা', icon: 'home-outline' },
              { id: 'theme', label: 'থিম', icon: 'color-palette-outline' as any },
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'primary' : 'secondary'}
                size="sm"
                className="flex-1"
                onPress={() => setActiveTab(tab.id)}
              >
                <Ionicons name={tab.icon} size={16} color={activeTab === tab.id ? 'white' : '#6B7280'} />
                <Text className={`text-sm ${activeTab === tab.id ? 'text-white' : 'text-gray-600'}`}>
                  {tab.label}
                </Text>
              </Button>
            ))}
        </View>

        {/* Personal Information Tab */}
        {activeTab === 'personal' && (
          <View className="space-y-6">
            <View className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">ব্যক্তিগত তথ্য</Text>
              
              <View className="space-y-4">
                <View className="flex-row gap-3">
                  <View className="flex-1">
                    <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">নাম *</Text>
                    <TextInput
                      value={firstName}
                      onChangeText={setFirstName}
                      placeholder="আপনার নাম"
                      className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">পদবি</Text>
                    <TextInput
                      value={lastName}
                      onChangeText={setLastName}
                      placeholder="আপনার পদবি"
                      className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700"
                    />
                  </View>
                </View>

                <View>
                  <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">হেডলাইন</Text>
                  <TextInput
                    value={headline}
                    onChangeText={setHeadline}
                    placeholder="যেমন: HSC Science Student"
                    className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700"
                  />
                </View>

                <View>
                  <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">বায়ো</Text>
                  <TextInput
                    value={bio}
                    onChangeText={setBio}
                    placeholder="নিজের সম্পর্কে কিছু লিখুন..."
                    multiline
                    numberOfLines={4}
                    className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700"
                    style={{ textAlignVertical: 'top' }}
                  />
                </View>

                <View className="flex-row gap-3">
                  <View className="flex-1">
                    <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      📍 অবস্থান
                    </Text>
                    <TextInput
                      value={location}
                      onChangeText={setLocation}
                      placeholder="যেমন: ঢাকা, বাংলাদেশ"
                      className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700"
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Academic Information Tab */}
        {activeTab === 'academic' && (
          <View className="space-y-6">
            <View className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">একাডেমিক তথ্য</Text>
              
              <View className="space-y-4">
                <View className="flex-row gap-3">
                  <View className="flex-1">
                    <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">বর্তমান ক্লাস</Text>
                    <TextInput
                      value={currentClass}
                      onChangeText={setCurrentClass}
                      placeholder="যেমন: HSC 1st Year"
                      className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ব্যাচ</Text>
                    <View className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700">
                      <Text className="text-gray-900 dark:text-white">
                        {batches.find(b => b.value === batch)?.label || 'ব্যাচ নির্বাচন করুন'}
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="flex-row gap-3">
                  <View className="flex-1">
                    <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">বিভাগ (Group)</Text>
                    <View className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700">
                      <Text className="text-gray-900 dark:text-white">
                        {groups.find(g => g.value === group)?.label || 'বিভাগ নির্বাচন করুন'}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">প্রতিষ্ঠান</Text>
                    <TextInput
                      value={institution}
                      onChangeText={setInstitution}
                      placeholder="আপনার কলেজ/স্কুলের নাম"
                      className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700"
                    />
                  </View>
                </View>

                <View>
                  <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">টার্গেট পরীক্ষা</Text>
                  <View className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700">
                    <Text className="text-gray-900 dark:text-white">
                      {targetExams.find(e => e.value === targetExam)?.label || 'টার্গেট পরীক্ষা নির্বাচন করুন'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Address Tab */}
        {activeTab === 'address' && (
          <View className="space-y-6">
            {/* Existing Addresses */}
            {addresses.length > 0 && (
              <View className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">আপনার ঠিকানাসমূহ</Text>
                
                <View className="space-y-4">
                  {addresses.map((address) => (
                    <View
                      key={address.id}
                      className={`border rounded-lg p-4 ${
                        address.isPrimary ? 'border-primary bg-primary/5' : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <View className="flex-row items-start justify-between">
                        <View className="flex-1">
                          <View className="flex-row items-center gap-2 mb-2">
                            <Text className="font-medium text-gray-900 dark:text-white">{address.label}</Text>
                            {address.isPrimary && (
                              <View className="bg-primary px-2 py-1 rounded">
                                <Text className="text-xs text-white">প্রাথমিক</Text>
                              </View>
                            )}
                          </View>
                          <Text className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            {address.address}
                          </Text>
                          <Text className="text-sm text-gray-600 dark:text-gray-400">
                            {address.upazila && `${address.upazila}, `}
                            {address.district}, {divisions.find(d => d.value === address.division)?.label}
                            {address.postalCode && ` - ${address.postalCode}`}
                          </Text>
                        </View>
                        <View className="flex-row gap-2">
                          {!address.isPrimary && (
                            <Button
                              variant="secondary"
                              size="sm"
                              onPress={() => setPrimaryAddress(address.id)}
                            >
                              <Text className="text-xs">প্রাথমিক</Text>
                            </Button>
                          )}
                          <Button
                            variant="secondary"
                            size="sm"
                            onPress={() => removeAddress(address.id)}
                          >
                            <Text className="text-xs text-red-600">সরান</Text>
                          </Button>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Add New Address */}
            <View className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">নতুন ঠিকানা যোগ করুন</Text>
              
              <View className="space-y-4">
                <View>
                  <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ঠিকানার ধরন *</Text>
                  <View className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700">
                    <Text className="text-gray-900 dark:text-white">
                      {newAddress.label || 'ঠিকানার ধরন নির্বাচন করুন'}
                    </Text>
                  </View>
                </View>

                <View className="flex-row gap-3">
                  <View className="flex-1">
                    <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">বিভাগ *</Text>
                    <View className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700">
                      <Text className="text-gray-900 dark:text-white">
                        {divisions.find(d => d.value === newAddress.division)?.label || 'বিভাগ নির্বাচন করুন'}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">জেলা *</Text>
                    <View className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700">
                      <Text className="text-gray-900 dark:text-white">
                        {newAddress.district || 'জেলা নির্বাচন করুন'}
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="flex-row gap-3">
                  <View className="flex-1">
                    <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">উপজেলা/থানা</Text>
                    <TextInput
                      value={newAddress.upazila}
                      onChangeText={(text) => setNewAddress(prev => ({ ...prev, upazila: text }))}
                      placeholder="উপজেলা/থানার নাম"
                      className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">পোস্টাল কোড</Text>
                    <TextInput
                      value={newAddress.postalCode}
                      onChangeText={(text) => setNewAddress(prev => ({ ...prev, postalCode: text }))}
                      placeholder="পোস্টাল কোড"
                      className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700"
                    />
                  </View>
                </View>

                <View>
                  <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">সম্পূর্ণ ঠিকানা *</Text>
                  <TextInput
                    value={newAddress.address}
                    onChangeText={(text) => setNewAddress(prev => ({ ...prev, address: text }))}
                    placeholder="বাড়ি/ফ্ল্যাট নম্বর, রাস্তার নাম, এলাকার নাম..."
                    multiline
                    numberOfLines={3}
                    className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700"
                    style={{ textAlignVertical: 'top' }}
                  />
                </View>

                <Button onPress={addAddress}>
                  <Text className="text-white">ঠিকানা যোগ করুন</Text>
                </Button>
              </View>
            </View>
          </View>
        )}

        {/* Theme Settings Tab */}
        {activeTab === 'theme' && (
          <View className="space-y-6">
            <View className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">থিম সেটিংস</Text>
              
              <View className="space-y-6">
                {/* Current Theme Display */}
                <View className="flex-row items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <View className="flex-row items-center gap-3">
                    <View className="w-10 h-10 bg-primary rounded-full items-center justify-center">
                      <Ionicons 
                        name={
                          themePreference === 'dark' ? 'moon' : 
                          themePreference === 'light' ? 'sunny' : 
                          'phone-portrait'
                        } 
                        size={20} 
                        color="white" 
                      />
                    </View>
                    <View>
                      <Text className="text-base font-medium text-gray-900 dark:text-white">
                        {themePreference === 'dark' ? 'ডার্ক থিম' : 
                         themePreference === 'light' ? 'লাইট থিম' : 
                         'সিস্টেম থিম'}
                      </Text>
                      <Text className="text-sm text-gray-600 dark:text-gray-400">
                        বর্তমানে সক্রিয় থিম
                      </Text>
                    </View>
                  </View>
                  <ThemeToggle />
                </View>

                {/* Theme Options */}
                <View className="space-y-3">
                  <Text className="text-base font-medium text-gray-900 dark:text-white mb-3">
                    থিম নির্বাচন করুন
                  </Text>
                  
                  {/* Light Theme Option */}
                  <Pressable
                    onPress={() => handleThemeChange('light')}
                    className={`flex-row items-center justify-between p-4 rounded-lg border-2 ${
                      themePreference === 'light' 
                        ? 'border-primary bg-primary/5' 
                        : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700'
                    }`}
                  >
                    <View className="flex-row items-center gap-3">
                      <View className="w-8 h-8 bg-yellow-400 rounded-full items-center justify-center">
                        <Ionicons name="sunny" size={16} color="white" />
                      </View>
                      <View>
                        <Text className="text-base font-medium text-gray-900 dark:text-white">
                          লাইট থিম
                        </Text>
                        <Text className="text-sm text-gray-600 dark:text-gray-400">
                          উজ্জ্বল এবং পরিষ্কার ইন্টারফেস
                        </Text>
                      </View>
                    </View>
                    {themePreference === 'light' && (
                      <Ionicons name="checkmark-circle" size={20} color="#0F172A" />
                    )}
                  </Pressable>

                  {/* Dark Theme Option */}
                  <Pressable
                    onPress={() => handleThemeChange('dark')}
                    className={`flex-row items-center justify-between p-4 rounded-lg border-2 ${
                      themePreference === 'dark' 
                        ? 'border-primary bg-primary/5' 
                        : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700'
                    }`}
                  >
                    <View className="flex-row items-center gap-3">
                      <View className="w-8 h-8 bg-indigo-600 rounded-full items-center justify-center">
                        <Ionicons name="moon" size={16} color="white" />
                      </View>
                      <View>
                        <Text className="text-base font-medium text-gray-900 dark:text-white">
                          ডার্ক থিম
                        </Text>
                        <Text className="text-sm text-gray-600 dark:text-gray-400">
                          চোখের জন্য আরামদায়ক এবং শক্তি সাশ্রয়ী
                        </Text>
                      </View>
                    </View>
                    {themePreference === 'dark' && (
                      <Ionicons name="checkmark-circle" size={20} color="#0F172A" />
                    )}
                  </Pressable>

                  {/* System Theme Option */}
                  <Pressable
                    onPress={() => handleThemeChange('system')}
                    className={`flex-row items-center justify-between p-4 rounded-lg border-2 ${
                      themePreference === 'system' 
                        ? 'border-primary bg-primary/5' 
                        : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700'
                    }`}
                  >
                    <View className="flex-row items-center gap-3">
                      <View className="w-8 h-8 bg-gray-600 rounded-full items-center justify-center">
                        <Ionicons name="phone-portrait" size={16} color="white" />
                      </View>
                      <View>
                        <Text className="text-base font-medium text-gray-900 dark:text-white">
                          সিস্টেম থিম
                        </Text>
                        <Text className="text-sm text-gray-600 dark:text-gray-400">
                          ডিভাইসের সেটিংস অনুযায়ী থিম পরিবর্তন
                        </Text>
                      </View>
                    </View>
                    {themePreference === 'system' && (
                      <Ionicons name="checkmark-circle" size={20} color="#0F172A" />
                    )}
                  </Pressable>
                </View>

                {/* Theme Information */}
                <View className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <View className="flex-row items-start gap-3">
                    <Ionicons name="information-circle" size={20} color="#3B82F6" />
                    <View className="flex-1">
                      <Text className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                        থিম সম্পর্কে
                      </Text>
                      <Text className="text-sm text-blue-800 dark:text-blue-200">
                        আপনার পছন্দের থিম নির্বাচন করুন। ডার্ক থিম চোখের জন্য আরামদায়ক এবং ব্যাটারি সাশ্রয়ী, 
                        অন্যদিকে লাইট থিম উজ্জ্বল এবং পরিষ্কার ইন্টারফেস প্রদান করে।
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Save Button */}
        <View className="mt-6 mb-8">
          <Button onPress={handleSaveProfile} disabled={saving}>
            <Ionicons name="save-outline" size={20} color="white" />
            <Text className="text-white ml-2">
              {saving ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}
            </Text>
          </Button>
        </View>
      </ScrollView>
    </Container>
  );
}
