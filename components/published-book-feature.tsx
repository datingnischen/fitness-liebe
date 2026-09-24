import { PUBLISHED_BOOK } from "@/lib/christian-book-profile-schema";
import { staticAsset } from "@/lib/static-asset";

function formatIsbn(isbn: string) {
  return `${isbn.slice(0, 3)}-${isbn.slice(3, 4)}-${isbn.slice(4, 8)}-${isbn.slice(8, 12)}-${isbn.slice(12)}`;
}

export function PublishedBookFeature() {
  return (
    <section className="published-book-feature" aria-labelledby="published-book-title">
      <div className="published-book-visual" aria-hidden="true">
        <div className="published-book-cover">
          <img
            src={staticAsset("/images/books/dating-ohne-bullshit-cover.webp")}
            alt=""
            width={1748}
            height={2480}
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>

      <div className="published-book-copy">
        <span className="eyebrow">Buch von Christian M. Haas</span>
        <h2 id="published-book-title">{PUBLISHED_BOOK.name}</h2>
        <p className="published-book-subtitle">{PUBLISHED_BOOK.subtitle}</p>
        <p className="published-book-hook">
          Kein Datingratgeber, sondern ein ehrlicher Blick hinter die Kulissen: auf den Aufbau von Datingplattformen,
          unternehmerische Entscheidungen, Rückschläge und die Verantwortung hinter digitalen Begegnungen.
        </p>
        <ul className="published-book-facts" aria-label="Buchdetails">
          <li>Taschenbuch</li>
          <li>{PUBLISHED_BOOK.numberOfPages} Seiten</li>
          <li>{PUBLISHED_BOOK.edition}</li>
          <li>{PUBLISHED_BOOK.publisher}</li>
          <li>ISBN {formatIsbn(PUBLISHED_BOOK.isbn)}</li>
        </ul>
        <a className="published-book-cta" href={PUBLISHED_BOOK.amazonUrl} target="_blank" rel="noopener noreferrer nofollow">
          Buch bei Amazon ansehen
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  );
}
