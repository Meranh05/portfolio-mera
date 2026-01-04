import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const inter = Inter({ subsets: ["latin", "vietnamese"] })
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" })

export const metadata: Metadata = {
  title: "DevProfile | Full Stack Developer Portfolio",
  description: "Portfolio của Full Stack Developer với kinh nghiệm xây dựng các ứng dụng web hiện đại",
  keywords: ["developer", "portfolio", "full stack", "react", "next.js", "web development"],
  authors: [{ name: "DevProfile" }],
  openGraph: {
    title: "DevProfile | Full Stack Developer Portfolio",
    description: "Portfolio của Full Stack Developer với kinh nghiệm xây dựng các ứng dụng web hiện đại",
    type: "website",
  },
    generator: 'v0.app'
}

export const viewport = {
  themeColor: "#06b6d4",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} ${jetbrainsMono.variable} font-sans antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
        <Toaster position="bottom-right" richColors />
        <Analytics />
      </body>
    </html>
  )
}
