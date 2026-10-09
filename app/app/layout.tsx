import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WIHGO AI — Connect Hub",
  description: "Connect. Collaborate. Achieve."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
