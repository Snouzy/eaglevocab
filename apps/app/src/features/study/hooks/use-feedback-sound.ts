import { useEffect, useRef } from "react";

const SOUND_MAP: Record<number, string> = {
  1: "/sounds/again.mp3",
  2: "/sounds/hard.mp3",
  3: "/sounds/good.mp3",
  4: "/sounds/easy.mp3",
};

export function useFeedbackSound() {
  const audioRef = useRef<Record<number, HTMLAudioElement>>({});

  useEffect(() => {
    if (typeof window === "undefined") return;

    for (const [quality, src] of Object.entries(SOUND_MAP)) {
      const audio = new Audio(src);
      audio.preload = "auto";
      audio.volume = 0.5;
      audioRef.current[Number(quality)] = audio;
    }

    return () => {
      for (const audio of Object.values(audioRef.current)) {
        audio.pause();
        audio.src = "";
      }
      audioRef.current = {};
    };
  }, []);

  const play = (quality: number) => {
    const audio = audioRef.current[quality];
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  };

  return { play };
}
