import type { Metadata } from "next";
import "./globals.css";
import { GardenConfigProvider } from "@/components/GardenConfigProvider";
import { Header } from "@/components/Header";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ClientProviders } from "@/components/ClientProviders";
import { getGardenConfig } from "@/lib/config";

export function generateMetadata(): Metadata {
  const { gardenName } = getGardenConfig();

  return {
    title: gardenName,
    description: "Track your plants, upload progress photos, and learn about gardening 🌱",
    icons: {
      icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌱</text></svg>",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = getGardenConfig();

  return (
    <html
      lang="en"
      data-theme={config.gardenTheme}
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-bg-page text-text-primary">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-text-on-primary focus:outline-none"
        >
          Skip to main content
        </a>
        <GardenConfigProvider config={config}>
          <ThemeProvider>
            <ClientProviders>
              <Header />
              <main id="main-content" className="mx-auto w-full max-w-6xl flex-1 px-3 py-4 sm:px-4 sm:py-6">
                {children}
              </main>
              <footer className="border-t border-border py-4 text-center text-sm text-text-secondary">
                🌱 {config.gardenName} &mdash; Happy Growing!
              </footer>
            </ClientProviders>
          </ThemeProvider>
        </GardenConfigProvider>
      </body>
    </html>
  );
}
