export type GardenTheme = "green" | "earth" | "ocean";

export interface GardenConfig {
  gardenName: string;
  gardenTheme: GardenTheme;
  ownerName: string;
}

/**
 * Reads garden config from environment variables set by Aspire parameters.
 * Parameters have no defaults — Aspire will prompt for them in the dashboard
 * before the web resource starts.
 */
export function getGardenConfig(): GardenConfig {
  return {
    gardenName: process.env.GARDEN_NAME || "My Garden",
    gardenTheme: (process.env.GARDEN_THEME || "green") as GardenTheme,
    ownerName: process.env.OWNER_NAME || "",
  };
}
