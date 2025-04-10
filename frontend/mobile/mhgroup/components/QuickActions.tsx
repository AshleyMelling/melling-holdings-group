import React from "react";
import { Wallet, Clock, Settings } from "lucide-react-native";
import { Button, XStack, YStack, Text } from "tamagui";

export default function QuickActions() {
  return (
    <YStack width="100%" maxWidth={400} py="$4" px="$3">
      <XStack justifyContent="space-around" alignItems="center">
        <Action icon={<Wallet size={24} color="orange" />} label="Wallet" />
        <Action icon={<Clock size={24} color="orange" />} label="History" />
        <Action icon={<Settings size={24} color="orange" />} label="Settings" />
      </XStack>
    </YStack>
  );
}

interface ActionProps {
  icon: React.ReactNode;
  label: string;
}

const Action = ({ icon, label }: ActionProps) => (
  <YStack alignItems="center" space="$2">
    <Button
      circular
      bordered
      size="$5"
      bg="$background"
      borderColor="$gray8"
      pressStyle={{
        borderColor: "$amber8",
        bg: "$backgroundHover",
      }}
    >
      {icon}
    </Button>
    <Text fontSize="$2" color="$gray10" fontWeight="600">
      {label}
    </Text>
  </YStack>
);
