import { View, Text, ScrollView } from "tamagui";
import BitcoinPriceCard from "@/components/BitcoinPriceCard";
import PortfolioCard from "@/components/PortfolioCard";
import QuickActions from "@/components/QuickActions";

export default function HomeScreen() {
  return (
    <ScrollView>
      <View padding="$4" space="$4">
        <Text fontSize="$9" fontWeight="700">
          Bitcoin Wallet
        </Text>

        <BitcoinPriceCard />

        <PortfolioCard />

        <QuickActions />
      </View>
    </ScrollView>
  );
}
