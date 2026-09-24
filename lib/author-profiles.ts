import { cache } from "react";
import { staticAsset } from "@/lib/static-asset";
import { getMagazineEntryBySlug, getMagazinePosts } from "@/lib/wordpress";

/** Christian vor dem Tennisplatz (freigestellt aus dem Porträt, Hintergrund gerendert). */
export const CHRISTIAN_PROFILE_PHOTO = staticAsset("/images/authors/christian-m-haas-tennis-portrait.webp");

/** Ersetzt das WordPress-Porträt im Profiltext durch das Tennisfoto, Größe und Ausrichtung bleiben. */
export function withChristianProfilePhoto(html: string) {
  return html.replace(/<img\s[^>]*Christian-M-Haas[^>]*>/i, (tag) =>
    tag
      .replace(/\s(?:srcset|sizes)="[^"]*"/gi, "")
      .replace(/\ssrc="[^"]*"/i, ` src="${CHRISTIAN_PROFILE_PHOTO}"`)
      .replace(/\salt="[^"]*"/i, ' alt="Christian M. Haas auf dem Tennisplatz"'),
  );
}

// Christians und Gazis Autorenarchive sind nur Aliasse: sie kanonisieren auf ihre
// Profilseiten im Magazin und bleiben noindex — deshalb gehoeren sie nicht in die Sitemap.
export const AUTHOR_PROFILE_PATHS: Record<string, string> = {
  "christian-m-haas": "/magazin/christian",
  gazi: "/magazin/gazi-avakhti",
};

const NOINDEX_AUTHOR_SLUGS = new Set(Object.keys(AUTHOR_PROFILE_PATHS));

export function isNoindexAuthorArchive(slug: string) {
  return NOINDEX_AUTHOR_SLUGS.has(slug);
}

/** WordPress-Seite (Slug) → Autor, dessen Profil sie ist. */
export function authorSlugForProfilePage(pageSlug: string) {
  return Object.entries(AUTHOR_PROFILE_PATHS).find(([, path]) => path === `/magazin/${pageSlug}`)?.[0] ?? null;
}

export type AuthorProfileLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type AuthorSocialPlatform = "linkedin" | "xing" | "instagram" | "facebook" | "youtube" | "tiktok" | "pinterest";

export type AuthorSocialLink = {
  platform: AuthorSocialPlatform;
  label: string;
  href: string;
};

export type AuthorProfileFact = {
  label: string;
  value: string;
};

export type AuthorProfile = {
  slug: string;
  name: string;
  role: string;
  /** Short role label shown next to the name in the author box. */
  jobTitle: string;
  bio: string;
  /** Two-sentence bio for the compact author box; never a truncated CMS excerpt. */
  shortBio: string;
  /** Short topic labels rendered as chips. */
  topics: string[];
  socials: AuthorSocialLink[];
  sameAs: string[];
  /** Scannable key facts; the same statements the Person node carries. */
  profileFacts: AuthorProfileFact[];
  imageUrl?: string;
  profileUrl: string;
  facts: string[];
  intro?: string;
  story?: string[];
  expertise?: string[];
  links?: AuthorProfileLink[];
  quote?: string;
};

function firstImage(html: string) {
  const match = html.match(/<img[^>]+(?:src|data-src)="([^"]+)"/i)?.[1];
  // Die Profilseiten binden nur die mittlere Bildgröße ein; das Original ist schärfer.
  return match?.replace(/-\d+x\d+(\.(?:jpe?g|png|webp))$/i, "$1");
}

async function profileImage(pageSlug: string) {
  const entry = await getMagazineEntryBySlug(pageSlug);
  return { entry, imageUrl: entry ? firstImage(entry.content) : undefined };
}

