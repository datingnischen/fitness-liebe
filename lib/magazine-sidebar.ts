export type MagazineSidebarVariant = {
  image: string;
  imageAlt: string;
  audience: string;
};

export const MAGAZINE_SIDEBAR_DEFAULT_IMAGE = "/home/frontpage-visual-fitnessliebe.webp";

// Bildquellen: ICONY-CMS von fitness-liebe.de (Startseite und /partnersuche/), siehe docs/bildquellen/README.md
const VARIANTS: Record<string, MagazineSidebarVariant> = {
  "fitness-dating": {
    image: MAGAZINE_SIDEBAR_DEFAULT_IMAGE,
    imageAlt: "Fitness-Liebe – sportliche Singles beim Kennenlernen",
    audience: "Singles, die beim Sport genauso gern flirten wie du",
  },
  "fit-als-paar": {
    image: "/home/sidebar-paar-training.webp",
    imageAlt: "Fitness-Liebe – Paar beim gemeinsamen Hanteltraining",
    audience: "einen Partner, der mit dir trainiert statt auf dem Sofa wartet",
  },
  training: {
    image: "/home/sidebar-paar-training.webp",
    imageAlt: "Fitness-Liebe – gemeinsames Training im Studio",
    audience: "einen Trainingspartner fürs Leben",
  },
  ernaehrung: {
    image: "/home/sidebar-yoga.webp",
    imageAlt: "Fitness-Liebe – Yoga am Wasser",
    audience: "Menschen, denen ein gesunder Lifestyle genauso wichtig ist",
  },
  rezepte: {
    image: "/home/sidebar-yoga.webp",
    imageAlt: "Fitness-Liebe – gesund leben zu zweit",
    audience: "jemanden, mit dem du nach dem Training gern kochst",
  },
};

export function getMagazineSidebarVariant(worldId: string): MagazineSidebarVariant {
  return VARIANTS[worldId] ?? VARIANTS["fitness-dating"];
}
