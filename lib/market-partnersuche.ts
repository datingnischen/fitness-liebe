import data from "../data/partnersuche-markets.json" with { type: "json" };
import type { MarketCode } from "./markets.ts";

export type MarketCityPage = {
  market: MarketCode;
  slug: string;
  path: string;
  sourceUrl: string;
  title: string;
  description: string;
  cityName: string;
  lead: string;
  imageUrl?: string | null;
  imageAlt?: string | null;
  contentHtml: string;
  sourceAttributionUrl?: string | null;
  registrationUrl: string;
  searchUrl: string;
  icony: {
    platformId: string;
    zip: string;
    country: number;
    frameUrl: string;
  };
};

export type MarketHubSection = {
  heading: string;
  paragraphs: string[];
  imageUrl?: string | null;
  imageAlt?: string | null;
};

export type MarketHubEditorial = {
  heroImageUrl?: string | null;
  heroImageAlt?: string | null;
  introParagraphs: string[];
  sections: MarketHubSection[];
};

type RawMarket = {
  market: MarketCode;
  title: string;
  description: string;
  pages: MarketCityPage[];
};

type HubCopy = {
  title: string;
  description: string;
  editorial: MarketHubEditorial;
};

const imports = data as Record<MarketCode, RawMarket>;

const HUB_COPY: Record<MarketCode, HubCopy> = {
  de: {
    title: "Fitness-Dating in deiner Stadt – finde sportliche Singles",
    description:
      "Wähle deine Stadt und entdecke sportliche Singles, Laufstrecken, Outdoor-Parks und Fitness-Treffpunkte – von Berlin über München bis Dresden.",
    editorial: {
      heroImageUrl:
        "https://static-cms.icony-hosting.de/cms/C5C6C849929CC1D08DDD9F177896BF41A01B46AE5C1987DBAF5A87AD6AE2E2DA/1000/fitness-liebe-(2).jpg",
      heroImageAlt: "Fitnesstraining zu zweit",
      introParagraphs: [
        "Du lebst für Bewegung, liebst Fitness und suchst jemanden, der deine Leidenschaft teilt? Dann bist du bei fitness-liebe.de genau richtig. Unsere Plattform bringt sportbegeisterte Singles aus ganz Deutschland zusammen – für echte Verbindungen, gemeinsame Workouts und vielleicht die große Liebe.",
        "Ob beim Joggen im Park, beim Yoga im Studio oder beim Klettern in der Halle – mit fitness-liebe.de triffst du Gleichgesinnte, die nicht nur dein Herz, sondern auch deinen Puls schneller schlagen lassen. Melde dich kostenlos an und entdecke, wie viel Spaß es macht, die Liebe mit Fitness zu verbinden.",
      ],
      sections: [
        {
          heading: "Warum Sport die besten Voraussetzungen für Liebe schafft",
          paragraphs: [
            "Wer regelmäßig Sport treibt, lebt nicht nur gesünder, sondern zeigt auch Ausdauer, Motivation und Selbstdisziplin – Eigenschaften, die auch in einer Partnerschaft wichtig sind. Gemeinsame sportliche Aktivitäten fördern Teamgeist, Vertrauen und bringen Spaß in den Alltag, was eine starke Basis für eine stabile Beziehung schafft.",
            "Zudem fällt es aktiven Menschen oft leichter, ins Gespräch zu kommen, da sie durch ihre Hobbys bereits eine wichtige Gemeinsamkeit teilen. Ob beim Training, im Fitnessstudio oder auf einem gemeinsamen Lauf – Sport verbindet auf natürliche Weise und schafft viele Gelegenheiten, sich kennenzulernen, ohne dass es erzwungen wirkt.",
          ],
        },
        {
          heading: "Tipps für dein perfektes Fitness-Dating-Profil",
          imageUrl:
            "https://static-cms.icony-hosting.de/cms/02F8AAC1CE38A87CE7CD6DE1C824CD522D9D2CD1D8314853D41B805E6CBB6008/1000/fitness-liebe-(1).jpg",
          imageAlt: "Yoga am Wasser",
          paragraphs: [
            "Ein aussagekräftiges Profil ist der Schlüssel zum Erfolg – besonders auf einer spezialisierten Plattform wie fitness-liebe.de. Verwende ein natürliches, freundliches Profilbild, am besten in sportlicher Umgebung. Zeig dich authentisch und gib in deinem Text an, welche Sportarten du liebst, wie oft du trainierst und was dir in einer Beziehung wichtig ist.",
            "Vermeide Floskeln und sei ehrlich: Du musst nicht der oder die Fitteste sein – entscheidend ist, dass du Begeisterung für Bewegung mitbringst. Je persönlicher und sympathischer dein Profil wirkt, desto höher sind die Chancen, jemanden zu finden, der wirklich zu dir passt.",
          ],
        },
        {
          heading: "Gemeinsam aktiv: Die besten Sportarten für das erste Treffen",
          paragraphs: [
            "Ein sportliches erstes Date ist die ideale Möglichkeit, locker ins Gespräch zu kommen und gleich gemeinsame Interessen zu erleben. Sportarten wie Wandern, Radfahren oder ein gemeinsames Workout im Park eignen sich hervorragend, da sie nicht zu anstrengend sind und genug Raum für Austausch lassen.",
            "Vermeide dagegen zu kompetitive Aktivitäten oder extrem fordernde Workouts – das erste Treffen sollte entspannt bleiben. Ideal sind Sportarten, bei denen ihr euch gegenseitig motivieren könnt, aber trotzdem Zeit habt, euch kennenzulernen und gemeinsame Erlebnisse zu schaffen.",
          ],
        },
      ],
    },
  },
};

