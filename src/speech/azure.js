const fs = require("fs");
const path = require("path");

const sdk = require("microsoft-cognitiveservices-speech-sdk");

const yaml = require("js-yaml");
const stream = require("stream");
let config = {};

try {
  const fileContents = fs.readFileSync(
    path.join(__dirname, "../../config.yaml"),
    "utf8"
  );
  config = yaml.load(fileContents).azure;
} catch (e) {
  console.log(e);
}

const speechConfig = sdk.SpeechConfig.fromSubscription(
  config.key,
  config.location
);

const voices = {
  male: "GuyNeural",
  femmale: "JennyNeural",
};

module.exports = {
  sst(speech) {

    const pushStream = sdk.AudioInputStream.createPushStream();

    const bufferStream = new stream.Readable({
      read() {
        this.push(speech);
        this.push(null);
      },
    });

    bufferStream
      .on("data", (buffer) => {
        pushStream.write(buffer.slice());
      })
      .on("end", () => {
        pushStream.close();
      });

    const audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);
    const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

    const promise = new Promise((resolve, reject) => {
      recognizer.recognizeOnceAsync((result) => {
        if (result.reason) {
          reject();
        } else {
          console.log(result.text);
          resolve(result.text);
        }

        recognizer.close();
      });
    });

    return promise;
  },
  tts(text, gender) {
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig, undefined);
    const ssml = `<speak xmlns="http://www.w3.org/2001/10/synthesis"
    xmlns:mstts="http://www.w3.org/2001/mstts"
     xmlns:emo="http://www.w3.org/2009/10/emotionml" 
     version="1.0" xml:lang="en-US">
     <voice name="en-US-${voices[gender]}">
       <prosody rate="0%" pitch="0%">
         ${text}
       </prosody>
     </voice>
   </speak>`;
    const promise = new Promise((resolve, reject) => {
      synthesizer.speakSsmlAsync(
        ssml,
        (result) => {
          if (result.errorDetails) {
            reject(result.errorDetails);
          } else {
            resolve(Buffer.from(result.audioData).toString("base64"));
          }

          synthesizer.close();
        },
        (error) => {
          reject(error);
          synthesizer.close();
        }
      );
    });

    return promise;
  },
};
