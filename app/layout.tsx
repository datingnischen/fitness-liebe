import type { Metadata } from "next";
import "./globals.css";
import { SiteFooter, SiteHeader } from "@/components/site-shell";
import { StickyCTAButton } from "@/components/sticky-cta-button";

export const metadata: Metadata = {
  title: { default: "fitness-liebe.de – Sportliche Singles, Fitness-Dating & Magazin", template: "%s | fitness-liebe.de" },
  description:
    "Die Singlebörse für sportliche Menschen: Finde Singles, die Fitness, Bewegung und einen gesunden Lifestyle teilen – mit Magazin zu Training, Ernährung und Fitness-Dating.",
  metadataBase: new URL("https://fitness-liebe.de"),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de-DE">
      <body>
        <SiteHeader market="de" />
        {children}
        <SiteFooter market="de" />
        <StickyCTAButton market="de" />
      </body>
    </html>
  );
}
