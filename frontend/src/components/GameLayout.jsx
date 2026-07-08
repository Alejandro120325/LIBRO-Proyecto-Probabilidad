import { ArrowLeft, ArrowRight, Check, CheckCircle2, Clock3, Lightbulb, RotateCcw, Save, Star, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Alert from "./Alert.jsx";
import { getApiErrorMessage } from "../services/api.js";
import { resultService } from "../services/resultService.js";
import { formatTime } from "../utils/format.js";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function GameLayout({ unitId, game, children }) {
  const { t } = useLanguage();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [finished, setFinished] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [startTime, setStartTime] = useState(() => Date.now());
  const [saveState, setSaveState] = useState("idle");
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    if (finished) return undefined;
    const interval = window.setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000);
    return () => window.clearInterval(interval);
  }, [finished, startTime]);

  const question = game.questions[questionIndex];
  const score = useMemo(() => answers.filter((answer, index) => answer === game.questions[index]?.answer).length, [answers, game.questions]);

  const selectAnswer = (optionIndex) => {
    if (selected !== null) return;
    setSelected(optionIndex);
    setAnswers((current) => [...current, optionIndex]);
  };

  const finishGame = async () => {
    const finalElapsed = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
    const finalAnswers = answers;
    const finalScore = finalAnswers.filter((answer, index) => answer === game.questions[index].answer).length;
    setElapsed(finalElapsed);
    setFinished(true);
    setSaveState("saving");
    try {
      await resultService.save({ unitId, topic: game.topic, gameType: game.title, score: finalScore, totalQuestions: game.questions.length, timeSeconds: finalElapsed });
      setSaveState("saved");
    } catch (error) {
      setSaveState("error");
      setSaveError(getApiErrorMessage(error));
    }
  };

  const nextQuestion = () => {
    if (selected === null) return;
    if (questionIndex === game.questions.length - 1) finishGame();
    else {
      setQuestionIndex((value) => value + 1);
      setSelected(null);
    }
  };

  const retry = () => {
    setQuestionIndex(0); setAnswers([]); setSelected(null); setFinished(false); setElapsed(0);
    setStartTime(Date.now()); setSaveState("idle"); setSaveError("");
  };

  if (finished) {
    const percentage = Math.round((score / game.questions.length) * 100);
    const passed = percentage >= 60;
    return (
      <div className="game-result page-enter">
        <div className={`result-orbit ${passed ? "result-passed" : "result-retry"}`} style={{ "--score": `${percentage}%` }}><div><strong>{percentage}%</strong><span>{t("game.of", { score, total: game.questions.length })}</span></div></div>
        <p className="mt-7 text-xs font-bold uppercase tracking-[.2em] text-cyan-300">{t("game.final")}</p>
        <h1 className="mt-2 text-3xl font-black text-white">{passed ? t("game.passed") : t("game.tryAgain")}</h1>
        <p className="mx-auto mt-3 max-w-xl leading-7 text-slate-400">{passed ? t("game.passedText") : t("game.tryText")}</p>
        <div className="mx-auto mt-6 flex max-w-md items-center justify-center gap-6 rounded-2xl border border-white/8 bg-white/[.035] p-4 text-sm"><span><Check className="mr-1 inline size-4 text-emerald-300" />{t("game.correctCount", { count: score })}</span><span><X className="mr-1 inline size-4 text-rose-300" />{t("game.wrongCount", { count: game.questions.length - score })}</span><span><Clock3 className="mr-1 inline size-4 text-cyan-300" />{formatTime(elapsed)}</span></div>
        <div className="mx-auto mt-5 max-w-xl">{saveState === "saving" && <p className="text-sm text-slate-400"><Save className="mr-2 inline size-4 animate-pulse" />{t("game.saving")}</p>}{saveState === "saved" && <Alert type="success">{t("game.saved")}</Alert>}{saveState === "error" && <Alert>{saveError}</Alert>}</div>
        <div className="mt-7 flex flex-wrap justify-center gap-3"><button onClick={retry} className="button button-ghost"><RotateCcw className="size-4" />{t("game.retry")}</button><Link to="/book" className="button button-outline">{t("game.back")}</Link><Link to="/my-results" className="button button-primary">{t("game.viewResults")}<ArrowRight className="size-4" /></Link></div>
        <div className="mx-auto mt-10 max-w-3xl text-left"><h2 className="text-lg font-bold text-white">{t("game.review")}</h2><div className="mt-4 space-y-3">{game.questions.map((item, index) => { const correct = answers[index] === item.answer; return <details key={item.prompt} className="review-item"><summary><span className={correct ? "text-emerald-300" : "text-rose-300"}>{correct ? <CheckCircle2 /> : <X />}</span><span>{index + 1}. {item.prompt}</span></summary><p>{item.explanation}</p></details>; })}</div></div>
      </div>
    );
  }

  return (
    <div className={`mx-auto max-w-5xl page-enter game-unit-${unitId}`}>
      <div className="mb-6 flex items-center justify-between gap-4"><Link to="/book" className="inline-flex items-center gap-2 text-sm font-semibold text-stone-400 hover:text-amber-100"><ArrowLeft className="size-4" />{t("game.back")}</Link><span className="timer"><Clock3 />{formatTime(elapsed)}</span></div>
      <header className="game-header"><div><p>{t("game.challenge", { unit: unitId })}</p><h1>{game.title}</h1><span>{game.subtitle}</span></div><div className="question-count"><strong>{questionIndex + 1}</strong><span>/ {game.questions.length}</span></div></header>
      <div className="game-status-strip">
        <p><Lightbulb />{game.clue}</p>
        <strong><Star />{t("game.liveScore", { score, total: game.questions.length })}</strong>
      </div>
      <div className="game-progress"><span style={{ width: `${((questionIndex + 1) / game.questions.length) * 100}%` }} /></div>
      {children}
      <section className="question-card">
        <p className="text-xs font-bold uppercase tracking-[.18em] text-cyan-300">{t("game.question", { number: questionIndex + 1 })}</p>
        <h2 className="mt-3 text-xl font-bold leading-8 text-white sm:text-2xl">{question.prompt}</h2>
        {question.visual && <div className="game-data-chips" aria-label={t("game.dataSet")}>{question.visual.map((value, index) => <span key={`${value}-${index}`}>{value}</span>)}</div>}
        <div className="mt-7 grid gap-3 sm:grid-cols-2">{question.options.map((option, index) => { const answered = selected !== null; const isCorrect = index === question.answer; const isSelected = selected === index; let state = ""; if (answered && isCorrect) state = "option-correct"; else if (answered && isSelected) state = "option-wrong"; return <button key={option} disabled={answered} onClick={() => selectAnswer(index)} className={`answer-option ${state}`}><span>{String.fromCharCode(65 + index)}</span><strong>{option}</strong>{answered && isCorrect && <Check className="ml-auto size-5" />}{answered && isSelected && !isCorrect && <X className="ml-auto size-5" />}</button>; })}</div>
        {selected !== null && <div className={`explanation-panel ${selected === question.answer ? "explanation-correct" : "explanation-wrong"}`} role="status" aria-live="polite"><div>{selected === question.answer ? <CheckCircle2 /> : <X />}</div><p><strong>{selected === question.answer ? t("game.correct") : t("game.incorrect")}</strong><span>{question.explanation}</span></p></div>}
        <div className="mt-6 flex justify-end"><button onClick={nextQuestion} disabled={selected === null} className="button button-primary">{questionIndex === game.questions.length - 1 ? t("game.finish") : t("game.next")}<ArrowRight className="size-5" /></button></div>
      </section>
    </div>
  );
}
