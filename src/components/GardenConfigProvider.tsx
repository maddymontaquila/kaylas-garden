"use client";

import { createContext, useContext } from "react";
import type { GardenConfig } from "@/lib/config";

const defaultGardenConfig: GardenConfig = {
  gardenName: "My Garden",
  gardenTheme: "green",
  ownerName: "",
};

const GardenConfigContext = createContext<GardenConfig>(defaultGardenConfig);

export function GardenConfigProvider({
  children,
  config,
}: {
  readonly children: React.ReactNode;
  readonly config: GardenConfig;
}) {
  return (
    <GardenConfigContext.Provider value={config}>
      {children}
    </GardenConfigContext.Provider>
  );
}

export function useGardenConfig(): GardenConfig {
  return useContext(GardenConfigContext);
}
