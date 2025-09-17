import { Tabs, router } from 'expo-router';
import { Platform, View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TabBarIcon } from '~/components/TabBarIcon';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#6366F1',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: Platform.OS === 'ios' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.98)',
          borderTopWidth: 0,
          height: Platform.OS === 'ios' ? 100 + insets.bottom : 72 + insets.bottom,
          paddingBottom: Platform.OS === 'ios' ? 34 + insets.bottom : 12 + insets.bottom,
          paddingTop: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -6 },
          shadowOpacity: 0.1,
          shadowRadius: 20,
          elevation: 12,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          position: 'absolute',
        },
        tabBarBackground: () => (
          <View style={{ flex: 1, position: 'relative' }}>
            {/* Floating Action Button */}
            <TouchableOpacity
              style={{
                position: 'absolute',
                top: -32,
                left: '50%',
                marginLeft: -32,
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: '#6366F1',
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
                zIndex: 1000,
              }}
              onPress={() => {
                router.push('/(tabs)/course');
              }}
            >
              <TabBarIcon name="graduation-cap" color="white" />
            </TouchableOpacity>
          </View>
        ),
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              backgroundColor: focused ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
              borderRadius: 12,
              padding: 6,
            }}>
              <TabBarIcon 
                name="home" 
                color={focused ? '#6366F1' : color} 
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'Library',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              backgroundColor: focused ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
              borderRadius: 12,
              padding: 6,
            }}>
              <TabBarIcon 
                name="book" 
                color={focused ? '#6366F1' : color} 
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="books"
        options={{
          title: 'Books',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              backgroundColor: focused ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
              borderRadius: 12,
              padding: 6,
            }}>
              <TabBarIcon 
                name="bookmark" 
                color={focused ? '#6366F1' : color} 
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="course"
        options={{
          href: null, // Hide from tab bar since we have FAB
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              backgroundColor: focused ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
              borderRadius: 12,
              padding: 6,
            }}>
              <TabBarIcon 
                name="bars" 
                color={focused ? '#6366F1' : color} 
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
