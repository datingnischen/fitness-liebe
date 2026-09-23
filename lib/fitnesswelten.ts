// Das WordPress-Magazin kennt nur die Kategorien "Allgemein" und "Rezepte".
// Die Themenwelten ordnen die Beiträge redaktionell; neue Beiträge landen
// über Stichwörter im Titel automatisch in der passenden Welt.

export type FitnessweltArticle = {
  slug: string;
  name: string;
  tagline: string;
  teaser: string;
  traits: string[];
  cta: string;
};

export type Fitnesswelt = {
  /** Slug unter /magazin/thema/<id> */
  id: string;
  emoji: string;
  name: string;
  shortName: string;
  claim: string;
  intro: string;
  /** Echte WP-Kategorie, deren Beiträge immer dazugehören. */
  wpCategory?: string;
  /** Beiträge, die fest zu dieser Welt gehören. */
  slugs: string[];
  /** Titel-Stichwörter für neue Beiträge. */
  keywords: RegExp;
  highlights: FitnessweltArticle[];
};

export const FITNESSWELTEN: Fitnesswelt[] = [
  {
    id: "fitness-dating",
    emoji: "💘",
    name: "Fitness-Dating & Flirten",
    shortName: "Fitness-Dating",
    claim: "Für alle, die beim Training nicht nur Kalorien verbrennen wollen.",
    intro:
      "Flirten im Gym, das erste Date auf dem Rad, Trends wie Workout Wooing oder Gymder: Hier geht es darum, wie aus gemeinsamer Bewegung ein echtes Kennenlernen wird – respektvoll, entspannt und mit Puls.",
    slugs: [
      "flirten-im-fitnessstudio",
      "workout-wooing",
      "sportlicher-single",
      "trainieren-statt-tindern",
      "fitness-events",
      "gymder",
      "fitness-dating-ideen",
      "sportliches-date-outfits",
      "fitafy-dating-app",
      "selbstbewusstsein",
      "outdoor-sportarten",
      "fitness-dating",
      "sportarten-fuer-erstes-date",
      "fitnessroutinen",
      "was-sportliche-singles-anziehend-macht",
      "laufpartner-oder-lebenspartner",
      "ozempic-bewegung-dating",
      "sperm-maxxing-maennergesundheit",
    ],
    keywords: /dat(e|ing)|flirt|single|tinder|match|verlieb|anziehend|gymder|wooing/i,
    highlights: [
      {
        slug: "flirten-im-fitnessstudio",
        name: "Flirten im Fitnessstudio",
        tagline: "Interesse zeigen ohne Druck",
        teaser: "Der richtige Moment, die passende Frage – und warum ein Nein im Gym sofort zählt.",
        traits: ["Gym", "Respekt", "Timing"],
        cta: "Flirt-Guide lesen",
      },
      {
        slug: "sportarten-fuer-erstes-date",
        name: "Sportarten fürs erste Date",
        tagline: "Aktiv statt Café",
        teaser: "Welche Aktivitäten beim ersten Treffen verbinden – und welche eher Stress machen.",
        traits: ["Erstes Date", "Ideen", "Lockerer Einstieg"],
        cta: "Date-Ideen ansehen",
      },
      {
        slug: "workout-wooing",
        name: "Workout Wooing",
        tagline: "Wenn Training zum Date wird",
        teaser: "Was hinter dem Trend steckt – und wo gemeinsames Schwitzen Nähe schafft.",
        traits: ["Trend", "Nähe", "Grenzen"],
        cta: "Trend verstehen",
      },
      {
        slug: "was-sportliche-singles-anziehend-macht",
        name: "Was Sportliche anziehend macht",
        tagline: "Laut Studien",
        teaser: "Energie, Haltung, Selbstbewusstsein: Was die Forschung über Sport und Anziehung sagt.",
        traits: ["Studien", "Anziehung", "Ausstrahlung"],
        cta: "Studien lesen",
      },
    ],
  },
  {
    id: "fit-als-paar",
    emoji: "🤝",
    name: "Fit als Paar",
    shortName: "Fit als Paar",
    claim: "Für Paare, die ihre Beziehung in Bewegung halten.",
    intro:
      "Gemeinsame Ziele, feste Trainingstermine und ein Partner, der motiviert statt bremst: So wird Sport zum Beziehungsboost – vom ersten Lauf zu zweit bis zur eingespielten Routine.",
    slugs: ["fit-bleiben-als-paar", "mit-partner-sportliche-ziele-setzen", "beziehungsboost", "trainieren-mit-partner"],
    keywords: /paar|partner|beziehung|gemeinsam|zu zweit/i,
    highlights: [
      {
        slug: "fit-bleiben-als-paar",
        name: "Fit bleiben als Paar",
        tagline: "Die gemeinsame Routine",
        teaser: "Wenige realistische Ziele, feste Termine und eine 7-Tage-Challenge für den Start.",
        traits: ["Routine", "Challenge", "Alltag"],
        cta: "Routine starten",
      },
      {
        slug: "beziehungsboost",
        name: "Beziehungsboost durch Bewegung",
        tagline: "Warum Sport gut für die Liebe ist",
        teaser: "Weniger Stress, mehr Nähe, bewusste Zeit: Was gemeinsame Bewegung in Beziehungen bewirkt.",
        traits: ["Nähe", "Stressabbau", "Teamgeist"],
        cta: "Mehr erfahren",
      },
      {
        slug: "mit-partner-sportliche-ziele-setzen",
        name: "Sportliche Ziele zu zweit",
        tagline: "Setzen – und erreichen",
        teaser: "Wie ihr über Wünsche und Grenzen sprecht und daraus einen Plan macht, der beiden passt.",
        traits: ["Ziele", "Planung", "Motivation"],
        cta: "Ziele planen",
      },
      {
        slug: "trainieren-mit-partner",
        name: "Training mit Trainingspartner",
        tagline: "10 gute Gründe",
        teaser: "Mehr Motivation, bessere Technik, mehr Spaß – warum zu zweit trainieren wirkt.",
        traits: ["Motivation", "Technik", "Spaß"],
        cta: "Gründe lesen",
      },
    ],
  },
  {
    id: "training",
    emoji: "🏋️",
    name: "Training & Workouts",
    shortName: "Training",
    claim: "Für alle, die wissen wollen, was im Training wirklich wirkt.",
    intro:
      "Krafttraining, Cardio, Warm-up und Muskelkater: Die Grundlagen für ein Training, das zu deinem Alltag passt – für Einsteiger, Wiedereinsteiger und alle ab 50.",
    slugs: [
      "abendliche-fitness-die-besten-sportarten-fuer-frauen-statt-netflix",
      "fitness-ab-50-so-startest-du-jetzt-kraftvoll-durch",
      "warm-up",
      "mit-musik-trainieren",
      "fitnessbaender-uebungen",
      "beste-zeit-zum-trainieren",
      "traumziel-sixpack",
      "fit-im-homeoffice",
      "cardio-training",
      "mit-sport-anfangen",
      "muskelaufbau",
      "krafttraining-grundlagen",
      "muskelkater",
      "hanteltraining",
      "mit-dem-joggen-anfangen",
    ],
    keywords: /train|workout|übung|uebung|muskel|cardio|joggen|laufen|kraft|sixpack|sportart|fitness ab/i,
    highlights: [
      {
        slug: "krafttraining-grundlagen",
        name: "Krafttraining-Grundlagen",
        tagline: "Die wichtigsten Übungen",
        teaser: "Wie Krafttraining funktioniert und mit welchen Grundübungen du sicher startest.",
        traits: ["Einsteiger", "Technik", "Kraft"],
        cta: "Grundlagen lernen",
      },
      {
        slug: "cardio-training",
        name: "Cardio-Training",
        tagline: "Alles über Ausdauer",
        teaser: "Puls, Dauer, Intensität: Was du über Cardio wissen musst – und wie es zu deinem Ziel passt.",
        traits: ["Ausdauer", "Puls", "Fettverbrennung"],
        cta: "Cardio verstehen",
      },
      {
        slug: "mit-dem-joggen-anfangen",
        name: "Mit dem Joggen anfangen",
        tagline: "10 Tipps für den Start",
        teaser: "Schuhe, Tempo, Pausen: So wird aus der ersten Runde eine Gewohnheit.",
        traits: ["Laufen", "Einstieg", "Draußen"],
        cta: "Loslaufen",
      },
      {
        slug: "fitness-ab-50-so-startest-du-jetzt-kraftvoll-durch",
        name: "Fitness ab 50",
        tagline: "Jetzt kraftvoll durchstarten",
        teaser: "Warum Bewegung mit 50+ wichtiger denn je ist und wie ein sanfter Einstieg gelingt.",
        traits: ["50+", "Gesundheit", "Einstieg"],
        cta: "Durchstarten",
      },
    ],
  },
  {
    id: "ernaehrung",
    emoji: "🥗",
    name: "Ernährung & Gesundheit",
    shortName: "Ernährung",
    claim: "Für alle, die wissen wollen, was auf den Teller gehört.",
    intro:
      "Kalorienbedarf, Wasser, Intervallfasten und Heißhunger: Ernährungswissen ohne Dogma – damit Training, Energie und Wohlbefinden zusammenpassen.",
    slugs: [
      "10-tipps-lecker-essen-und-schlank-bleiben-ohne-verzicht",
      "wie-viel-wasser-trinken",
      "intervallfasten",
      "muskelaufbau-ernaehrung",
      "heisshunger-auf-suesses",
      "kalorienbedarf-berechnen",
    ],
    keywords: /ernähr|ernaehr|essen|kalorie|fasten|wasser|trinken|heißhunger|abnehm|gesund/i,
    highlights: [
      {
        slug: "kalorienbedarf-berechnen",
        name: "Kalorienbedarf berechnen",
        tagline: "Wie viel brauchst du wirklich?",
        teaser: "Grundumsatz, Leistungsumsatz und was die Zahl für dein Trainingsziel bedeutet.",
        traits: ["Grundumsatz", "Ziele", "Rechner"],
        cta: "Bedarf berechnen",
      },
      {
        slug: "muskelaufbau-ernaehrung",
        name: "Ernährung für Muskelaufbau",
        tagline: "Lebensmittel & Plan",
        teaser: "Eiweiß, Kohlenhydrate, Timing: die besten Lebensmittel und ein Beispiel-Ernährungsplan.",
        traits: ["Protein", "Ernährungsplan", "Muskeln"],
        cta: "Plan ansehen",
      },
      {
        slug: "intervallfasten",
        name: "Intervallfasten",
        tagline: "Für Einsteiger und Profis",
        teaser: "16:8, 5:2 und Co.: Welche Methode zu dir passt und worauf du achten solltest.",
        traits: ["16:8", "Methoden", "Alltag"],
        cta: "Fasten-Tipps lesen",
      },
      {
        slug: "10-tipps-lecker-essen-und-schlank-bleiben-ohne-verzicht",
        name: "Lecker essen, schlank bleiben",
        tagline: "10 Tipps ohne Verzicht",
        teaser: "Genuss und Figur schließen sich nicht aus – zehn alltagstaugliche Ideen.",
        traits: ["Genuss", "Alltag", "Balance"],
        cta: "Tipps lesen",
      },
    ],
  },
  {
    id: "rezepte",
    emoji: "🍝",
    name: "Fitness-Rezepte",
    shortName: "Rezepte",
    claim: "Für alle, die nach dem Training Hunger auf mehr haben.",
    intro:
      "Schnelle, eiweißreiche und würzige Rezepte aus der Redaktionsküche – zum Nachkochen allein oder für das erste Kochdate zu zweit.",
    wpCategory: "rezepte",
    slugs: ["kartoffelsalat-moggstar", "veggie-vulkan-spaghetti"],
    keywords: /rezept|salat|spaghetti|bowl|kochen/i,
    highlights: [
      {
        slug: "veggie-vulkan-spaghetti",
        name: "Veggie-Vulkan-Spaghetti",
        tagline: "Scharf, schnell, vegetarisch",
        teaser: "Mit geröstetem Brokkoli und Paprika-Crunch – das fleischlose Power-Gericht für die Date Night.",
        traits: ["Vegetarisch", "Scharf", "Date Night"],
        cta: "Nachkochen",
      },
      {
        slug: "kartoffelsalat-moggstar",
        name: "Kartoffelsalat Spicy alla Moggstar",
        tagline: "Der Klassiker mit Kick",
        teaser: "Hausmannskost mit Chili-Kick, Eiweiß aus Eiern und fettarmer Basis – ideal fürs Picknick-Date.",
        traits: ["Klassiker", "Meal-Prep", "Würzig"],
        cta: "Rezept öffnen",
      },
    ],
  },
];

