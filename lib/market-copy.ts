import type { MarketCode } from "#markets";

// Startseite, Dating-Tipps, Über uns und Social Media gibt es in jedem Land. Damit AT und CH
// keine wortgleichen Kopien von DE sind, bekommen sie eigene Titel, Descriptions, Überschriften
// und Einleitungen mit Landesbezug; CH schreibt zusätzlich ohne ß. Der Inhalt bleibt derselbe.
// DE nutzt die Originaltexte der Seiten unverändert.

export type PageCopy = { title: string; description: string; heading: string; lead: string };
type Overrides = Partial<Record<Exclude<MarketCode, "de">, Partial<PageCopy>>>;

/** Schweizer Rechtschreibung: kein ß. */
export function localizeText(market: MarketCode, text: string): string {
  return market === "ch" ? text.replace(/ß/g, "ss") : text;
}

export function localizeTexts<T>(market: MarketCode, value: T): T {
  if (market !== "ch") return value;
  if (typeof value === "string") return localizeText(market, value) as T;
  if (Array.isArray(value)) return value.map((item) => localizeTexts(market, item)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, localizeTexts(market, item)])) as T;
  }
  return value;
}

function pageCopy(market: MarketCode, base: PageCopy, overrides: Overrides): PageCopy {
  const override = market === "de" ? undefined : overrides[market];
  return localizeTexts(market, { ...base, ...override });
}

export function homeCopy(market: MarketCode) {
  return pageCopy(
    market,
    {
      title: "Wir verlieben sportliche Singles – fitness-liebe.de",
      description:
        "Finde sportliche Singles in deiner Umgebung: fitness-liebe.de ist die Partnervermittlung für Fitness-Fans – mit geprüften Profilen, Magazin zu Training, Ernährung und Fitness-Dating und kostenlosem Start.",
      heading: "in deiner Umgebung.",
      lead: "Laufrunde, Yogamatte oder Hantelbank: Bei fitness-liebe.de triffst du Menschen, die Bewegung genauso lieben wie du – für eine ernsthafte Beziehung mit gemeinsamem Puls.",
    },
    {
      at: {
        title: "Sportliche Singles in Österreich kennenlernen – fitness-liebe.de",
        description:
          "Finde sportliche Singles in Österreich, von Wien über Graz bis Innsbruck: fitness-liebe.de ist die Partnervermittlung für Fitness-Fans – mit geprüften Profilen, Fitness-Magazin und kostenlosem Start.",
        heading: "in Österreich.",
        lead: "Laufrunde an der Donau, Skitour in den Alpen oder Hantelbank im Studio: Bei fitness-liebe.de triffst du Menschen in Österreich, die Bewegung genauso lieben wie du – für eine ernsthafte Beziehung mit gemeinsamem Puls.",
      },
      ch: {
        title: "Sportliche Singles in der Schweiz kennenlernen – fitness-liebe.de",
        description:
          "Finde sportliche Singles in der Schweiz, von Zürich über Bern bis Basel: fitness-liebe.de ist die Partnervermittlung für Fitness-Fans – mit geprüften Profilen, Fitness-Magazin und kostenlosem Start.",
        heading: "in der Schweiz.",
        lead: "Joggen am See, Biken in den Bergen oder Hantelbank im Studio: Bei fitness-liebe.de triffst du Menschen in der Schweiz, die Bewegung genauso lieben wie du – für eine ernsthafte Beziehung mit gemeinsamem Puls.",
      },
    },
  );
}

