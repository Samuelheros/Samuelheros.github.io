import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "AI Agent Developer | Prompt Engineer (LLMs) | Marketing & Financial Markets Enthusiast",
  description: "Portfolio showcasing skills in AI Agent Development, Prompt Engineering, and Marketing",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>{children}</body>
    </html>
  )
}
