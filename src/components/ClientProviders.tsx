"use client";

import { ProfilePicker } from "./ProfilePicker";
import { ProfileProvider } from "./ProfileContext";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ProfileProvider>
      {children}
      <ProfilePicker />
    </ProfileProvider>
  );
}
