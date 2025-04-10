import { YStack } from "tamagui";
import { PortfolioRow } from "./PortfolioRow";

export function PortfolioList() {
  const assets = [
    {
      name: "Bitcoin",
      symbol: "BTC",
      amount: 0.0842,
      price: 37245.82,
    },
  ];

  return (
    <YStack space="$2">
      {assets.map((asset, idx) => (
        <PortfolioRow key={idx} asset={asset} />
      ))}
    </YStack>
  );
}
