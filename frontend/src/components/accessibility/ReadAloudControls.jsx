import { Pause, Play, Square, Volume2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "../../context/LanguageContext.jsx";
import useTextToSpeech from "../../hooks/useTextToSpeech.js";

const SPEED_OPTIONS = [0.75, 1, 1.25, 1.5];
const CONTINUOUS_PAGE_DELAY = 650;

export default function ReadAloudControls({ text, lang, readKey, onReadNextPage, canReadNext = false, className = "" }) {
  const { t } = useLanguage();
  const [collapsed, setCollapsed] = useState(false);
  const continuousRef = useRef(false);
  const speakRef = useRef(null);
  const stopRef = useRef(null);
  const continuousEndRef = useRef(null);
  const {
    isSupported,
    speak,
    pause,
    resume,
    stop,
    isSpeaking,
    isPaused,
    isContinuous,
    setIsContinuous,
    rate,
    setRate,
    volume,
    setVolume,
  } = useTextToSpeech();

  const canRead = isSupported && Boolean(String(text || "").trim());

  useEffect(() => {
    speakRef.current = speak;
    stopRef.current = stop;
  }, [speak, stop]);

  const setContinuousMode = useCallback((value) => {
    continuousRef.current = value;
    setIsContinuous(value);
  }, [setIsContinuous]);

  const handleContinuousEnd = useCallback(() => {
    if (!continuousRef.current) return;
    if (canReadNext && typeof onReadNextPage === "function") {
      onReadNextPage();
      return;
    }
    setContinuousMode(false);
  }, [canReadNext, onReadNextPage, setContinuousMode]);

  useEffect(() => {
    continuousEndRef.current = handleContinuousEnd;
  }, [handleContinuousEnd]);

  const readCurrentPage = useCallback(() => {
    setContinuousMode(false);
    speak(text, { lang, continuous: false });
  }, [lang, setContinuousMode, speak, text]);

  const readAll = useCallback(() => {
    setContinuousMode(true);
    speak(text, { lang, continuous: true, onEnd: handleContinuousEnd });
  }, [handleContinuousEnd, lang, setContinuousMode, speak, text]);

  const stopReading = useCallback(() => {
    setContinuousMode(false);
    stop();
  }, [setContinuousMode, stop]);

  useEffect(() => {
    const shouldContinue = continuousRef.current;
    stopRef.current?.({ keepContinuous: shouldContinue });
    if (!shouldContinue || !canRead) {
      if (shouldContinue && !canRead) setContinuousMode(false);
      return undefined;
    }

    const timer = window.setTimeout(() => {
      if (!continuousRef.current) return;
      speakRef.current?.(text, { lang, continuous: true, onEnd: () => continuousEndRef.current?.() });
    }, CONTINUOUS_PAGE_DELAY);

    return () => window.clearTimeout(timer);
  }, [canRead, lang, readKey, setContinuousMode, text]);

  useEffect(() => () => stopReading(), [stopReading]);

  if (!isSupported) {
    return (
      <div className={`read-aloud-controls read-aloud-controls-unavailable ${className}`} role="status">
        <Volume2 aria-hidden="true" />
        <span>{t("readAloud.notSupported")}</span>
      </div>
    );
  }

  return (
    <section className={`read-aloud-controls ${collapsed ? "read-aloud-collapsed" : ""} ${className}`} aria-label={t("readAloud.title")}>
      <div className="read-aloud-header">
        <span className="read-aloud-title">
          <Volume2 aria-hidden="true" />
          <span>{t("readAloud.title")}</span>
        </span>
        <button
          type="button"
          className="read-aloud-collapse"
          onClick={() => setCollapsed((value) => !value)}
          aria-label={collapsed ? t("readAloud.showControls") : t("readAloud.hideControls")}
          title={collapsed ? t("readAloud.showControls") : t("readAloud.hideControls")}
        >
          {collapsed ? "+" : "−"}
        </button>
      </div>

      <div className="read-aloud-body">
        <button
          type="button"
          className="read-aloud-button read-aloud-primary"
          onClick={readCurrentPage}
          disabled={!canRead}
          aria-label={t("readAloud.readPage")}
          title={t("readAloud.readPage")}
        >
          <Play aria-hidden="true" />
          <span>{t("readAloud.readPage")}</span>
        </button>
        <button
          type="button"
          className={`read-aloud-button ${isContinuous ? "read-aloud-active" : ""}`}
          onClick={readAll}
          disabled={!canRead || isContinuous}
          aria-label={t("readAloud.readWholeBook")}
          title={t("readAloud.readWholeBook")}
        >
          <Play aria-hidden="true" />
          <span>{isContinuous ? t("readAloud.readingAll") : t("readAloud.readAll")}</span>
        </button>
        <button
          type="button"
          className="read-aloud-button"
          onClick={pause}
          disabled={!isSpeaking || isPaused}
          aria-label={t("readAloud.pause")}
          title={t("readAloud.pause")}
        >
          <Pause aria-hidden="true" />
          <span>{t("readAloud.pause")}</span>
        </button>
        <button
          type="button"
          className="read-aloud-button"
          onClick={resume}
          disabled={!isPaused}
          aria-label={t("readAloud.resume")}
          title={t("readAloud.resume")}
        >
          <Play aria-hidden="true" />
          <span>{t("readAloud.resume")}</span>
        </button>
        <button
          type="button"
          className="read-aloud-button"
          onClick={stopReading}
          disabled={!isSpeaking && !isPaused && !isContinuous}
          aria-label={t("readAloud.stop")}
          title={t("readAloud.stop")}
        >
          <Square aria-hidden="true" />
          <span>{t("readAloud.stop")}</span>
        </button>
        <label className="read-aloud-speed">
          <span>{t("readAloud.speed")}</span>
          <select
            value={String(rate)}
            onChange={(event) => setRate(event.target.value)}
            aria-label={t("readAloud.speed")}
            title={t("readAloud.speed")}
          >
            {SPEED_OPTIONS.map((option) => (
              <option key={option} value={String(option)}>
                {option}x
              </option>
            ))}
          </select>
        </label>
        <div className="read-aloud-volume" role="group" aria-label={t("readAloud.volume")}>
          <span>{t("readAloud.volume")}</span>
          <div className="read-aloud-volume-row">
            <button
              type="button"
              className="read-aloud-step-button"
              onClick={() => setVolume(volume - 0.1)}
              disabled={volume <= 0}
              aria-label={t("readAloud.decreaseVolume")}
              title={t("readAloud.decreaseVolume")}
            >
              -
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(event) => setVolume(event.target.value)}
              aria-label={t("readAloud.volume")}
              title={t("readAloud.volume")}
            />
            <button
              type="button"
              className="read-aloud-step-button"
              onClick={() => setVolume(volume + 0.1)}
              disabled={volume >= 1}
              aria-label={t("readAloud.increaseVolume")}
              title={t("readAloud.increaseVolume")}
            >
              +
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
