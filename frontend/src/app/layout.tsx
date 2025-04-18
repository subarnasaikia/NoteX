import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css";


export const metadata: Metadata = {
  title: "NoteX",
  description: "AI note taking app.",
};



export default function RootLayout({ children }: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </>
  )
}
