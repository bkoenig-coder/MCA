import { useEffect, useState } from 'react';

// The opening carpet and the parts of the page that should not compete with it for the phone's attention
// (the hero video, the chat helper, the cookie banner). The carpet says when it starts and when it is done;
// everything else waits for "done".

export const INTRO_DONE_EVENT = 'mca-intro-done';

let playing = false;

export function setIntroPlaying(value: boolean) {
  playing = value;
  if (!value && typeof window !== 'undefined') window.dispatchEvent(new Event(INTRO_DONE_EVENT));
}

export function isIntroPlaying() {
  return playing;
}

/** Runs `start` straight away when no opening is playing, otherwise once it has finished. Returns a cleanup. */
export function afterIntro(start: () => void): () => void {
  if (!playing) {
    start();
    return () => {};
  }
  const onDone = () => start();
  window.addEventListener(INTRO_DONE_EVENT, onDone, { once: true });
  return () => window.removeEventListener(INTRO_DONE_EVENT, onDone);
}

/** True once the opening is over (or when there is none). */
export function useAfterIntro(): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => afterIntro(() => setReady(true)), []);
  return ready;
}
