import type { ComponentProps } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export type SubscriptionVectorIconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

type IconRule = {
  keywords: string[];
  icon: SubscriptionVectorIconName;
};

const iconRules: IconRule[] = [
  { keywords: ["netflix"], icon: "netflix" },
  { keywords: ["spotify"], icon: "spotify" },
  { keywords: ["github", "copilot"], icon: "github" },
  { keywords: ["dropbox"], icon: "dropbox" },
  { keywords: ["youtube"], icon: "youtube" },
  { keywords: ["apple", "icloud"], icon: "apple" },
  { keywords: ["google cloud", "gcp"], icon: "google-cloud" },
  { keywords: ["azure"], icon: "microsoft-azure" },
  { keywords: ["ai", "openai", "chatgpt", "claude", "robot"], icon: "robot" },
  { keywords: ["developer", "code", "dev", "api"], icon: "code-tags" },
  { keywords: ["design", "figma", "adobe", "canva"], icon: "palette" },
  { keywords: ["productivity", "notion", "workspace"], icon: "briefcase" },
  { keywords: ["cloud", "hosting", "server"], icon: "cloud" },
  { keywords: ["music", "audio", "podcast"], icon: "music" },
  { keywords: ["movie", "video", "stream", "entertainment"], icon: "movie-open" },
];

const categoryFallbacks: Record<string, SubscriptionVectorIconName> = {
  entertainment: "television-classic",
  "ai tools": "robot",
  "developer tools": "code-tags",
  design: "palette",
  productivity: "briefcase",
  cloud: "cloud",
  music: "music",
  other: "wallet",
};

export const resolveSubscriptionIcon = (
  name: string,
  category?: string,
): SubscriptionVectorIconName => {
  const normalizedName = name.trim().toLowerCase();
  const normalizedCategory = category?.trim().toLowerCase();
  const searchableText = `${normalizedName} ${normalizedCategory ?? ""}`;

  const matchedRule = iconRules.find((rule) =>
    rule.keywords.some((keyword) => searchableText.includes(keyword)),
  );

  if (matchedRule) return matchedRule.icon;
  if (normalizedCategory && categoryFallbacks[normalizedCategory]) {
    return categoryFallbacks[normalizedCategory];
  }

  return "wallet";
};
