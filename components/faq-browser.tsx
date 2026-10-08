"use client";

import { useMemo, useState } from "react";
import type { FaqSection } from "@/lib/faq-content";

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss");
}

/** Durchsuchbare FAQ mit Themenleiste; Treffer werden aufgeklappt. */
export function FaqBrowser({ sections, contactHref }: { sections: FaqSection[]; contactHref: string }) {
  const [query, setQuery] = useState("");
  const terms = useMemo(() => normalize(query).split(/\s+/).filter(Boolean), [query]);
  const totalQuestions = sections.reduce((sum, section) => sum + section.items.length, 0);
  const filtered = useMemo(
    () => sections
      .map((section) => ({
        ...section,
        items: terms.length
          ? section.items.filter((item) => {
              const haystack = normalize(`${item.question} ${item.answerHtml}`);
              return terms.every((term) => haystack.includes(term));
            })
          : section.items,
      }))
      .filter((section) => section.items.length > 0),
    [sections, terms],
  );
  const hits = filtered.reduce((sum, section) => sum + section.items.length, 0);

  return (
    <div className="faq-browser">
      <div className="faq-tools">
        <label className="faq-search">
          <span className="sr-only">FAQ durchsuchen</span>
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Frage suchen, z. B. Kosten oder kündigen" />
        </label>
        <p className="faq-count" aria-live="polite">{terms.length ? `${hits} Treffer` : `${totalQuestions} Fragen in ${sections.length} Themen`}</p>
        <nav className="faq-topics" aria-label="Themen">
          {sections.map((section) => (
            <a key={section.id} href={`#${section.id}`}>{section.title} <small>{section.items.length}</small></a>
          ))}
        </nav>
      </div>

      {filtered.length === 0 ? (
        <p className="faq-empty">Zu „{query}“ gibt es keine Antwort in der FAQ. Schreib uns über das <a href={contactHref}>Kontaktformular</a>.</p>
      ) : null}

      {filtered.map((section) => (
        <section key={section.id} id={section.id} className="panel-card faq-card" aria-labelledby={`${section.id}-title`}>
          <h2 id={`${section.id}-title`}>{section.title}</h2>
          {section.items.map((item) => (
            <details key={`${terms.join(" ")}|${item.question}`} open={terms.length > 0}>
              <summary>{item.question}</summary>
              <div className="faq-answer" dangerouslySetInnerHTML={{ __html: item.answerHtml }} />
            </details>
          ))}
        </section>
      ))}
    </div>
  );
}
