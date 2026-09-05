/**
 * Dərs nümunələrinin səsləndirilməsi — brauzerin daxili Web Speech API-si.
 * Yalnız ingilis cümlələri oxunur (izah mətni yox).
 */

const ENGLISH_LOCALE = 'en-US';
const SPEECH_RATE = 0.9;

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function speakEnglish(text: string): void {
  if (!isSpeechSupported()) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = ENGLISH_LOCALE;
  utterance.rate = SPEECH_RATE;
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
  if (!isSpeechSupported()) return;
  window.speechSynthesis.cancel();
}
