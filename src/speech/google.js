const speechToText = require("@google-cloud/speech");
const textToSpeech = require("@google-cloud/text-to-speech");

const speechToTextClient = new speechToText.SpeechClient();
const textToSpeechClient = new textToSpeech.TextToSpeechClient();

const voices = {
  male: "A",
  female: "C",
};

module.exports = {
  async sst(speech) {
    try {
      const audio = {
        content: speech.toString("base64"),
      };
      const config = {
        languageCode: "en-US",
        audioChannelCount: 2,
      };
      const request = {
        audio: audio,
        config: config,
      };

      const [response] = await speechToTextClient.recognize(request);
      const transcription = response.results
        .map((result) => result.alternatives[0].transcript)
        .join("\n");

      return transcription;
    } catch (error) {
      console.log(error);
    }
  },
  async tts(text, gender) {
    try {
      const request = {
        input: { text },
        // Select the language and SSML voice gender (optional)
        voice: {
          languageCode: "en-US",
          name: `en-US-Wavenet-${voices[gender]}`,
        },
        // select the type of audio encoding
        audioConfig: { audioEncoding: "LINEAR16" },
      };

      //Send the request to Google
      const [response] = await textToSpeechClient.synthesizeSpeech(request);
      const buffer = Buffer.from(response.audioContent, "base64");

      return buffer.toString("base64");
    } catch (error) {
      console.log(error);
    }
  },
};
