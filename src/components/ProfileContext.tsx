"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Profile } from "@/lib/types";

const STORAGE_KEY = "gardenProfileId";

interface ProfileContextValue {
  activeProfile: Profile | null;
  setActiveProfile: (profile: Profile | null) => void;
  profiles: Profile[];
  refreshProfiles: () => Promise<Profile[]>;
  isReady: boolean;
}

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

async function fetchProfiles(): Promise<Profile[]> {
  const response = await fetch("/api/profiles", { cache: "no-store" });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? "Failed to load profiles");
  }

  return (await response.json()) as Profile[];
}

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeProfile, setActiveProfileState] = useState<Profile | null>(null);
  const [isReady, setIsReady] = useState(false);

  const reconcileActiveProfile = useCallback(
    (nextProfiles: Profile[], preferredId: string | null) => {
      const matchedProfile = preferredId
        ? nextProfiles.find((profile) => profile.id === preferredId) ?? null
        : null;

      setActiveProfileState(matchedProfile);

      if (!matchedProfile && preferredId) {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    },
    [],
  );

  useEffect(() => {
    let cancelled = false;

    async function initializeProfiles() {
      try {
        const nextProfiles = await fetchProfiles();
        if (cancelled) {
          return;
        }

        setProfiles(nextProfiles);
        const storedProfileId = window.localStorage.getItem(STORAGE_KEY);
        reconcileActiveProfile(nextProfiles, storedProfileId);
      } catch (error) {
        console.error("Failed to initialize profiles:", error);
        if (!cancelled) {
          setProfiles([]);
          setActiveProfileState(null);
        }
      } finally {
        if (!cancelled) {
          setIsReady(true);
        }
      }
    }

    void initializeProfiles();

    return () => {
      cancelled = true;
    };
  }, [reconcileActiveProfile]);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (activeProfile) {
      window.localStorage.setItem(STORAGE_KEY, activeProfile.id);
      return;
    }

    window.localStorage.removeItem(STORAGE_KEY);
  }, [activeProfile, isReady]);

  const refreshProfiles = useCallback(async () => {
    const nextProfiles = await fetchProfiles();
    setProfiles(nextProfiles);

    const storedProfileId = window.localStorage.getItem(STORAGE_KEY);
    const preferredId = activeProfile?.id ?? storedProfileId;
    reconcileActiveProfile(nextProfiles, preferredId);

    return nextProfiles;
  }, [activeProfile?.id, reconcileActiveProfile]);

  const value = useMemo<ProfileContextValue>(
    () => ({
      activeProfile,
      setActiveProfile: setActiveProfileState,
      profiles,
      refreshProfiles,
      isReady,
    }),
    [activeProfile, profiles, refreshProfiles, isReady],
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const context = useContext(ProfileContext);

  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }

  return context;
}
