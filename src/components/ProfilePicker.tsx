"use client";

import { useState, type FormEvent } from "react";
import type { Profile } from "@/lib/types";
import { useProfile } from "./ProfileContext";

const EMOJI_OPTIONS = ["🧑‍🌾", "👩‍🌾", "👨‍🌾", "🌻", "🌸", "🌿", "🍅"] as const;

export function ProfilePicker() {
  const { activeProfile, setActiveProfile, profiles, refreshProfiles, isReady } =
    useProfile();
  const [name, setName] = useState("");
  const [avatarEmoji, setAvatarEmoji] = useState<string>(EMOJI_OPTIONS[0]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isReady || activeProfile) {
    return null;
  }

  const handleSelectProfile = (profile: Profile) => {
    setError(null);
    setActiveProfile(profile);
  };

  const handleCreateProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Please give the profile a name.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          avatarEmoji,
        }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? "Failed to create profile");
      }

      const createdProfile = (await response.json()) as Profile;
      const nextProfiles = await refreshProfiles();
      const matchingProfile =
        nextProfiles.find((profile) => profile.id === createdProfile.id) ?? createdProfile;

      setName("");
      setAvatarEmoji(EMOJI_OPTIONS[0]);
      setActiveProfile(matchingProfile);
    } catch (creationError) {
      const message =
        creationError instanceof Error
          ? creationError.message
          : "Something went wrong while creating the profile.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/35 backdrop-blur-[2px]" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-picker-title"
        className="relative z-10 flex max-h-[calc(100dvh-2rem)] w-full max-w-3xl flex-col gap-6 overflow-y-auto rounded-[2rem] border border-border bg-bg-card/95 p-5 shadow-2xl sm:p-8"
      >
        <div className="space-y-2 text-center sm:text-left">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Household profiles
          </p>
          <h2 id="profile-picker-title" className="text-2xl font-bold text-text-primary">
            Who&apos;s gardening today?
          </h2>
          <p className="text-sm text-text-secondary sm:text-base">
            Pick your profile to personalize the garden, or create one for a new household
            member.
          </p>
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
          <section className="space-y-3 rounded-3xl border border-border bg-bg-page/70 p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-text-primary">Choose a profile</h3>
              <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-text-primary">
                {profiles.length} saved
              </span>
            </div>

            {profiles.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {profiles.map((profile) => (
                  <button
                    key={profile.id}
                    type="button"
                    onClick={() => handleSelectProfile(profile)}
                    className="flex items-center gap-3 rounded-2xl border border-border bg-bg-card px-4 py-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-2xl shadow-sm">
                      {profile.avatarEmoji}
                    </span>
                    <span>
                      <span className="block text-base font-semibold text-text-primary">
                        {profile.name}
                      </span>
                      <span className="block text-sm text-text-secondary">Tap to continue</span>
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-bg-card px-4 py-6 text-center text-sm text-text-secondary">
                No profiles yet — create the first one to get started.
              </div>
            )}
          </section>

          <section className="rounded-3xl border border-border bg-bg-page/70 p-4 shadow-sm sm:p-5">
            <form onSubmit={handleCreateProfile} className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-text-primary">Create profile</h3>
                <p className="text-sm text-text-secondary">
                  Add a name and choose a garden-inspired avatar.
                </p>
              </div>

              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-text-secondary">Name</span>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g. Kayla"
                  maxLength={40}
                  className="w-full rounded-2xl border border-border bg-bg-card px-3 py-2.5 text-text-primary placeholder:text-text-secondary/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </label>

              <fieldset className="space-y-2">
                <legend className="text-sm font-medium text-text-secondary">Avatar</legend>
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-3">
                  {EMOJI_OPTIONS.map((emoji) => {
                    const isSelected = avatarEmoji === emoji;
                    return (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setAvatarEmoji(emoji)}
                        aria-pressed={isSelected}
                        className={`flex h-12 items-center justify-center rounded-2xl border text-2xl transition ${
                          isSelected
                            ? "border-primary bg-primary text-text-on-primary shadow-md"
                            : "border-border bg-bg-card text-text-primary hover:border-primary hover:bg-hover"
                        }`}
                      >
                        <span aria-hidden="true">{emoji}</span>
                        <span className="sr-only">Choose {emoji} avatar</span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-text-on-primary shadow-md transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? "Creating..." : "Create Profile"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
