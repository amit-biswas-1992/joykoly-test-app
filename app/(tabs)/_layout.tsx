import { Tabs, router, useRouter } from 'expo-router';
import { Platform, View, TouchableOpacity, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TabBarIcon } from '~/components/TabBarIcon';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const routerHook = useRouter();
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1E40AF',
        tabBarInactiveTintColor: '#CBD5E1',
        tabBarStyle: {
          position: 'absolute',
          bottom: -3,
          right: 16,
          left: 16,
          elevation: 0,
          height: Platform.OS === 'ios' ? 60 + insets.bottom : 60 + insets.bottom,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          paddingBottom: insets.bottom,
          borderRadius: 24,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 0,
          marginBottom: 0,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon 
              name="home" 
              color={focused ? '#1E40AF' : color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'Library',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon 
              name="book" 
              color={focused ? '#1E40AF' : color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="course"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#1E40AF',
              height: Platform.OS === 'ios' ? 50 : 60,
              width: Platform.OS === 'ios' ? 50 : 60,
              top: Platform.OS === 'ios' ? -10 : -20,
              borderRadius: Platform.OS === 'ios' ? 25 : 30,
              borderWidth: 3,
              borderColor: '#FFFFFF',
              shadowColor: '#1E40AF',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}>
              <TabBarIcon 
                name="graduation-cap" 
                color="white" 
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
            <TabBarIcon 
              name="shopping-bag" 
              color={focused ? '#1E40AF' : color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon 
              name="ellipsis-h" 
              color={focused ? '#1E40AF' : color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}