export const getAuthorProfile = cache(async (slug: string): Promise<AuthorProfile | null> => {
  const posts = await getMagazinePosts();
  const authorPosts = posts.filter((post) => post.authorSlug === slug);
  if (!authorPosts.length && !AUTHOR_PROFILE_PATHS[slug] && slug !== "redaktion") return null;

  if (slug === "christian-m-haas") {
    return {
      slug,
      name: "Christian M. Haas",
      role: "Gründer von fitness-liebe.de, Datingexperte und Sport-Enthusiast",
      jobTitle: "Gründer & Datingexperte",
      shortBio:
        "Christian M. Haas verbindet seine sportliche Leidenschaft – vom Auswahlfußball bis zur Tennis-Verbandsliga – mit langjähriger Erfahrung im Aufbau spezialisierter Dating-Plattformen. Sein Ziel: Menschen zusammenbringen, die einen aktiven Lebensstil teilen.",
      topics: ["Fitness-Dating", "Partnersuche für Sportliche", "Motivation & Balance", "Community-Aufbau"],
      socials: [
        { platform: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/christian-m-haas-457323379" },
        { platform: "xing", label: "XING", href: "https://www.xing.com/profile/ChristianM_Haas/web_profiles" },
      ],
      sameAs: [
        "https://datingnischen.de/christian",
        "https://www.linkedin.com/in/christian-m-haas-457323379",
        "https://www.xing.com/profile/ChristianM_Haas/web_profiles",
        "https://gravatar.com/automatic8c1daff973",
      ],
      profileFacts: [
        { label: "Rolle", value: "Gründer von fitness-liebe.de, Datingexperte und Autor" },
        { label: "Schwerpunkte", value: "Dating für sportlich aktive Singles, gemeinsame Fitness-Ziele, Balance in der Beziehung" },
        { label: "Sportlicher Hintergrund", value: "Fußball ab vier Jahren in Auswahlmannschaften, später Tennis in Gruppen- und Verbandsliga" },
        { label: "Plattformbetrieb", value: "ICONY GmbH – Christian begleitet das Magazin redaktionell und beratend" },
        { label: "Buch", value: "„Dating ohne Bullshit“, BoD – Books on Demand, 1. Auflage 2026" },
      ],
      bio:
        "Sport begleitet Christian M. Haas seit seiner Kindheit. Mit fitness-liebe.de verbindet er seine sportliche Leidenschaft mit langjähriger Erfahrung im Aufbau spezialisierter Dating-Plattformen.",
      intro:
        "Christian M. Haas entwickelt seit vielen Jahren Angebote für themenspezifisches Online-Dating. Bei fitness-liebe.de bringt er dieses Know-how mit seiner eigenen Sportbiografie zusammen – für ein Magazin, das motiviert, ehrlich einordnet und Singles mit aktivem Lebensstil zusammenbringt.",
      imageUrl: CHRISTIAN_PROFILE_PHOTO,
      profileUrl: "/magazin/christian",
      facts: [
        "Langjährige Erfahrung mit Dating-Portalen und spezialisierten Communities",
        "Sportbiografie von Auswahlfußball bis Tennis-Verbandsliga",
        `Bereits ${authorPosts.length} veröffentlichte Beiträge im Magazin`,
      ],
      story: [
        "Sport begleitet Christian seit seiner Kindheit: Mit vier Jahren begann er mit dem Fußball und spielte in mehreren Auswahlmannschaften, später entdeckte er Tennis und spielte in der Gruppen- und Verbandsliga.",
        "Disziplin, Zielstrebigkeit und Teamfähigkeit aus dem Sport prägen bis heute seine Arbeit im Online-Dating. Wer Sport liebt, sucht oft nicht nur einen Menschen, sondern einen Lebensstil – mit gemeinsamen Zielen, Energie und gegenseitiger Motivation.",
        "Im Magazin schreibt Christian deshalb über Dating für sportlich aktive Singles, Partnersuche mit gemeinsamen Fitness-Zielen und Balance in der Beziehung – verständlich, ehrlich und nah am Alltag.",
      ],
      expertise: [
        "Dating für sportlich aktive Singles",
        "Partnersuche mit gemeinsamen Fitness-Zielen",
        "Motivation, Disziplin und Balance in der Beziehung",
        "Authentische Verbindungen durch gemeinsame Leidenschaft",
      ],
      links: [
        { label: "Ausführliche Vita", href: "/magazin/christian" },
        { label: "Datingnischen.de", href: "https://datingnischen.de/christian", external: true },
        { label: "LinkedIn-Profil", href: "https://www.linkedin.com/in/christian-m-haas-457323379", external: true },
      ],
    };
  }

  if (slug === "gazi") {
    const { imageUrl } = await profileImage("gazi-avakhti");
    return {
      slug,
      name: "Gazi Avakhti",
      role: "Personaltrainer, ehemaliger Fußballprofi und Erfinder des GA Shaker+",
      jobTitle: "Personaltrainer",
      shortBio:
        "Gazi Avakhti ist ehemaliger Fußballprofi und seit 2008 selbstständiger Personaltrainer mit über 14.000 Trainingsstunden. Auf fitness-liebe.de schreibt er über Krafttraining, Athletik und Training im Alltag.",
      topics: ["Krafttraining", "Athletik", "Gesundheit", "Trainingsalltag"],
      socials: [
        { platform: "instagram", label: "Instagram", href: "https://www.instagram.com/personaltrainer_gazi/" },
        { platform: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/gazi-avakhti-103689198/" },
        { platform: "youtube", label: "YouTube", href: "https://www.youtube.com/user/GAPersonalTraining" },
        { platform: "facebook", label: "Facebook", href: "https://www.facebook.com/GA-PersonalTraining-120967137968786/" },
      ],
      sameAs: [
        "https://www.instagram.com/personaltrainer_gazi/",
        "https://www.linkedin.com/in/gazi-avakhti-103689198/",
        "https://www.youtube.com/user/GAPersonalTraining",
      ],
      profileFacts: [
        { label: "Rolle", value: "Personaltrainer und Magazin-Autor" },
        { label: "Erfahrung", value: "Seit 2008 selbstständig, über 14.000 Trainingsstunden" },
        { label: "Hintergrund", value: "Ehemaliger Fußballprofi" },
        { label: "Produkt", value: "GA Shaker+ – Finalist bei „Das Ding des Jahres“" },
      ],
      bio: "Gazi Avakhti ist ehemaliger Fußballprofi und seit 2008 als selbstständiger Personaltrainer tätig. Er vereint Praxisnähe mit fundierter Methodik in Krafttraining, Athletik und Gesundheit.",
      intro:
        "Gazi Avakhti hat in über 14.000 Trainingsstunden gelernt, was im Alltag wirklich funktioniert. Auf fitness-liebe.de teilt er Erfahrungen aus Profisport, Personaltraining und Produktentwicklung – verständlich und direkt umsetzbar.",
      imageUrl,
      profileUrl: "/magazin/gazi-avakhti",
      facts: [
        "Seit 2008 selbstständiger Personaltrainer",
        "Über 14.000 absolvierte Trainingsstunden",
        "Erfinder des GA Shaker+ (Finale „Das Ding des Jahres“)",
      ],
      story: [
        "Als ehemaliger Fußballprofi kennt Gazi den Leistungssport von innen. Seit 2008 begleitet er als Personaltrainer Menschen, die fitter, stärker und gesünder werden wollen.",
        "Aus einem Alltagsproblem im Studio entstand der GA Shaker+: Handtuch, Getränk, Smartphone und Mitgliedskarte an einem Ort. Die Idee brachte ihn bis ins Finale von „Das Ding des Jahres“.",
      ],
      expertise: ["Krafttraining und Athletik", "Gesundheitsorientiertes Training", "Training nachhaltig in den Alltag integrieren"],
      links: [
        { label: "Profil im Magazin", href: "/magazin/gazi-avakhti" },
        { label: "Instagram", href: "https://www.instagram.com/personaltrainer_gazi/", external: true },
        { label: "LinkedIn-Profil", href: "https://www.linkedin.com/in/gazi-avakhti-103689198/", external: true },
      ],
    };
  }

  return {
    slug,
    name: "Redaktion",
    role: "Redaktion für sportliche Singles, Training, Ernährung und Fitness-Dating",
    jobTitle: "Magazin-Redaktion",
    shortBio:
      "Die Redaktion bündelt Trainingswissen, Ernährungstipps und Dating-Impulse für Menschen, die aktiv leben und jemanden suchen, der mitzieht.",
    topics: ["Training", "Ernährung", "Fitness-Dating", "Partnersuche"],
    socials: [],
    sameAs: [],
    profileFacts: [],
    bio: "Die Redaktion sammelt Trainingswissen, Ernährungstipps und Dating-Impulse für Menschen, bei denen Sport und Bewegung fest zum Leben gehören.",
    intro:
      "Die redaktionellen Inhalte bündeln praktische Tipps, Magazin-Themen und alltagsnahe Orientierung für sportliche Singles und Paare, die gemeinsam aktiv sein wollen.",
    profileUrl: `/magazin/author/${slug}`,
    facts: [
      "Fokus auf sportliche Singles und aktive Lebensstile",
      "Kuratierte Ratgeber zu Training, Ernährung und Dating",
      `Bereits ${authorPosts.length} veröffentlichte Beiträge im Magazin`,
    ],
    story: [
      "Die Redaktion bereitet Inhalte so auf, dass Trainingswissen, Partnersuche und Alltagsthemen sinnvoll zusammenfinden.",
      "Im Mittelpunkt stehen verständliche Empfehlungen, klare Einstiege und Themen, die für sportliche Menschen wirklich relevant sind.",
    ],
    expertise: [
      "Ratgeber zu Training, Workouts und Ernährung",
      "Alltagsnahe Themen für sportliche Singles und Paare",
      "Magazin-Inhalte mit Fokus auf Vertrauen und Verständlichkeit",
    ],
  };
});

export const getKnownAuthorSlugs = cache(async (): Promise<string[]> => {
  const posts = await getMagazinePosts();
  const slugs = new Set(posts.map((post) => post.authorSlug).filter(Boolean) as string[]);
  return [...slugs];
});

export const getAuthorPosts = cache(async (slug: string) => {
  const posts = await getMagazinePosts();
  return posts.filter((post) => post.authorSlug === slug);
});
