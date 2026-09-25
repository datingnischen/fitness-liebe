import type { Metadata } from "next";
import Link from "@/components/local-link";
import { notFound } from "next/navigation";
import { AuthorProfileFacts } from "@/components/author-profile-facts";
import { ExpertTrustCard } from "@/components/expert-trust-card";
import { PublishedBookFeature } from "@/components/published-book-feature";
import { RecipeCard, RecipeHeroFacts } from "@/components/recipe-card";
import { authorSlugForProfilePage, getAuthorProfile, withChristianProfilePhoto } from "@/lib/author-profiles";
import { staticAsset } from "@/lib/static-asset";
import {
  NOINDEX_MAGAZINE_PAGES,
  decodeHtmlEntities,
  enhanceAudioSummary,
  formatUpdatedDate,
  getUpdatedDate,
  getEntryCoverImage,
  getMagazineEntryBySlug,
  getMagazinePosts,
  getReadingMinutes,
  relativizeInternalLinks,
  stripHtml,
  type MagazineEntry,
} from "@/lib/wordpress";
import { buildChristianBookProfileGraph, stripPublishedBookSchema } from "@/lib/christian-book-profile-schema";
import { buildMagazineFaqGraph, getMagazineFaqItems, getMagazineFaqSubject, renderMagazineFaqSection } from "@/lib/magazine-faq";
import { serializeJsonLd } from "@/lib/json-ld";
import { classifyFitnesswelt, entriesForFitnesswelt, type Fitnesswelt } from "@/lib/fitnesswelten";
import { extractLeadImage } from "@/lib/magazine-lead-image";
import { getMagazineSidebarVariant, type MagazineSidebarVariant } from "@/lib/magazine-sidebar";
import { RECIPE_CARD_MARKER, buildRecipeNode, getRecipe } from "@/lib/recipes";
import { REGISTRATION_URL, getMarket, isMarketCode, marketAlternates, publicUrl, type MarketCode } from "@/lib/markets";

type PageProps = {
  params: Promise<{ market: string; slug: string }>;
};

export const revalidate = 300;

const ONLINE_IFRAME_SRC = "https://js.icony.com/frame/?w=300&h=300&id=fitnessliebe&pc=FBCA08&aid=magazin";
const CHRISTIAN_PAGE_DESCRIPTION =
  "Christian M. Haas ist Gründer von fitness-liebe.de, Datingexperte und Sport-Enthusiast. Erfahre mehr über seinen sportlichen Hintergrund, seine Dating-Erfahrung und seine Themen im Magazin.";
const GAZI_PAGE_DESCRIPTION =
  "Gazi Avakhti ist Personaltrainer, ehemaliger Fußballprofi und Erfinder des GA Shaker+. Auf fitness-liebe.de schreibt er über Krafttraining, Athletik und Training im Alltag.";
const PROFILE_DESCRIPTIONS: Record<string, string> = {
  christian: CHRISTIAN_PAGE_DESCRIPTION,
  "gazi-avakhti": GAZI_PAGE_DESCRIPTION,
};

// Gepflegte AIOSEO-Beschreibung zuerst, sonst der Auszug – an einer Wortgrenze gekürzt.
function metaDescription(entry: MagazineEntry) {
  if (entry.seoDescription) return entry.seoDescription;
  const text = stripHtml(entry.excerpt || entry.content);
  return text.length > 155 ? `${text.slice(0, 154).replace(/\s+\S*$/, "")} …` : text;
}

// Kurzer Einstieg im Hero: gepflegter Auszug vollständig, sonst der Textanfang mit Auslassung.
function heroText(entry: MagazineEntry) {
  const text = stripHtml(entry.excerpt || entry.content);
  return text.length > 220 ? `${text.slice(0, 220).replace(/\s+\S*$/, "")} …` : text;
}

function MagazineRadarCard() {
  return (
    <Link className="magazine-radar-card" href={REGISTRATION_URL}>
      <img
        src={staticAsset("/brand/umkreissuche-radar.svg")}
        alt="Umkreissuche: sportliche Singles in deiner Nähe – kostenlos anmelden"
        width={320}
        height={480}
        loading="lazy"
        decoding="async"
      />
    </Link>
  );
}

