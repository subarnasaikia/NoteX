import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: "NoteX",
  description: "AI note taking app.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-svh flex items-center justify-center p-4">
            <div className="w-full max-w-xs">{children}</div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
