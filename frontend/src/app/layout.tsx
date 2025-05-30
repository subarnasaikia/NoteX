import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { CommandMenu } from "@/components/commandMenu";

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
            <Toaster richColors position="top-center" />
            <CommandMenu />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </>
  )
}



// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <>
//       <CommandMenu />
//       {children}
//     </>
//   );
// }