export const FITNESSWELT_MATCHES = [
  { emoji: "💬", need: "Du willst im Gym flirten, ohne aufdringlich zu wirken", slugs: ["flirten-im-fitnessstudio", "workout-wooing"] },
  { emoji: "🚴", need: "Du suchst eine Idee fürs erste aktive Date", slugs: ["sportarten-fuer-erstes-date", "fitness-dating-ideen"] },
  { emoji: "❤️", need: "Ihr wollt als Paar gemeinsam fit werden", slugs: ["fit-bleiben-als-paar", "mit-partner-sportliche-ziele-setzen"] },
  { emoji: "🌱", need: "Du fängst gerade (wieder) mit Sport an", slugs: ["mit-sport-anfangen", "mit-dem-joggen-anfangen"] },
  { emoji: "🍳", need: "Du willst dein Training mit der richtigen Ernährung unterstützen", slugs: ["muskelaufbau-ernaehrung", "kalorienbedarf-berechnen"] },
];

export const FITNESSWELT_FAQ = [
  {
    question: "Was ist fitness-liebe.de?",
    answer:
      "fitness-liebe.de ist eine Singlebörse für sportliche Menschen: Hier treffen sich Singles, denen Bewegung, Gesundheit und ein aktiver Alltag wichtig sind – und die sich einen Partner wünschen, der das teilt.",
  },
  {
    question: "Muss ich besonders sportlich sein, um mitzumachen?",
    answer:
      "Nein. Entscheidend ist die Freude an Bewegung, nicht die Bestzeit. Ob Yoga, Wandern, Laufen oder Krafttraining – willkommen ist, wer aktiv leben möchte.",
  },
  {
    question: "Kostet die Anmeldung etwas?",
    answer:
      "Die Registrierung ist kostenlos, und mit der Basis-Mitgliedschaft kannst du fitness-liebe.de bereits umfangreich nutzen. Alle Magazin-Inhalte sind frei lesbar.",
  },
  {
    question: "Wie finde ich sportliche Singles in meiner Stadt?",
    answer:
      "Über die Partnersuche nach Städten – von Berlin über München bis Dresden – siehst du Profilvorschauen aus deiner Region und findest lokale Laufstrecken, Parks und Treffpunkte.",
  },
  {
    question: "Wer schreibt die Artikel im Magazin?",
    answer:
      "Das Magazin wird von Christian M. Haas, Gründer und Datingexperte, und Personaltrainer Gazi Avakhti begleitet. Dating-Themen und Trainingswissen kommen so aus erster Hand.",
  },
];

