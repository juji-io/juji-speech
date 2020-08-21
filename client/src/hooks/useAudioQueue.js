import { useEffect, useState, useCallback } from "react";

const useAudioQueue = () => {
  const [toPlay, setToPlay] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [audio, setAudio] = useState();

  const add = useCallback((sound) => {
    setToPlay((prev) => [...prev, sound]);
  }, []);

  useEffect(() => {
    if (!playing && toPlay.length > 0) {
      const audio = new Audio(`data:audio/wav;base64,${toPlay[0]}`);
      audio.addEventListener("ended", () => {
        setPlaying(false);
      });
      audio.play();
      setPlaying(true);
      setToPlay(toPlay.slice(1));
      setAudio(audio);
    }
  }, [audio, toPlay, playing]);

  return add;
};

export default useAudioQueue;
