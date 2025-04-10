import { Card, Text, YStack } from "tamagui";

export function PortfolioHeader() {
  const btcAmount = 0.0842;
  const btcPrice = 37245.82;
  const totalValue = btcAmount * btcPrice;

  return (
    <Card elevate bordered padding="$4">
      <YStack space="$2">
        <Text fontSize="$6" color="$gray10">
          Total Holdings
        </Text>

        <Text fontSize="$9" fontWeight="700">
          ${totalValue.toLocaleString()}
        </Text>

        <Text fontSize="$6" color="$gray10">
          {btcAmount} BTC
        </Text>
      </YStack>
    </Card>
  );
}
