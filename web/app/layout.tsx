import type { Metadata } from "next";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import "./globals.css";

export const metadata: Metadata = {
  title: "WihGo AI — AI Business Memory & Attention",
  description: "Initial working local page. Mock data only."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Theme appearance="dark" accentColor="teal" radius="large">
          {children}
        </Theme>
      </body>
    </html>
  );
}
