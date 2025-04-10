import { Tabs } from "expo-router";
import { TamaguiProvider } from "tamagui";
import config from "@/tamagui.config";

import { Home, PieChart, Settings as Cog } from "@tamagui/lucide-icons";

export default function TabLayout() {
  return (
    <TamaguiProvider config={config}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "orange",
          tabBarStyle: {
            backgroundColor: "#0A0A0A",
            borderTopWidth: 0,
            paddingTop: 8,
            paddingBottom: 10,
            height: 60,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ color }) => <Home color={color} />,
            tabBarLabel: "Home",
          }}
        />
        <Tabs.Screen
          name="portfolio"
          options={{
            tabBarIcon: ({ color }) => <PieChart color={color} />,
            tabBarLabel: "Portfolio",
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            tabBarIcon: ({ color }) => <Cog color={color} />,
            tabBarLabel: "Settings",
          }}
        />
      </Tabs>
    </TamaguiProvider>
  );
}
