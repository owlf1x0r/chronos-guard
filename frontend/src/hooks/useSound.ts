'use client';

import { useState, useCallback, useEffect } from 'react';

export function useSound(soundPath: string) {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    setAudio(new Audio(soundPath));
  }, [soundPath]);

  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
        audio.removeAttribute('src');
      }
    };
  }, [audio]);

  const play = useCallback(() => {
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch((error) => console.log(`Audio play failed for sound at ${soundPath}:`, error));
    }
  }, [audio, soundPath]);

  const pause = useCallback(() => {
    if (audio) {
      audio.pause();
    }
  }, [audio]);

  const handleVolume = useCallback(
    (volume: number) => {
      if (audio) {
        audio.volume = volume;
      }
    },
    [audio]
  );

  const handleMute = useCallback(
    (muted: boolean) => {
      if (audio) {
        audio.muted = muted;
      }
    },
    [audio]
  );

  return { play, pause, handleVolume, handleMute };
}