export function datingTipsCopy(market: MarketCode) {
  return pageCopy(
    market,
    {
      title: "Dating-Tipps: So gelingt die Partnersuche online",
      description:
        "Bleib du selbst, zeig dich mit Foto, schreib persönliche Nachrichten und bleib sicher: Die wichtigsten Dating-Tipps von fitness-liebe.de für einen erfolgreichen Start.",
      heading: "Dating-Tipps: So gelingt die Partnersuche online",
      lead: "Online-Dating ist eine großartige Möglichkeit, neue Menschen kennenzulernen. Damit Du von Anfang an die bestmöglichen Chancen hast, haben wir die wichtigsten Tipps zusammengefasst – online flirten ist leichter als gedacht!",
    },
    {
      at: {
        title: "Dating-Tipps für Österreich: So gelingt die Partnersuche online",
        description:
          "Bleib du selbst, zeig dich mit Foto, schreib persönliche Nachrichten und bleib sicher: Dating-Tipps von fitness-liebe.de für sportliche Singles in Österreich.",
        heading: "Dating-Tipps für Österreich: So gelingt die Partnersuche online",
        lead: "Ob in Wien, Linz oder Salzburg: Online-Dating ist eine großartige Möglichkeit, neue Menschen kennenzulernen. Damit Du von Anfang an die bestmöglichen Chancen hast, haben wir die wichtigsten Tipps zusammengefasst – online flirten ist leichter als gedacht!",
      },
      ch: {
        title: "Dating-Tipps für die Schweiz: So gelingt die Partnersuche online",
        description:
          "Bleib du selbst, zeig dich mit Foto, schreib persönliche Nachrichten und bleib sicher: Dating-Tipps von fitness-liebe.de für sportliche Singles in der Schweiz.",
        heading: "Dating-Tipps für die Schweiz: So gelingt die Partnersuche online",
        lead: "Ob in Zürich, Bern oder Luzern: Online-Dating ist eine grossartige Möglichkeit, neue Menschen kennenzulernen. Damit Du von Anfang an die bestmöglichen Chancen hast, haben wir die wichtigsten Tipps zusammengefasst – online flirten ist leichter als gedacht!",
      },
    },
  );
}

export function aboutCopy(market: MarketCode, lead: string) {
  return pageCopy(
    market,
    {
      title: "Über fitness-liebe.de",
      description:
        "Wer hinter fitness-liebe.de steht, warum gemeinsame Bewegung verbindet und wo du uns findest: Team, Magazin-Autoren, Sicherheit und Social-Media-Kanäle.",
      heading: "Wir verbinden Liebe mit Fitness.",
      lead,
    },
    {
      at: {
        title: "Über fitness-liebe.de in Österreich",
        description:
          "Wer hinter fitness-liebe.de steht, warum gemeinsame Bewegung verbindet und wie sportliche Singles in Österreich zueinander finden: Team, Autoren, Sicherheit und Social-Media-Kanäle.",
        heading: "Wir verbinden Liebe mit Fitness – auch in Österreich.",
        lead: `${lead} Auch sportliche Singles in Österreich finden hier zueinander – vom Wiener Prater bis an den Wörthersee.`,
      },
      ch: {
        title: "Über fitness-liebe.de in der Schweiz",
        description:
          "Wer hinter fitness-liebe.de steht, warum gemeinsame Bewegung verbindet und wie sportliche Singles in der Schweiz zueinander finden: Team, Autoren, Sicherheit und Social-Media-Kanäle.",
        heading: "Wir verbinden Liebe mit Fitness – auch in der Schweiz.",
        lead: `${lead} Auch sportliche Singles in der Schweiz finden hier zueinander – vom Zürichsee bis in die Berner Alpen.`,
      },
    },
  );
}

export function socialMediaCopy(market: MarketCode) {
  const description =
    "Folge fitness-liebe.de auf Facebook, YouTube und Pinterest – mit Community-News, Videos und Inspiration rund um Fitness, Gesundheit und Partnersuche.";
  return pageCopy(
    market,
    { title: "Fitness-Liebe auf Social Media", description, heading: "Fitness-Liebe auf Social Media", lead: description },
    {
      at: {
        title: "Fitness-Liebe auf Social Media – für Österreich",
        description:
          "Folge fitness-liebe.de auf Facebook, YouTube und Pinterest – Community-News, Videos und Inspiration rund um Fitness, Gesundheit und Partnersuche, auch für sportliche Singles in Österreich.",
        heading: "Fitness-Liebe auf Social Media – für Österreich",
        lead: "Folge fitness-liebe.de auf Facebook, YouTube und Pinterest – Community-News, Videos und Inspiration rund um Fitness, Gesundheit und Partnersuche, auch für sportliche Singles in Österreich.",
      },
      ch: {
        title: "Fitness-Liebe auf Social Media – für die Schweiz",
        description:
          "Folge fitness-liebe.de auf Facebook, YouTube und Pinterest – Community-News, Videos und Inspiration rund um Fitness, Gesundheit und Partnersuche, auch für sportliche Singles in der Schweiz.",
        heading: "Fitness-Liebe auf Social Media – für die Schweiz",
        lead: "Folge fitness-liebe.de auf Facebook, YouTube und Pinterest – Community-News, Videos und Inspiration rund um Fitness, Gesundheit und Partnersuche, auch für sportliche Singles in der Schweiz.",
      },
    },
  );
}
