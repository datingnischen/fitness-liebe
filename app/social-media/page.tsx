import type { Metadata } from "next";
import Link from "next/link";
import { AuthorSocialIcon } from "@/components/author-social-icon";
import { ExpertTrustCard } from "@/components/expert-trust-card";
import { getAuthorProfile } from "@/lib/author-profiles";
import { ABOUT_OVERVIEW_PATH, aboutSocialMediaCanonical } from "@/lib/about-section";
import { REGISTRATION_URL } from "@/lib/markets";
import { SOCIAL_CHANNELS, SOCIAL_COMMUNITY } from "@/lib/social-channels";

export const revalidate = 3600;

const TITLE = "Fitness-Liebe auf Social Media";
const DESCRIPTION =
  "Folge fitness-liebe.de auf Facebook, YouTube und Pinterest – mit Community-News, Videos und Inspiration rund um Fitness, Gesundheit und Partnersuche.";
const HERO_IMAGE =
  "https://static-cms.icony-hosting.de/cms/02F8AAC1CE38A87CE7CD6DE1C824CD522D9D2CD1D8314853D41B805E6CBB6008/1000/fitness-liebe-(1).jpg";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: aboutSocialMediaCanonical() },
  openGraph: { title: TITLE, description: DESCRIPTION, url: aboutSocialMediaCanonical(), images: [HERO_IMAGE] },
};

export default async function SocialMediaPage() {
  const expert = await getAuthorProfile("christian-m-haas");

  return (
    <main className="shell shell-narrow">
      <section className="hero-card hero-brand social-hero">
        <div className="social-hero-copy">
          <span className="eyebrow">Über uns · Social Media</span>
          <h1>{TITLE}</h1>
          <p>{DESCRIPTION}</p>
          <ul className="social-hero-icons" aria-label="Unsere Kanäle">
            {SOCIAL_CHANNELS.map((channel) => (
              <li key={channel.platform}>
                <a
                  className={`social-bubble social-${channel.platform}`}
                  href={channel.href}
                  target="_blank"
                  rel="noopener"
                  aria-label={channel.name}
                >
                  <AuthorSocialIcon platform={channel.platform} size={20} />
                </a>
              </li>
            ))}
          </ul>
          <div className="button-row">
            <Link className="button button-secondary" href={ABOUT_OVERVIEW_PATH}>
              Zur Über-uns-Übersicht
            </Link>
          </div>
        </div>
        <figure className="social-hero-media">
          <img src={HERO_IMAGE} alt="Yoga am Wasser" loading="eager" decoding="async" />
        </figure>
      </section>

      <section className="content-section">
        <div className="section-header">
          <span className="eyebrow">Unsere Kanäle</span>
          <h2>Folge uns dort, wo du ohnehin scrollst</h2>
        </div>
        <div className="social-channel-grid">
          {SOCIAL_CHANNELS.map((channel) => (
            <a
              key={channel.platform}
              className={`social-channel-card social-${channel.platform}`}
              href={channel.href}
              target="_blank"
              rel="noopener"
            >
              <span className="social-channel-top">
                <span className="social-bubble">
                  <AuthorSocialIcon platform={channel.platform} size={24} />
                </span>
                <span className="social-channel-kind">{channel.kind}</span>
              </span>
              <span className="social-channel-name">{channel.name}</span>
              <span className="social-channel-handle">{channel.handle}</span>
              <span className="social-channel-text">{channel.description}</span>
              <span className="social-channel-cta">
                {channel.cta} <span aria-hidden="true">→</span>
              </span>
            </a>
          ))}
        </div>
      </section>

      <section className="content-section">
        <div className="social-community">
          <span className="social-bubble social-brand" aria-hidden="true">
            💪
          </span>
          <div className="social-community-copy">
            <span className="eyebrow">Community</span>
            <h2>{SOCIAL_COMMUNITY.name}</h2>
            <p>{SOCIAL_COMMUNITY.description}</p>
          </div>
          <a className="button button-primary" href={REGISTRATION_URL}>
            {SOCIAL_COMMUNITY.cta}
          </a>
        </div>
      </section>

      {expert ? (
        <section className="content-section">
          <ExpertTrustCard
            profile={expert}
            eyebrow="Unser Datingexperte"
            title="Bleib über die offiziellen Kanäle von fitness-liebe.de mit der Community, neuen Artikeln und Fitness-Dating-Themen in Kontakt."
            primaryLabel="Zum Expertenprofil"
          />
        </section>
      ) : null}
    </main>
  );
}
