import { useState, useEffect } from "react";
import { Card, YStack, XStack, Text, Button, Spinner } from "tamagui";
import { Bitcoin, ArrowUp, ArrowDown } from "lucide-react-native";

export default function BitcoinPriceCard() {
  const [price, setPrice] = useState(37245.82);
  const [change, setChange] = useState(2.34);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const fluctuation = (Math.random() - 0.5) * 100;
      const newPrice = price + fluctuation;
      const newChange = change + (Math.random() - 0.5) * 0.2;

      setPrice(newPrice);
      setChange(newChange);
    }, 5000);

    return () => clearInterval(interval);
  }, [price, change]);

  const refreshPrice = () => {
    setIsLoading(true);
    setTimeout(() => {
      const fluctuation = (Math.random() - 0.5) * 200;
      const newPrice = price + fluctuation;
      const newChange = change + (Math.random() - 0.5) * 0.5;

      setPrice(newPrice);
      setChange(newChange);
      setIsLoading(false);
    }, 800);
  };

  return (
    <Card
      elevate
      bordered
      padding="$4"
      width="100%"
      maw={420}
      bg="$backgroundStrong" // use the shorthand prop for background
    >
      <YStack space="$4">
        <XStack jc="space-between" ai="center">
          <Text fontSize="$3" color="$gray10">
            Bitcoin
          </Text>
          <Bitcoin color="orange" size={28} />
        </XStack>

        <Text fontSize="$9" fontWeight="800">
          ${price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </Text>

        <XStack ai="center" jc="space-between">
          <XStack
            px="$2"
            py="$1"
            br="$3"
            ai="center"
            space="$1.5"
            bg={change >= 0 ? "$green10Light" : "$red10Light"}
          >
            {change >= 0 ? (
              <ArrowUp size={14} color="green" />
            ) : (
              <ArrowDown size={14} color="red" />
            )}
            <Text
              fontSize="$2"
              color={change >= 0 ? "green" : "red"}
              fontWeight="600"
            >
              {Math.abs(change).toFixed(2)}%
            </Text>
          </XStack>

          <Button
            size="$2"
            variant="outlined"
            onPress={refreshPrice}
            disabled={isLoading}
          >
            {isLoading ? <Spinner size="small" color="$gray10" /> : "Refresh"}
          </Button>
        </XStack>
      </YStack>
    </Card>
  );
}
