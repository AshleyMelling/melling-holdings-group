import { View, ScrollView, YStack } from "tamagui";
import { PortfolioHeader } from "@/components/PortfolioHeader";
import { PortfolioList } from "@/components/PortfolioList";

export default function PortfolioScreen() {
  return (
    <ScrollView>
      <YStack padding="$4" space="$4">
        <PortfolioHeader />
        <PortfolioList />
      </YStack>
    </ScrollView>
  );
}
