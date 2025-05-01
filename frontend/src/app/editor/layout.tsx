import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: "NoteX Editor",
  description: "AI note taking app editor.",
};

export default function EditorLayout({ children }: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="min-h-screen bg-background">
        {children}
      </div>
    </ThemeProvider>
  )
}