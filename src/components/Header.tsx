"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGardenConfig } from "./GardenConfigProvider";
import { useProfile } from "./ProfileContext";
import { ThemeSwitcher } from "./ThemeSwitcher";

const navLinks = [
  { href: "/", label: "My Plants" },
  { href: "/library", label: "Plant Library" },
  { href: "/settings", label: "Settings" },
];

export function Header() {
  const pathname = usePathname();
  const { gardenName } = useGardenConfig();
  const { activeProfile, setActiveProfile } = useProfile();

  return (
    <header className="bg-bg-header shadow-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-3 gap-y-2 px-3 py-3 sm:px-4">
        <Link href="/" aria-label={`${gardenName} – Home`} className="flex items-center gap-2">
          <span aria-hidden="true" className="text-2xl">🌱</span>
          <span className="text-lg font-bold text-text-on-primary sm:text-xl">
            {gardenName}
          </span>
        </Link>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 sm:gap-4">
          <nav aria-label="Main navigation" className="flex flex-wrap items-center gap-x-3 gap-y-1 sm:gap-4">
            {navLinks.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className={`text-sm transition-colors rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                    isActive
                      ? "font-semibold text-text-on-primary underline underline-offset-4"
                      : "font-medium text-text-on-primary/90 hover:text-text-on-primary hover:underline hover:underline-offset-4"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
          {activeProfile && (
            <div className="flex items-center gap-2 rounded-full bg-white/12 px-3 py-1.5 text-sm text-text-on-primary shadow-sm">
              <span aria-hidden="true" className="text-base">{activeProfile.avatarEmoji}</span>
              <span className="font-medium">{activeProfile.name}</span>
              <button
                type="button"
                onClick={() => setActiveProfile(null)}
                className="rounded-full border border-white/25 px-2 py-0.5 text-xs font-semibold text-text-on-primary/90 transition hover:bg-white/10"
              >
                Switch
              </button>
            </div>
          )}
          <div
            className="border-l border-white/20 pl-3 sm:ml-2"
            role="group"
            aria-label="Theme selection"
          >
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