function MagazineConversionRail({
  title,
  variant,
  showRadar = false,
}: {
  title: string;
  variant: MagazineSidebarVariant;
  showRadar?: boolean;
}) {
  return (
    <div className="magazine-conversion-rail">
      <div className="magazine-conversion-card magazine-conversion-card-primary magazine-conversion-card-banner">
        <figure className="magazine-conversion-hero">
          <img src={staticAsset(variant.image)} alt={variant.imageAlt} loading="lazy" decoding="async" />
        </figure>
        <div className="magazine-conversion-body">
          <span className="eyebrow eyebrow-brand">Singlebörse</span>
          <h2>Sportliche Singles statt nur weiterlesen</h2>
          <p>
            Wer bei {title} landet, sucht oft mehr als Tipps — nämlich {variant.audience}.
          </p>
          <ul className="magazine-conversion-points" aria-label="Einstiegsvorteile">
            <li>Kostenlos starten</li>
            <li>Sportliche Singles</li>
            <li>Geprüfte Profile</li>
          </ul>
          <div className="button-row">
            <Link className="button button-primary" href={REGISTRATION_URL}>
              Kostenlos registrieren
            </Link>
          </div>
        </div>
      </div>

      {showRadar ? <MagazineRadarCard /> : null}

      <div className="magazine-conversion-card magazine-conversion-card-online">
        <span className="eyebrow eyebrow-muted">Gerade online</span>
        <h3>Wer ist gerade auf fitness-liebe.de online?</h3>
        <div className="magazine-online-frame-wrap">
          <iframe
            title="Gerade online auf fitness-liebe.de"
            className="magazine-online-frame"
            src={ONLINE_IFRAME_SRC}
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      <div className="magazine-conversion-card magazine-conversion-card-reasons">
        <span className="eyebrow eyebrow-muted">Warum hier?</span>
        <h3>Gute Gründe für den Einstieg</h3>
        <ul className="magazine-reason-list" aria-label="Vorteile der Singlebörse">
          <li>
            <span className="magazine-reason-icon" aria-hidden="true">💪</span>
            <span><strong>Gleicher Lebensstil</strong> statt Couch-Potato-Kompromiss</span>
          </li>
          <li>
            <span className="magazine-reason-icon" aria-hidden="true">🛡️</span>
            <span><strong>Jedes Profil geprüft</strong> vom Supportteam</span>
          </li>
          <li>
            <span className="magazine-reason-icon" aria-hidden="true">💛</span>
            <span><strong>Kostenlos starten</strong> mit der Basis-Mitgliedschaft</span>
          </li>
        </ul>
        <Link className="button button-primary magazine-reason-button" href={REGISTRATION_URL}>
          Jetzt Singles entdecken
        </Link>
      </div>
    </div>
  );
}

