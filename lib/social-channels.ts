import type { AuthorSocialPlatform } from "@/lib/author-profiles";

export type SocialChannel = {
  platform: AuthorSocialPlatform;
  name: string;
  handle: string;
  kind: string;
  description: string;
  cta: string;
  href: string;
};

// Kanäle wie auf fitness-liebe.de/social-media/
export const SOCIAL_CHANNELS: SocialChannel[] = [
  {
    platform: "facebook",
    name: "Facebook",
    handle: "Fitness-Liebe",
    kind: "News & Community",
    description: "Neuigkeiten, Community-Austausch und spannende Beiträge rund um Fitness, Wohlbefinden und Lifestyle.",
    cta: "Seite besuchen",
    href: "https://www.facebook.com/profile.php?id=61578910400002",
  },
  {
    platform: "youtube",
    name: "YouTube",
    handle: "@fitness-liebe",
    kind: "Videos",
    description: "Videos, Erfahrungsberichte und Tipps rund um Sport, Gesundheit und Partnersuche.",
    cta: "Kanal abonnieren",
    href: "https://www.youtube.com/@fitness-liebe",
  },
  {
    platform: "pinterest",
    name: "Pinterest",
    handle: "fitnessliebede",
    kind: "Inspiration & Pins",
    description: "Inspiration, Motivation und Ideen rund um Fitness und einen gesunden Lifestyle.",
    cta: "Pins entdecken",
    href: "https://www.pinterest.com/fitnessliebede/",
  },
];

export const SOCIAL_COMMUNITY = {
  name: "Finde kostenlos Singles in Deiner Nähe",
  description:
    "Folgen ist gut, kennenlernen ist besser: Bei fitness-liebe.de triffst du Singles, die Bewegung genauso lieben wie du – die Registrierung ist kostenlos.",
  cta: "Kostenlos registrieren",
};
