import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Peblo Notes | AI-Powered Workspace",
  description: "A lightweight, collaborative, AI-powered notes workspace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="layout-container">
          {children}
        </div>
      </body>
    </html>
  );
}
