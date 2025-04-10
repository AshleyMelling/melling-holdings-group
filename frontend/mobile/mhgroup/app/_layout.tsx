import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";

import { TamaguiProvider } from "tamagui";
import config from "@/tamagui.config"; // your Tamagui config

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  // Let React Navigation use dark or default theme:
  const navigationTheme = colorScheme === "dark" ? DarkTheme : DefaultTheme;

  // Let Tamagui pick the matching theme:
  const tamaguiTheme = colorScheme === "dark" ? "dark" : "light";

  return (
    <ThemeProvider value={navigationTheme}>
      <TamaguiProvider config={config} defaultTheme={tamaguiTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </TamaguiProvider>
    </ThemeProvider>
  );
}
