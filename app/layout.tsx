import "@mantine/core/styles.css";
import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LiveUpdate24",
  description: "Real-time news updates with Mantine UI",

  verification: {
    google: "7yikhZH0y2BxhH8JMaKeXQ7ha9FYNC76Pa5RevQzx-0",
  },

  icons: {
    icon: "/i.png",
    shortcut: "/i.png",
    apple: "/i.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>

      <body className={inter.className}>
        <MantineProvider defaultColorScheme="light">
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
