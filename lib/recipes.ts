// Rezeptdaten für Magazinbeiträge mit Rezeptkarte. Dieselben Daten speisen die sichtbare Karte
// und das Recipe-JSON-LD – so bleiben Zutaten, Schritte und Zeiten zwingend deckungsgleich.
// In WordPress markiert <!-- rezeptkarte --> die Stelle, an der die Karte im Beitrag erscheint.

export type RecipeIngredient = {
  amount?: string;
  name: string;
  note?: string;
};

export type RecipeIngredientGroup = {
  title: string;
  items: RecipeIngredient[];
};

export type RecipeStep = {
  title: string;
  text: string;
  minutes?: number;
};

export type RecipeVideo = {
  youtubeId: string;
  name: string;
  description: string;
  uploadDate: string;
  durationSeconds: number;
};

export type Recipe = {
  slug: string;
  name: string;
  description: string;
  servings: number;
  servingsLabel: string;
  prepMinutes: number;
  cookMinutes: number;
  restMinutes?: number;
  difficulty: "Einfach" | "Mittel" | "Anspruchsvoll";
  category: string;
  cuisine: string;
  keywords: string[];
  vegetarian: boolean;
  /** Grob geschätzt, bezogen auf `servings` Portionen. */
  caloriesPerServing: number;
  ingredientGroups: RecipeIngredientGroup[];
  steps: RecipeStep[];
  video?: RecipeVideo;
};

export const RECIPE_CARD_MARKER = /\s*(?:<p>)?\s*<!--\s*rezeptkarte\s*-->\s*(?:<\/p>)?\s*/i;

