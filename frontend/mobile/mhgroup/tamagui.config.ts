import { createTamagui } from "tamagui";
import { config as defaultConfig } from "@tamagui/config";

// Define your custom flat tokens for the light theme.
const customLightTokens = {
  amber10: "#F59E0B",
  green10: "#10B981",
  red10: "#EF4444",
  gray10: "#F3F4F6",
  backgroundStrong: "#1a1a1a", // Set to your desired dark color for light theme if needed
  fontSize1: 12,
  fontSize2: 14,
  fontSize3: 16,
  fontSize9: 36,
  fontSize10: 48,
};

// Define your custom flat tokens for the dark theme.
const customDarkTokens = {
  amber10: "#F59E0B",
  green10: "#10B981",
  red10: "#EF4444",
  gray10: "#F3F4F6",
  backgroundStrong: "#1a1a1a", // Dark background for the dark theme
  fontSize1: 12,
  fontSize2: 14,
  fontSize3: 16,
  fontSize9: 36,
  fontSize10: 48,
};

const tamaguiConfig = createTamagui({
  ...defaultConfig,
  themes: {
    ...defaultConfig.themes,
    light: {
      ...defaultConfig.themes.light,
      ...customLightTokens,
    },
    dark: {
      ...defaultConfig.themes.dark,
      ...customDarkTokens,
    },
  },
});

export type Conf = typeof tamaguiConfig;

declare module "tamagui" {
  interface TamaguiCustomConfig extends Conf {}
}

export default tamaguiConfig;