export const FITNESSWELT_ARTICLE_COUNT = FITNESSWELTEN.reduce((sum, world) => sum + world.highlights.length, 0);

export function getFitnesswelt(id: string) {
  return FITNESSWELTEN.find((world) => world.id === id) ?? null;
}

export function findFitnessweltArticle(slug: string) {
  for (const world of FITNESSWELTEN) {
    const article = world.highlights.find((entry) => entry.slug === slug);
    if (article) return { world, article };
  }
  return null;
}

type ClassifiableEntry = { slug: string; title: string; categories?: Array<{ slug: string }> };

/** Ordnet einen Beitrag genau einer Themenwelt zu (feste Zuordnung vor Stichwort vor Fallback). */
export function classifyFitnesswelt(entry: ClassifiableEntry): Fitnesswelt {
  const fixed = FITNESSWELTEN.find((world) => world.slugs.includes(entry.slug));
  if (fixed) return fixed;
  const category = FITNESSWELTEN.find(
    (world) => world.wpCategory && entry.categories?.some((item) => item.slug === world.wpCategory),
  );
  if (category) return category;
  const keyword = FITNESSWELTEN.find((world) => world.keywords.test(entry.title));
  return keyword ?? FITNESSWELTEN[0];
}

export function entriesForFitnesswelt<T extends ClassifiableEntry>(id: string, entries: T[]): T[] {
  return entries.filter((entry) => classifyFitnesswelt(entry).id === id);
}
