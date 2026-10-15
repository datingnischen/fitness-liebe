import Link from "@/components/local-link";
import { classifyFitnesswelt } from "@/lib/fitnesswelten";
import { formatUpdatedDate, getEntryCoverImage, getReadingMinutes, getUpdatedDate, stripHtml, type MagazineEntry } from "@/lib/magazine";

export function postTeaser(post: Pick<MagazineEntry, "excerpt" | "content">, length: number) {
  const text = stripHtml(post.excerpt || post.content);
  return text.length > length ? `${text.slice(0, length).replace(/\s+\S*$/, "")} …` : text;
}

type Props = { post: MagazineEntry; eager?: boolean; showTopic?: boolean };

// Artikelkarte für Startseite und Magazin: nur der Titel ist der Link, die ganze Karte bleibt klickbar (::after).
export function PostCard({ post, eager = false, showTopic = true }: Props) {
  const cover = getEntryCoverImage(post);
  const updated = getUpdatedDate(post) ? formatUpdatedDate(post) : null;
  return (
    <article className="post-card">
      <div className="post-card-media">
        {cover ? <img src={cover} alt={post.featuredImageAlt || post.title} loading={eager ? "eager" : "lazy"} decoding="async" /> : null}
        {showTopic ? <span className="post-card-topic">{classifyFitnesswelt(post).shortName}</span> : null}
      </div>
      <div className="post-card-body">
        <small>
          {updated ? `${updated} · ` : null}
          {getReadingMinutes(post.content)} Min.
        </small>
        <h3>
          <Link href={`/magazin/${post.slug}`}>{post.title}</Link>
        </h3>
        <p>{postTeaser(post, 130)}</p>
      </div>
    </article>
  );
}
