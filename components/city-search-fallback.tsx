import { LOCATION_SEARCH_URL } from "@/lib/markets";

/** Hinweis unter der Städteübersicht für alle, deren Stadt keine eigene Seite hat. */
export function CitySearchFallback() {
  return (
    <aside className="city-search-fallback" aria-labelledby="city-search-fallback-title">
      <div className="city-search-fallback-copy">
        <span className="eyebrow">Individuelle Suche</span>
        <h2 id="city-search-fallback-title">Deine Stadt fehlt? Trainiert wird überall.</h2>
        <p>
          Nicht jede Stadt hat eine eigene Seite – sportliche Singles gibt es trotzdem auch bei dir. In der individuellen Suche
          legst du Ort, Umkreis und Alter selbst fest und siehst, wer in deiner Nähe läuft, trainiert oder draußen aktiv ist.
        </p>
      </div>
      <a className="button button-primary" href={LOCATION_SEARCH_URL}>
        Zur individuellen Suche
      </a>
    </aside>
  );
}
