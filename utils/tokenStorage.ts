import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useSecure = true; // toggle if needed

export async function saveToken(key: string, value: string) {
  if (useSecure) {
    await SecureStore.setItemAsync(key, value, {
      keychainService: key, // iOS
      requireAuthentication: false, // set true if FaceID/TouchID required
    });
  } else {
    await AsyncStorage.setItem(key, value);
  }
}

export async function getToken(key: string) {
  return useSecure
    ? await SecureStore.getItemAsync(key)
    : await AsyncStorage.getItem(key);
}

export async function deleteToken(key: string) {
  if (useSecure) {
    await SecureStore.deleteItemAsync(key);
  } else {
    await AsyncStorage.removeItem(key);
  }
}
