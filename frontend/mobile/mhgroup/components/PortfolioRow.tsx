import { Card, XStack, YStack, Text, Image } from "tamagui";

export function PortfolioRow({ asset }: { asset: any }) {
  const value = asset.amount * asset.price;

  return (
    <Card elevate bordered padding="$3">
      <XStack jc="space-between" ai="center">
        <XStack ai="center" space="$3">
          <Image
            source={{
              uri: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
            }}
            width={32}
            height={32}
            style={{ borderRadius: 16 }}
          />
          <YStack>
            <Text fontWeight="600">{asset.name}</Text>
            <Text color="$gray10">
              {asset.amount} {asset.symbol}
            </Text>
          </YStack>
        </XStack>

        <Text fontWeight="700">${value.toLocaleString()}</Text>
      </XStack>
    </Card>
  );
}
