import { Stack } from 'expo-router';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const fill = { flex: 1 };

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={fill}>
        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
