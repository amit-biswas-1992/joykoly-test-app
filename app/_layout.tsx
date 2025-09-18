import '../global.css';
import 'expo-dev-client';
import { ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { useEffect } from 'react';

import { ActionSheetProvider } from '@expo/react-native-action-sheet';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ThemeToggle } from '~/components/ThemeToggle';
import { useColorScheme, useInitialAndroidBarSync } from '~/lib/useColorScheme';
import { NAV_THEME } from '~/theme';
import { initializeStaticToken } from '~/utils/initializeToken';

// Set the animation options. This is optional.
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

SplashScreen.preventAutoHideAsync();

export {
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  useInitialAndroidBarSync();
  const { colorScheme, isDarkColorScheme } = useColorScheme();

  useEffect(() => {
    initializeStaticToken();
    
    const hideSplashScreen = async () => {
      try {
        await SplashScreen.hideAsync();
      } catch (error) {
        console.warn('Error hiding splash screen:', error);
      }
    };

    // Hide splash screen after a short delay to ensure app is ready
    const timer = setTimeout(hideSplashScreen, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <StatusBar
        key={`root-status-bar-${isDarkColorScheme ? 'light' : 'dark'}`}
        style={isDarkColorScheme ? 'light' : 'dark'}
      />
      {/* WRAP YOUR APP WITH ANY ADDITIONAL PROVIDERS HERE */}
      {/* <ExampleProvider> */}

      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <ActionSheetProvider>
              <NavThemeProvider value={NAV_THEME[colorScheme]}>
                <Stack screenOptions={SCREEN_OPTIONS}>
                  <Stack.Screen name="(tabs)" options={TABS_OPTIONS} />
                  <Stack.Screen name="modal" options={MODAL_OPTIONS} />
                  <Stack.Screen name="course/[id]" options={{ headerShown: false }} />
                  <Stack.Screen name="courses" options={{ headerShown: false }} />
                  <Stack.Screen name="exam/[id]" options={{ headerShown: false }} />
                  <Stack.Screen name="exams" options={{ headerShown: false }} />
                  <Stack.Screen name="exams/[id]/leaderboard" options={{ headerShown: false }} />
                  <Stack.Screen name="exams/[id]/submissions" options={{ headerShown: false }} />
                  <Stack.Screen name="profile" options={{ headerShown: false }} />
                  <Stack.Screen name="profile-settings" options={{ headerShown: false }} />
                </Stack>
              </NavThemeProvider>
            </ActionSheetProvider>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>

      {/* </ExampleProvider> */}
    </>
  );
}

const SCREEN_OPTIONS = {
  animation: 'ios_from_right', // for android
} as const;

const TABS_OPTIONS = {
  headerShown: false,
} as const;

const MODAL_OPTIONS = {
  presentation: 'modal',
  animation: 'fade_from_bottom', // for android
  title: 'Settings',
  headerRight: () => <ThemeToggle />,
} as const;