function RelatedArticles({ world, posts }: { world: Fitnesswelt; posts: MagazineEntry[] }) {
  if (!posts.length) return null;
  return (
    <section className="content-section related-articles" aria-labelledby="related-titel">
      <div className="related-articles-head">
        <div className="section-header">
          <span className="eyebrow eyebrow-brand">
            <span aria-hidden="true">{world.emoji}</span> Mehr aus {world.shortName}
          </span>
          <h2 id="related-titel">Das könnte dich auch interessieren</h2>
        </div>
        <Link className="related-articles-all" href={`/magazin/thema/${world.id}`}>
          Alle Artikel <span aria-hidden="true">→</span>
        </Link>
      </div>
      <div className="related-articles-grid">
        {posts.map((post) => {
          const cover = getEntryCoverImage(post);
          return (
            <Link key={post.id} href={`/magazin/${post.slug}`} className="related-article-card">
              <span className="related-article-media">
                {cover ? <img src={cover} alt="" loading="lazy" decoding="async" /> : <span>{world.emoji}</span>}
              </span>
              <span className="related-article-body">
                <small>{getReadingMinutes(post.content)} Min. Lesezeit</small>
                <strong>{post.title}</strong>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

async function loadPosts() {
  try {
    return await getMagazinePosts();
  } catch {
    return [] as MagazineEntry[];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { market, slug } = await params;
  if (!isMarketCode(market)) return {};
  const entry = await getMagazineEntryBySlug(slug);
  if (!entry) return {};

  const description = PROFILE_DESCRIPTIONS[slug] ?? metaDescription(entry);

  return {
    title: entry.seoTitle || entry.title,
    description,
    alternates: marketAlternates(market, `/magazin/${slug}`),
    robots: NOINDEX_MAGAZINE_PAGES.has(slug) ? { index: false, follow: true } : undefined,
    openGraph: {
      title: entry.seoTitle || entry.title,
      description,
      url: publicUrl(market, `/magazin/${slug}`),
      type: entry.type === "post" ? "article" : "website",
      images: entry.featuredImage ? [entry.featuredImage] : undefined,
    },
  };
}

export default async function MagazineDetailPage({ params }: PageProps) {
  const { market: marketParam, slug } = await params;
  if (!isMarketCode(marketParam)) notFound();
  const market: MarketCode = marketParam;
  const siteUrl = publicUrl(market);
  const entry = await getMagazineEntryBySlug(slug);
  if (!entry) notFound();

  const profileAuthorSlug = entry.type === "page" ? authorSlugForProfilePage(slug) : null;
  const authorProfile = profileAuthorSlug
    ? await getAuthorProfile(profileAuthorSlug)
    : entry.authorSlug
      ? await getAuthorProfile(entry.authorSlug)
      : null;
  const isProfilePage = Boolean(profileAuthorSlug);
  const pageDescription = PROFILE_DESCRIPTIONS[slug];

  // Ohne Beitragsbild wird ein Bild ganz am Anfang des Inhalts zum Artikelbild.
  const leadImage = entry.featuredImage ? null : extractLeadImage(entry.content);
  const heroImage = isProfilePage
    ? null
    : entry.featuredImage
      ? { src: entry.featuredImage, alt: entry.featuredImageAlt || entry.title }
      : leadImage
        ? { src: leadImage.image.src, alt: leadImage.image.alt || entry.title }
        : null;
  const bodyContent = enhanceAudioSummary(leadImage && !isProfilePage ? leadImage.content : entry.content);
  const faqItems = getMagazineFaqItems(bodyContent);
  const renderedContent = renderMagazineFaqSection(bodyContent, getMagazineFaqSubject(entry.title));
  const pageContent = slug === "christian" ? withChristianProfilePhoto(renderedContent) : renderedContent;
  const content = relativizeInternalLinks(stripPublishedBookSchema(pageContent), market);
  const profileGraph = buildChristianBookProfileGraph({
    slug,
    christianSlug: "christian",
    content: entry.content,
    canonicalUrl: publicUrl(market, "/magazin/christian"),
    siteUrl,
    profileName: "Christian M. Haas",
    profileDescription: CHRISTIAN_PAGE_DESCRIPTION,
    profileImage: authorProfile?.imageUrl || entry.featuredImage || undefined,
    jobTitle: authorProfile?.role || "Gründer von fitness-liebe.de, Datingexperte und Sport-Enthusiast",
    sameAs: authorProfile?.sameAs,
    knowsAbout: [
      "Online-Dating",
      "Fitness-Dating",
      "Partnersuche für sportlich aktive Singles",
      "Motivation und Balance in Beziehungen",
      "Aufbau und Betrieb von Singlebörsen",
    ],
    breadcrumb: [
      { name: "Startseite", url: siteUrl },
      { name: "Magazin", url: publicUrl(market, "/magazin") },
      { name: "Christian M. Haas", url: publicUrl(market, "/magazin/christian") },
    ],
    dateModified: entry.modified || undefined,
  });

  // Rezeptkarte an der Markierung im Beitrag, ohne Markierung direkt vor dem Text.
  const recipe = entry.type === "post" ? getRecipe(slug) : null;
  const [contentBeforeRecipe, contentAfterRecipe] = recipe
    ? content.search(RECIPE_CARD_MARKER) === -1
      ? ["", content]
      : content.split(RECIPE_CARD_MARKER, 2)
    : [content, ""];

  const world = classifyFitnesswelt(entry);
  const sidebarVariant = getMagazineSidebarVariant(world.id);
  const posts = entry.type === "post" ? await loadPosts() : [];
  const related = entriesForFitnesswelt(world.id, posts)
    .filter((post) => post.slug !== slug)
    .slice(0, 3);
  const faqGraph = buildMagazineFaqGraph({
    items: faqItems,
    pageUrl: publicUrl(market, `/magazin/${slug}`),
    pageName: `Häufige Fragen zu ${decodeHtmlEntities(entry.title)}`,
  });
  const articleAuthor = authorProfile
    ? { "@type": authorProfile.slug === "redaktion" ? "Organization" : "Person", name: authorProfile.name, url: publicUrl(market, authorProfile.profileUrl) }
    : undefined;
  const recipeNode = recipe
    ? buildRecipeNode({
        recipe,
        pageUrl: publicUrl(market, `/magazin/${slug}`),
        image: heroImage?.src,
        datePublished: entry.date,
        dateModified: entry.modified || entry.date,
        author: articleAuthor,
        inLanguage: getMarket(market).locale,
      })
    : null;
  const articleGraph =
    entry.type === "post"
      ? {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "BlogPosting",
              "@id": `${publicUrl(market, `/magazin/${slug}`)}#article`,
              headline: entry.title,
              description: metaDescription(entry),
              image: heroImage?.src,
              datePublished: entry.date,
              dateModified: entry.modified || entry.date,
              inLanguage: getMarket(market).locale,
              mainEntityOfPage: publicUrl(market, `/magazin/${slug}`),
              author: articleAuthor,
              publisher: { "@type": "Organization", name: "fitness-liebe.de", url: siteUrl },
              articleSection: world.name,
              about: recipeNode ? { "@id": recipeNode["@id"] } : undefined,
            },
            ...(recipeNode ? [recipeNode] : []),
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Magazin", item: publicUrl(market, "/magazin") },
                { "@type": "ListItem", position: 2, name: world.name, item: publicUrl(market, `/magazin/thema/${world.id}`) },
                { "@type": "ListItem", position: 3, name: entry.title, item: publicUrl(market, `/magazin/${slug}`) },
              ],
            },
          ],
        }
      : null;

  return (
    <main className="shell shell-narrow magazine-detail-shell">
      {[profileGraph, faqGraph, articleGraph].map((graph, index) =>
        graph ? (
          <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(graph) }} />
        ) : null,
      )}

      {entry.type === "post" ? (
        <nav className="thema-breadcrumb article-breadcrumb" aria-label="Brotkrumen">
          <Link href="/magazin">Magazin</Link>
          <span aria-hidden="true">›</span>
          <Link href={`/magazin/thema/${world.id}`}>{world.shortName}</Link>
        </nav>
      ) : null}

      <section className="hero-card hero-magazine">
        <span className="eyebrow">
          {isProfilePage ? "Autorenprofil" : entry.type === "post" ? `${world.emoji} ${world.name}` : "Magazin-Seite"}
        </span>
        <h1>{entry.title}</h1>
        <p>{pageDescription ?? heroText(entry)}</p>
        {recipe ? <RecipeHeroFacts recipe={recipe} /> : null}
        <div className="meta-row">
          {entry.authorName && !isProfilePage ? (
            <span>
              Von {authorProfile ? <Link href={authorProfile.profileUrl}>{authorProfile.name}</Link> : entry.authorName}
            </span>
          ) : null}
          {getUpdatedDate(entry) && entry.type === "post" ? <span>{formatUpdatedDate(entry)}</span> : null}
          {entry.type === "post" ? <span>{getReadingMinutes(entry.content)} Min. Lesezeit</span> : null}
          <Link className="button button-primary meta-row-cta" href={REGISTRATION_URL}>
            Kostenlos registrieren
          </Link>
        </div>
      </section>

      {isProfilePage && authorProfile ? (
        <section className="content-section">
          <AuthorProfileFacts profile={authorProfile} />
        </section>
      ) : null}

      {slug === "christian" ? (
        <section className="content-section">
          <PublishedBookFeature />
        </section>
      ) : null}

      {heroImage ? (
        <section className="content-section">
          <figure className="article-hero-media">
            <img src={heroImage.src} alt={heroImage.alt} loading="eager" decoding="async" />
          </figure>
        </section>
      ) : null}

      <section className="content-section magazine-mobile-conversion">
        <MagazineConversionRail title={entry.title} variant={sidebarVariant} />
      </section>

      <section className="content-section magazine-detail-content-section">
        <div className="magazine-detail-layout">
          <div className="magazine-detail-main">
            <section className="rich-content">
              {contentBeforeRecipe ? <div dangerouslySetInnerHTML={{ __html: contentBeforeRecipe }} /> : null}
              {recipe ? <RecipeCard recipe={recipe} /> : null}
              {contentAfterRecipe ? <div dangerouslySetInnerHTML={{ __html: contentAfterRecipe }} /> : null}
            </section>
          </div>
          <aside className="magazine-detail-side" aria-label="Singlebörse und Conversion-Module">
            <MagazineConversionRail title={entry.title} variant={sidebarVariant} showRadar />
          </aside>
        </div>
      </section>

      {/* Mobil ohne Sidebar: Radar nach dem Artikel statt davor, damit der Inhalt oben bleibt */}
      <section className="content-section magazine-mobile-conversion magazine-mobile-radar">
        <MagazineRadarCard />
      </section>

      {entry.type === "post" ? <RelatedArticles world={world} posts={related} /> : null}

      {authorProfile && !isProfilePage ? (
        <section className="content-section">
          <ExpertTrustCard
            profile={authorProfile}
            variant="compact"
            eyebrow={
              authorProfile.slug === "christian-m-haas"
                ? "Unser Datingexperte"
                : authorProfile.slug === "gazi"
                  ? "Unser Personaltrainer"
                  : "Magazin-Autor"
            }
            primaryLabel={`Mehr über ${authorProfile.name}`}
          />
        </section>
      ) : null}
    </main>
  );
}
