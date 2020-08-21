import { useState, useEffect } from "react";

import Recorder from "recorder-js";

const useMicrophone = () => {
  const [mic, setMic] = useState();
  const [stream, setStream] = useState();
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState();

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  useEffect(() => {
    if (isRecording) {

      const startRecording = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
          const audioContext = new (window.AudioContext ||
            window.webkitAudioContext)();
          const recorder = new Recorder(audioContext, { numChannels: 2 });
          recorder.init(stream);
          recorder.start();

          setMic(recorder);
          setStream(stream);
        } catch (error) {
          console.log(error);
        }
      };

      startRecording();
    }
  }, [isRecording]);

  useEffect(() => {
    if (!isRecording && stream && mic) {
      const stopRecording = async () => {
        stream.getTracks()[0].stop();
        const { blob } = await mic.stop();

        setRecording(blob);
      };

      stopRecording();
    }
  }, [isRecording, stream, mic]);

  return [toggleRecording, recording, isRecording];
};

export default useMicrophone;