export function withPostcodeSearch(page: MarketCityPage): MarketCityPage {
  const postcodePattern = /^\d{5}$/;
  if (!postcodePattern.test(page.icony.zip)) {
    throw new Error(`Invalid postcode for ${page.market}/${page.slug}: ${page.icony.zip}`);
  }
  const url = new URL(page.searchUrl);
  const aid = url.searchParams.get("AID");
  if (aid !== "location") {
    throw new Error(`Invalid search attribution for ${page.market}/${page.slug}`);
  }
  url.search = "";
  url.searchParams.set("plz", page.icony.zip);
  url.searchParams.set("AID", aid);
  return { ...page, searchUrl: url.toString() };
}

export function getMarketCityPages(market: MarketCode): MarketCityPage[] {
  return imports[market].pages.map(withPostcodeSearch);
}

export function getMarketCityPage(market: MarketCode, slug: string): MarketCityPage | null {
  const page = imports[market].pages.find((entry) => entry.slug === slug);
  return page ? withPostcodeSearch(page) : null;
}

export function getMarketPartnersucheHub(market: MarketCode) {
  const copy = HUB_COPY[market];
  return {
    market,
    title: copy.title,
    description: copy.description,
    editorial: copy.editorial,
    cities: imports[market].pages.map((page) => ({
      slug: page.slug,
      cityName: page.cityName,
      href: page.path,
      imageUrl: page.imageUrl,
      imageAlt: page.imageAlt,
      description: page.description,
    })),
  };
}

export function getNearbyMarketCities(market: MarketCode, slug: string, count = 6) {
  const pages = [...getMarketCityPages(market)].sort((a, b) => a.path.localeCompare(b.path, "de"));
  const index = pages.findIndex((page) => page.slug === slug);
  const ordered = index >= 0 ? [...pages.slice(index + 1), ...pages.slice(0, index)] : pages;
  const withImage = ordered.filter((page) => page.imageUrl);
  const withoutImage = ordered.filter((page) => !page.imageUrl);
  return [...withImage, ...withoutImage].slice(0, count);
}