const RECIPES: Recipe[] = [
  {
    slug: "kartoffelsalat-moggstar",
    name: "Kartoffelsalat Spicy alla Moggstar",
    description:
      "Würziger Kartoffelsalat mit Chili-Brühe, Senf, Eiern und Röstzwiebeln – leichter als der Mayo-Klassiker und ideal für Meal-Prep oder das Picknick-Date.",
    servings: 4,
    servingsLabel: "3–4 Portionen",
    prepMinutes: 15,
    cookMinutes: 25,
    restMinutes: 30,
    difficulty: "Einfach",
    category: "Salat",
    cuisine: "Deutsch",
    keywords: ["Kartoffelsalat", "scharfer Kartoffelsalat", "Kartoffelsalat mit Brühe", "Meal-Prep", "vegetarisch"],
    vegetarian: true,
    caloriesPerServing: 300,
    ingredientGroups: [
      {
        title: "Für den Salat",
        items: [
          { amount: "1 kg", name: "festkochende Kartoffeln" },
          { amount: "3", name: "Eier" },
          { amount: "1", name: "rote Zwiebel", note: "fein gewürfelt" },
          { amount: "1", name: "weiße Zwiebel", note: "fein gewürfelt" },
          { amount: "1", name: "frische Chilischote", note: "fein geschnitten" },
        ],
      },
      {
        title: "Für die Chili-Brühe & das Dressing",
        items: [
          { amount: "150 ml", name: "Gemüsebrühe", note: "heiß" },
          { amount: "1 TL", name: "Chili-Gewürzmix", note: "mit Knoblauch, Paprika und Kreuzkümmel" },
          { amount: "2 TL", name: "mittelscharfer Senf" },
          { amount: "1 EL", name: "Miracle Whip oder Mayonnaise", note: "auch als Light-Variante" },
          { name: "Salz und Pfeffer" },
        ],
      },
      {
        title: "Zum Toppen",
        items: [
          { amount: "½ Bund", name: "Schnittlauch", note: "in Röllchen" },
          { amount: "2 EL", name: "Röstzwiebeln" },
        ],
      },
    ],
    steps: [
      {
        title: "Kartoffeln und Eier kochen",
        text: "Kartoffeln mit Schale in Salzwasser 20–25 Minuten garen, bis ein Messer leicht hineingleitet. Parallel die Eier 10 Minuten hart kochen und kalt abschrecken.",
        minutes: 25,
      },
      {
        title: "Pellen und schneiden",
        text: "Kartoffeln noch warm pellen, in etwa 5 mm dicke Scheiben schneiden und in eine große Schüssel geben. Warme Kartoffeln nehmen die Brühe viel besser auf.",
      },
      {
        title: "Chili-Brühe ansetzen",
        text: "Zwiebeln, Chili und Gewürzmix in die heiße Gemüsebrühe geben und etwa 2 Minuten ziehen lassen.",
        minutes: 2,
      },
      {
        title: "Übergießen und ziehen lassen",
        text: "Die Brühe samt Zwiebeln über die Kartoffelscheiben gießen, vorsichtig unterheben und mindestens 30 Minuten ziehen lassen.",
        minutes: 30,
      },
      {
        title: "Cremig machen",
        text: "Senf und Miracle Whip behutsam unterheben – nicht rühren, damit der Salat cremig und nicht matschig wird. Mit Salz und Pfeffer abschmecken.",
      },
      {
        title: "Anrichten",
        text: "Eier in Scheiben schneiden und mit Schnittlauch und Röstzwiebeln auf dem Salat verteilen. Kalt servieren – oder lauwarm, wenn du ihn besonders würzig magst.",
      },
    ],
    video: {
      youtubeId: "spa1PEtqyI4",
      name: "Kartoffelsalat Spicy alla Moggstar",
      description: "Der würzige Kartoffelsalat mit Chili-Brühe in 22 Sekunden – vom Kochtopf bis zum Anrichten.",
      uploadDate: "2025-08-15T15:45:34-07:00",
      durationSeconds: 22,
    },
  },
  {
    slug: "veggie-vulkan-spaghetti",
    name: "Veggie-Vulkan-Spaghetti mit geröstetem Brokkoli & Paprika-Crunch",
    description:
      "Vegetarische Spaghetti mit Ofengemüse und einer süß-scharfen Sauce aus Tomatenmark, Sojasauce, Chili und einem Hauch Zimt – in 35 Minuten auf dem Tisch.",
    servings: 3,
    servingsLabel: "2–3 Portionen",
    prepMinutes: 10,
    cookMinutes: 25,
    difficulty: "Einfach",
    category: "Hauptgericht",
    cuisine: "Fusion",
    keywords: ["Veggie-Spaghetti", "scharfe Pasta", "Brokkoli-Pasta", "vegetarisch", "Date Night"],
    vegetarian: true,
    caloriesPerServing: 500,
    ingredientGroups: [
      {
        title: "Für Pasta & Ofengemüse",
        items: [
          { amount: "250 g", name: "Spaghetti" },
          { amount: "1", name: "kleiner Brokkoli", note: "in Röschen" },
          { amount: "1", name: "rote Paprika", note: "in Streifen" },
          { amount: "1", name: "gelbe Paprika", note: "in Streifen" },
          { amount: "2 EL", name: "Olivenöl", note: "je 1 EL für Gemüse und Sauce" },
        ],
      },
      {
        title: "Für die Vulkan-Sauce",
        items: [
          { amount: "3", name: "Knoblauchzehen", note: "gehackt" },
          { amount: "1 EL", name: "Tomatenmark" },
          { amount: "1 EL", name: "Sojasauce" },
          { amount: "100 ml", name: "Gemüsebrühe" },
          { amount: "1 TL", name: "geräuchertes Paprikapulver" },
          { amount: "½ TL", name: "Zimt" },
          { amount: "1 TL", name: "Chiliflocken", note: "für mildere Schärfe weniger" },
          { amount: "1 EL", name: "Ahornsirup oder Agavendicksaft" },
          { name: "Salz und Pfeffer" },
        ],
      },
      {
        title: "Zum Toppen",
        items: [
          { amount: "50 g", name: "Feta", note: "zerbröselt, oder eine vegane Alternative" },
          { amount: "½ Bund", name: "Schnittlauch oder Petersilie" },
          { name: "Röstzwiebeln", note: "optional" },
        ],
      },
    ],
    steps: [
      {
        title: "Gemüse rösten",
        text: "Ofen auf 200 °C Umluft vorheizen. Brokkoli und Paprika auf einem Backblech verteilen, mit 1 EL Olivenöl und etwas Salz vermengen und etwa 20 Minuten rösten, bis die Ränder leicht gebräunt sind.",
        minutes: 20,
      },
      {
        title: "Spaghetti kochen",
        text: "Währenddessen die Spaghetti in reichlich Salzwasser al dente garen. Vor dem Abgießen eine Tasse Nudelwasser abnehmen.",
        minutes: 10,
      },
      {
        title: "Vulkan-Sauce einköcheln",
        text: "1 EL Olivenöl in einer großen Pfanne erhitzen, Knoblauch kurz anbraten und das Tomatenmark 1–2 Minuten karamellisieren. Mit Sojasauce und Gemüsebrühe ablöschen, Paprikapulver, Zimt, Chiliflocken und Ahornsirup einrühren und bei mittlerer Hitze 5 Minuten einköcheln lassen.",
        minutes: 5,
      },
      {
        title: "Pasta schwenken",
        text: "Spaghetti in die Pfanne geben und mit einem Schuss Nudelwasser geschmeidig schwenken. Das geröstete Gemüse unterheben und mit Salz und Pfeffer abschmecken.",
      },
      {
        title: "Anrichten",
        text: "Auf Teller verteilen und mit Feta, frischen Kräutern und nach Wunsch Röstzwiebeln toppen.",
      },
    ],
  },
];

