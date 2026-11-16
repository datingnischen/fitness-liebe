import type { Metadata } from "next";
import { seoTitle } from "@/lib/seo-title";
import { clampMetaDescription } from "@/lib/meta-description";
import { FaqBrowser } from "@/components/faq-browser";
import { faqCopy, faqSections, plainAnswer } from "@/lib/faq-content";
import { serializeJsonLd } from "@/lib/json-ld";
import { resolveMarket, type MarketParams } from "@/lib/market-params";
import { REGISTRATION_URL, marketAlternates, platformUrl, publicUrl } from "@/lib/markets";

import { staticAsset } from "@/lib/static-asset";

const FAQ_IMAGE = staticAsset("/pages/faq.webp");
const FAQ_IMAGE_ALT = "Zwei Sportler im Gespräch nach dem Training im Fitnessstudio – häufige Fragen zu Fitness-Liebe.de";

export const revalidate = 3600;

type PageProps = { params: MarketParams };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const market = await resolveMarket(params);
  const copy = faqCopy(market);
  return {
    title: seoTitle(copy.title),
    description: clampMetaDescription(copy.description),
    alternates: marketAlternates(market, "/faq"),
    openGraph: { title: copy.title, description: copy.description, url: publicUrl(market, "/faq"), images: [{ url: FAQ_IMAGE, width: 1200, height: 675, alt: FAQ_IMAGE_ALT }] },
  };
}

export default async function FaqPage({ params }: PageProps) {
  const market = await resolveMarket(params);
  const copy = faqCopy(market);
  const sections = faqSections(market);
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    name: copy.title,
    url: publicUrl(market, "/faq"),
    mainEntity: sections.flatMap((section) => section.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: plainAnswer(item.answerHtml) },
    }))),
  };
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "fitness-liebe.de", item: publicUrl(market, "/") },
      { "@type": "ListItem", position: 2, name: "FAQ", item: publicUrl(market, "/faq") },
    ],
  };

  return (
    <main className="shell shell-narrow">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbs) }} />
      <section className="hero-card hero-brand">
        <span className="eyebrow">Fragen &amp; Antworten</span>
        <h1>{copy.heading}</h1>
        <p>{copy.lead}</p>
        <div className="button-row">
          <a className="button button-primary" href={REGISTRATION_URL}>Kostenlos registrieren</a>
          <a className="button button-secondary" href={platformUrl("/hilfe/")}>Hilfe &amp; Support</a>
        </div>
        <img className="faq-hero-image" src={FAQ_IMAGE} alt={FAQ_IMAGE_ALT} width={1200} height={675} loading="eager" decoding="async" />
      </section>
      <section className="content-section">
        <FaqBrowser sections={sections} contactHref={platformUrl("/kontakt/")} />
      </section>
    </main>
  );
}
