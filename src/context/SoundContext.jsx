import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { isPlaying, onSoundChange, toggleAmbient } from "../lib/ambient";

const SoundContext = createContext({ playing: false, toggle: () => {} });

/**
 * Ambient sound state shared by Navigation, FloatDock and Hero —
 * one engine, many switches.
 */
export function SoundProvider({ children }) {
  const [playing, setPlaying] = useState(isPlaying());

  useEffect(() => onSoundChange(setPlaying), []);

  const toggle = useCallback(() => toggleAmbient(), []);

  return (
    <SoundContext.Provider value={{ playing, toggle }}>
      {children}
    </SoundContext.Provider>
  );
}

export const useAmbientSound = () => useContext(SoundContext);
