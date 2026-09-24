import type { Metadata } from "next";
import Link from "@/components/local-link";
import { ExpertTrustCard } from "@/components/expert-trust-card";
import { getAuthorProfile } from "@/lib/author-profiles";
import { DATING_TIPS_PATH, datingTipsCanonical } from "@/lib/about-section";
import { buildMagazineFaqGraph } from "@/lib/magazine-faq";
import { serializeJsonLd } from "@/lib/json-ld";
import { resolveMarket, type MarketParams } from "@/lib/market-params";
import { REGISTRATION_URL, marketAlternates, platformUrl } from "@/lib/markets";

export const revalidate = 3600;

const TITLE = "Dating-Tipps: So gelingt die Partnersuche online";
const DESCRIPTION =
  "Bleib du selbst, zeig dich mit Foto, schreib persönliche Nachrichten und bleib sicher: Die wichtigsten Dating-Tipps von fitness-liebe.de für einen erfolgreichen Start.";
const HERO_IMAGE =
  "https://static-cms.icony-hosting.de/cms/1B040717C56536027BF524577D5C2FB40C39C2BEE4EDF2383F38D555768DC901/1000/iStock-1197834456.jpg";

// Texte der bisherigen ICONY-Seite fitness-liebe.de/dating-tipps/
const TIPS = [
  {
    icon: "🙂",
    title: "Das Wichtigste zuerst: Bleibe Du selbst!",
    text: "Respekt, Ehrlichkeit und Offenheit sind die Faktoren, die die Partnersuche im Internet zum Erfolg führen. Du willst schließlich jemanden kennenlernen, der Dich so mag, wie Du bist! Je lockerer und entspannter du an die Sache gehst, desto authentischer und natürlicher wirkst du auf andere.",
  },
  {
    icon: "✍️",
    title: "Der erste Eindruck zählt!",
    text: "Fülle Dein Profil so vollständig wie möglich aus! So kannst Du zeigen, was dich ausmacht, und andere Mitglieder können sich ein besseres Bild von Dir machen. Versuche einen positiven oder humorvollen Ton an den Tag zu legen und achte auf Grammatik und Rechtschreibung.",
  },
  {
    icon: "📸",
    title: "Apropos Bild: Lade ein Foto von Dir hoch!",
    text: "Mit einem Profilbild kannst Du nicht nur die Bilder von anderen Mitgliedern sehen – Mitglieder mit Profilbild werden außerdem 7 mal so häufig angeschrieben wie Mitglieder ohne Bild! Am besten entscheidest Du dich für ein aktuelles Foto, auf dem Du lächelst und gut zu erkennen bist.",
  },
  {
    icon: "💬",
    title: "Sei kommunikativ und interessiert!",
    text: "Ergreife die Initiative, hab Mut und mach den Anfang. Schreibe immer persönliche Nachrichten, nimm Bezug auf etwas, das Du an der anderen Person interessant findest, mach Komplimente und stelle offene Fragen – so habt ihr den perfekten Gesprächsstart!",
  },
  {
    icon: "🔒",
    title: "Geh auf Nummer sicher!",
    text: "Unsere Plattform bietet Dir einen sicheren Rahmen für das Kennenlernen. Nutze daher unseren Chat und gib nicht zu früh Deine Telefonnummer oder E-Mail-Adresse weiter. Allgemein solltest Du stets vorsichtig sein, wenn es um das Teilen Deiner persönlichen Daten geht!",
  },
  {
    icon: "🏃",
    title: "Nicht gleich aufgeben!",
    text: "Vielleicht funktioniert das Online-Flirten nicht sofort so, wie Du das möchtest. Aber gib nicht zu schnell auf – manchmal braucht es einfach etwas Zeit und Übung. Setze dein Gegenüber nicht unter Druck, bleibe locker, entspannt und stets freundlich im Umgangston.",
  },
  {
    icon: "⭐",
    title: "Werde Premium-Mitglied!",
    text: "Premium-Mitglieder können nicht nur beliebig viele Nachrichten an alle Mitglieder schreiben, sondern auch von jedem Mitglied sofort Nachrichten empfangen. Zudem erhältst Du viele weitere Vorteile.",
    premium: true,
  },
];