export function getRecipe(slug: string) {
  return RECIPES.find((recipe) => recipe.slug === slug) ?? null;
}

export function getRecipeTotalMinutes(recipe: Recipe) {
  return recipe.prepMinutes + recipe.cookMinutes + (recipe.restMinutes ?? 0);
}

/** ISO-8601-Dauer, z. B. 70 → "PT1H10M". */
export function isoDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return `PT${hours ? `${hours}H` : ""}${rest || !hours ? `${rest}M` : ""}`;
}

export function formatMinutes(minutes: number) {
  if (minutes < 60) return `${minutes} Min.`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours} Std. ${rest} Min.` : `${hours} Std.`;
}

export function formatIngredient(item: RecipeIngredient) {
  return [item.amount, item.name].filter(Boolean).join(" ") + (item.note ? `, ${item.note}` : "");
}

type RecipeGraphInput = {
  recipe: Recipe;
  pageUrl: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  author?: Record<string, string>;
  inLanguage: string;
};

export function buildRecipeNode({ recipe, pageUrl, image, datePublished, dateModified, author, inLanguage }: RecipeGraphInput) {
  const video = recipe.video;
  return {
    "@type": "Recipe",
    "@id": `${pageUrl}#rezept`,
    name: recipe.name,
    description: recipe.description,
    image: image ? [image] : undefined,
    author,
    datePublished,
    dateModified,
    inLanguage,
    mainEntityOfPage: pageUrl,
    recipeYield: [String(recipe.servings), recipe.servingsLabel],
    prepTime: isoDuration(recipe.prepMinutes),
    cookTime: isoDuration(recipe.cookMinutes),
    totalTime: isoDuration(getRecipeTotalMinutes(recipe)),
    recipeCategory: recipe.category,
    recipeCuisine: recipe.cuisine,
    keywords: recipe.keywords.join(", "),
    suitableForDiet: recipe.vegetarian ? "https://schema.org/VegetarianDiet" : undefined,
    nutrition: {
      "@type": "NutritionInformation",
      calories: `${recipe.caloriesPerServing} kcal`,
      servingSize: "1 Portion",
    },
    recipeIngredient: recipe.ingredientGroups.flatMap((group) => group.items.map(formatIngredient)),
    recipeInstructions: recipe.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.title,
      text: step.text,
      url: `${pageUrl}#rezept-schritt-${index + 1}`,
    })),
    video: video
      ? {
          "@type": "VideoObject",
          name: video.name,
          description: video.description,
          thumbnailUrl: `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`,
          contentUrl: `https://www.youtube.com/watch?v=${video.youtubeId}`,
          embedUrl: `https://www.youtube.com/embed/${video.youtubeId}`,
          uploadDate: video.uploadDate,
          duration: `PT${video.durationSeconds}S`,
        }
      : undefined,
  };
}
