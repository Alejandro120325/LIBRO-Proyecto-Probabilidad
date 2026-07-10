import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const DEFAULT_RATE = 1;
const DEFAULT_VOLUME = 1;
const DEFAULT_PITCH = 1;
const MIN_RATE = 0.5;
const MAX_RATE = 2;
const MIN_VOLUME = 0;
const MAX_VOLUME = 1;
const VOLUME_STORAGE_KEY = "readAloudVolume";
const VOICE_STORAGE_KEY = "readAloudVoiceURI";
const FRIENDLY_VOICE_KEYWORDS = [
  "google",
  "microsoft",
  "natural",
  "online",
  "neural",
  "helena",
  "sabina",
  "pablo",
  "jorge",
  "monica",
  "david",
  "mark",
  "jenny",
  "aria",
];

function canUseSpeechSynthesis() {
  return typeof window !== "undefined"
    && "speechSynthesis" in window
    && "SpeechSynthesisUtterance" in window;
}

function normalizeRate(value) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return DEFAULT_RATE;
  return Math.min(MAX_RATE, Math.max(MIN_RATE, numericValue));
}

function normalizeVolume(value) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return DEFAULT_VOLUME;
  return Math.round(Math.min(MAX_VOLUME, Math.max(MIN_VOLUME, numericValue)) * 10) / 10;
}

