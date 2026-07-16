import { ExternalLink, Video } from "lucide-react";
import { getChapter } from "../../data/chapters.js";
import { unitDetails } from "../../data/bookPages.js";
import { useLanguage } from "../../context/LanguageContext.jsx";

export default function UnitVideoPage({ unit }) {
  const chapter = getChapter(unit);
  const details = unitDetails[unit] || {};
  const video = details.video || {};
  const { t, translateText } = useLanguage();
  const videoTitle = translateText(video.title || chapter?.videoTitle || t("book.video"));
  const videoTopic = translateText(video.topic || chapter?.title || details.heading || "");
  const videoDescription = translateText(video.description || details.videoPlaceholder || "");

  return (
    <div className="unit-video-page">
      <p className="book-label">{t("book.chapterVideo", { number: unit })}</p>
      <h1>{t("book.video")}</h1>
      <section className="embedded-video-card" aria-label={videoTitle}>
        <div className="video-copy">
          <span className="video-kicker"><Video /> {t("book.video")}</span>
          <p className="unit-video-topic">{videoTopic}</p>
          <h2>{videoTitle}</h2>
          <p>{videoDescription}</p>
        </div>

        {video.embedUrl ? (
          <div className="embedded-video-frame">
            <iframe
              title={videoTitle}
              src={video.embedUrl}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            />
          </div>
        ) : (
          <div className="embedded-video-placeholder"><span><Video /></span><p>{videoDescription}</p></div>
        )}

        <div className="video-actions">
          <p className="video-note">{t("book.videoInstruction")}</p>
          {video.watchUrl ? (
            <a
              className="youtube-fallback-button"
              href={video.watchUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`${t("book.openOnYouTube")}: ${videoTitle}`}
            >
              <ExternalLink /> {t("book.openOnYouTube")}
            </a>
          ) : null}
        </div>
      </section>
    </div>
  );
}
