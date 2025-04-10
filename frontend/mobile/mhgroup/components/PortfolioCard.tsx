"use client";

import { useState, useEffect } from "react";
import { Bitcoin, Wallet } from "lucide-react-native";
import { Card, Text, XStack, YStack } from "tamagui";

export default function PortfolioCard() {
  const [btcAmount, setBtcAmount] = useState(0.0842);
  const [btcPrice, setBtcPrice] = useState(37245.82);
  const [value, setValue] = useState(btcAmount * btcPrice);
  const [priceChange, setPriceChange] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const fluctuation = (Math.random() - 0.5) * 100;
      const newPrice = btcPrice + fluctuation;
      const newChange = ((newPrice - btcPrice) / btcPrice) * 100;

      setBtcPrice(newPrice);
      setPriceChange(newChange);
      setValue(btcAmount * newPrice);
    }, 5000);

    return () => clearInterval(interval);
  }, [btcAmount, btcPrice]);

  return (
    <Card
      elevate
      bordered
      padding="$4"
      width="100%"
      maw={420}
      backgroundColor="$backgroundStrong"
    >
      <YStack space="$4">
        <XStack justifyContent="space-between" alignItems="center">
          <Text color="$gray10" fontSize="$2">
            Your Portfolio
          </Text>
          <Wallet size={28} color="#f59e0b" />
        </XStack>

        <XStack justifyContent="space-between">
          <YStack>
            <Text color="$gray10" fontSize="$1">
              Amount
            </Text>
            <XStack alignItems="center" gap="$2">
              <Bitcoin size={20} color="#f59e0b" />
              <Text fontSize="$7" fontWeight="800">
                {btcAmount.toFixed(4)}
              </Text>
            </XStack>
            <Text color="$gray10" fontSize="$1">
              BTC
            </Text>
          </YStack>

          <YStack>
            <Text color="$gray10" fontSize="$1">
              Value
            </Text>
            <Text fontSize="$7" fontWeight="800">
              ${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </Text>
            <Text color={priceChange >= 0 ? "green" : "red"} fontSize="$1">
              {priceChange >= 0 ? "+" : ""}
              {priceChange.toFixed(2)}% today
            </Text>
          </YStack>
        </XStack>

        <YStack>
          <XStack justifyContent="space-between">
            <Text color="$gray10" fontSize="$1">
              Current BTC Price
            </Text>
            <Text fontSize="$2" fontWeight="600">
              $
              {btcPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </Text>
          </XStack>

          <YStack mt="$2" h={6} bg="$gray4" br="$3" overflow="hidden">
            <YStack
              bg="$amber10"
              h="100%"
              br="$3"
              width={`${Math.min(100, Math.max(0, 50 + priceChange * 2))}%`}
              transition="width 300ms"
            />
          </YStack>
        </YStack>
      </YStack>
    </Card>
  );
}