function getStoredValue(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function setStoredValue(key, value) {
  try {
    localStorage.setItem(key, String(value));
  } catch {
    // localStorage puede estar bloqueado por privacidad; la lectura sigue funcionando.
  }
}

function getLanguagePreferences(lang) {
  const normalizedLang = String(lang || "").toLowerCase();
  if (normalizedLang.startsWith("en")) return ["en-US", "en-GB", "en"];
  return ["es-ES", "es-MX", "es-US", "es"];
}

function voiceMatchesLanguage(voice, lang) {
  const voiceLang = voice?.lang?.toLowerCase();
  if (!voiceLang) return false;
  return getLanguagePreferences(lang).some((preferredLang) => {
    const normalizedPreferred = preferredLang.toLowerCase();
    return voiceLang === normalizedPreferred || voiceLang.startsWith(`${normalizedPreferred}-`) || voiceLang.startsWith(normalizedPreferred);
  });
}

function scoreVoice(voice, lang) {
  const voiceLang = voice?.lang?.toLowerCase() || "";
  const voiceName = voice?.name?.toLowerCase() || "";
  const languagePreferences = getLanguagePreferences(lang).map((item) => item.toLowerCase());
  const languageScore = languagePreferences.reduce((score, preferredLang, index) => {
    if (voiceLang === preferredLang) return Math.max(score, 120 - index * 12);
    if (voiceLang.startsWith(`${preferredLang}-`) || voiceLang.startsWith(preferredLang)) return Math.max(score, 90 - index * 10);
    return score;
  }, 0);
  const friendlyScore = FRIENDLY_VOICE_KEYWORDS.some((keyword) => voiceName.includes(keyword)) ? 35 : 0;
  const serviceScore = voice?.localService === false ? 8 : 0;
  return languageScore + friendlyScore + serviceScore;
}

function findVoiceForLanguage(voices, lang, preferredVoiceURI) {
  if (!Array.isArray(voices) || voices.length === 0) return null;
  const storedVoice = preferredVoiceURI ? voices.find((voice) => voice.voiceURI === preferredVoiceURI && voiceMatchesLanguage(voice, lang)) : null;
  if (storedVoice) return storedVoice;

  return voices
    .filter((voice) => voiceMatchesLanguage(voice, lang))
    .sort((first, second) => scoreVoice(second, lang) - scoreVoice(first, lang))[0] || null;
}

export function useTextToSpeech() {
  const isSupported = useMemo(canUseSpeechSynthesis, []);
  const utteranceRef = useRef(null);
  const preferredVoiceURIRef = useRef(getStoredValue(VOICE_STORAGE_KEY));
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isContinuous, setIsContinuous] = useState(false);
  const [rate, setRateState] = useState(DEFAULT_RATE);
  const [volume, setVolumeState] = useState(() => normalizeVolume(getStoredValue(VOLUME_STORAGE_KEY) ?? DEFAULT_VOLUME));

  useEffect(() => {
    if (!isSupported) return undefined;

    const synthesis = window.speechSynthesis;
    const updateVoices = () => {
      const availableVoices = synthesis.getVoices();
      setVoices(availableVoices);
      setSelectedVoice((currentVoice) => currentVoice || availableVoices.find((voice) => voice.voiceURI === preferredVoiceURIRef.current) || null);
    };

    updateVoices();
    synthesis.addEventListener?.("voiceschanged", updateVoices);

    return () => {
      synthesis.removeEventListener?.("voiceschanged", updateVoices);
      synthesis.cancel();
    };
  }, [isSupported]);

  const setRate = useCallback((value) => {
    setRateState(normalizeRate(value));
  }, []);

  const setVolume = useCallback((value) => {
    const safeVolume = normalizeVolume(value);
    setVolumeState(safeVolume);
    setStoredValue(VOLUME_STORAGE_KEY, safeVolume);
  }, []);

  const selectVoice = useCallback((voice) => {
    if (!voice) {
      preferredVoiceURIRef.current = null;
      setSelectedVoice(null);
      return;
    }
    preferredVoiceURIRef.current = voice.voiceURI;
    setStoredValue(VOICE_STORAGE_KEY, voice.voiceURI);
    setSelectedVoice(voice);
  }, []);

  const stop = useCallback((options = {}) => {
    if (!isSupported) return;
    const { keepContinuous = false } = options;
    utteranceRef.current = null;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    if (!keepContinuous) setIsContinuous(false);
  }, [isSupported]);

  const getVoice = useCallback((lang) => {
    const selectedVoiceMatchesLanguage = voiceMatchesLanguage(selectedVoice, lang);

    return selectedVoiceMatchesLanguage ? selectedVoice : findVoiceForLanguage(voices, lang, preferredVoiceURIRef.current);
  }, [selectedVoice, voices]);

  const speak = useCallback((text, options = "es-MX") => {
    if (!isSupported) return;

    const settings = typeof options === "string" ? { lang: options } : options || {};
    const {
      lang = "es-MX",
      continuous = false,
      onEnd,
    } = settings;
    const readableText = String(text || "").replace(/\s+/g, " ").trim();
    if (!readableText) return;

    stop({ keepContinuous: true });
    setIsContinuous(Boolean(continuous));

    const utterance = new SpeechSynthesisUtterance(readableText);
    const voice = getVoice(lang);

    utterance.lang = lang;
    utterance.rate = rate;
    utterance.pitch = DEFAULT_PITCH;
    utterance.volume = volume;
    if (voice) {
      utterance.voice = voice;
      selectVoice(voice);
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onpause = () => {
      setIsPaused(true);
    };

    utterance.onresume = () => {
      setIsPaused(false);
    };

    const finish = (event) => {
      if (utteranceRef.current !== utterance) return;
      utteranceRef.current = null;
      setIsSpeaking(false);
      setIsPaused(false);
      if (event?.type === "end" && typeof onEnd === "function") {
        onEnd();
      }
    };

    utterance.onend = finish;
    utterance.onerror = finish;

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [getVoice, isSupported, rate, selectVoice, stop, volume]);

  const pause = useCallback(() => {
    if (!isSupported || !window.speechSynthesis.speaking || window.speechSynthesis.paused) return;
    window.speechSynthesis.pause();
    setIsPaused(true);
  }, [isSupported]);

  const resume = useCallback(() => {
    if (!isSupported || !window.speechSynthesis.paused) return;
    window.speechSynthesis.resume();
    setIsSpeaking(true);
    setIsPaused(false);
  }, [isSupported]);

  return {
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
    voices,
    selectedVoice,
    setSelectedVoice: selectVoice,
  };
}

export default useTextToSpeech;