const FAQ = [
  {
    question: "Wie schreibe ich die erste Nachricht beim Fitness-Dating?",
    answer:
      "Nimm Bezug auf etwas aus dem Profil – etwa eine Sportart, eine Laufstrecke oder ein Trainingsziel – und stelle eine offene Frage. So zeigst du echtes Interesse statt einer austauschbaren Standardnachricht.",
  },
  {
    question: "Welches Profilbild eignet sich für sportliche Singles?",
    answer:
      "Ein aktuelles, natürliches Foto, auf dem du lächelst und gut zu erkennen bist. Gern in sportlicher Umgebung – entscheidend ist, dass es echt wirkt.",
  },
  {
    question: "Wann sollte ich meine Telefonnummer weitergeben?",
    answer: "Erst wenn du dich sicher fühlst. Bis dahin ist der Chat auf der Plattform der geschützte Rahmen zum Kennenlernen.",
  },
];

const faqItems = FAQ.map((item, index) => ({
  id: `faq-${index + 1}`,
  question: item.question,
  answerHtml: item.answer,
  answerText: item.answer,
}));

type PageProps = { params: MarketParams };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const market = await resolveMarket(params);
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: marketAlternates(market, DATING_TIPS_PATH),
    openGraph: { title: TITLE, description: DESCRIPTION, url: datingTipsCanonical(market), images: [HERO_IMAGE] },
  };
}

export default async function DatingTipsPage({ params }: PageProps) {
  const market = await resolveMarket(params);
  const expert = await getAuthorProfile("christian-m-haas");
  const faqGraph = buildMagazineFaqGraph({ items: faqItems, pageUrl: datingTipsCanonical(market), pageName: "Häufige Fragen zu Dating-Tipps" });

  return (
    <main className="shell shell-narrow">
      {faqGraph ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqGraph) }} /> : null}

      <section className="hero-card hero-brand social-hero">
        <div className="social-hero-copy">
          <span className="eyebrow">Dating-Tipps</span>
          <h1>{TITLE}</h1>
          <p>
            Online-Dating ist eine großartige Möglichkeit, neue Menschen kennenzulernen. Damit Du von Anfang an die
            bestmöglichen Chancen hast, haben wir die wichtigsten Tipps zusammengefasst – online flirten ist leichter als
            gedacht!
          </p>
          <div className="button-row">
            <a className="button button-primary" href={REGISTRATION_URL}>
              Kostenlos registrieren
            </a>
            <Link className="button button-secondary" href="/magazin/thema/fitness-dating">
              Mehr Fitness-Dating
            </Link>
          </div>
        </div>
        <figure className="social-hero-media">
          <img src={HERO_IMAGE} alt="Dating-Tipps" loading="eager" decoding="async" />
        </figure>
      </section>

      <section className="content-section">
        <ol className="tips-list">
          {TIPS.map((tip, index) => (
            <li key={tip.title} className="tips-item">
              <span className="tips-number" aria-hidden="true">
                <span>{tip.icon}</span>
                <small>{String(index + 1).padStart(2, "0")}</small>
              </span>
              <div className="tips-copy">
                <h2>{tip.title}</h2>
                <p>{tip.text}</p>
                {tip.premium ? (
                  <a className="button button-secondary" href={platformUrl("/premium-mitgliedschaft.html")}>
                    Premium-Vorteile ansehen
                  </a>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="breed-faq-card" id="faq" aria-labelledby="faq-titel">
        <div className="breed-faq-header">
          <span className="eyebrow eyebrow-brand">FAQ</span>
          <h2 id="faq-titel">Häufige Fragen</h2>
        </div>
        <div className="breed-faq-list">
          {faqItems.map((item, index) => (
            <details key={item.id} className="breed-faq-item" id={item.id} open={index === 0}>
              <summary>{item.question}</summary>
              <div className="breed-faq-answer">
                <p>{item.answerText}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      {expert ? (
        <section className="content-section">
          <ExpertTrustCard
            profile={expert}
            eyebrow="Unser Datingexperte"
            title="Wir wünschen Dir viel Spaß und Erfolg bei der Partnersuche!"
            primaryLabel="Zum Expertenprofil"
          />
        </section>
      ) : null}
    </main>
  );
}
