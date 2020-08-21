const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");

const textToSpeech = require("@google-cloud/text-to-speech");
const speechToText = require("@google-cloud/speech");

const server = express();

server.use(bodyParser.json({ limit: "50mb" }));
server.use(express.static(path.join(__dirname, "../client/build")));
server.use(express.static("public"));

const port = process.env.PORT || 8080;

const voices = {
  male: "A",
  female: "C",
};

const upload = multer();

const textToSpeechClient = new textToSpeech.TextToSpeechClient();
const speechToTextClient = new speechToText.SpeechClient();

server.post("/tts", async (req, res) => {
  try {
    const { text, gender } = req.body;

    const request = {
      input: { text },
      // Select the language and SSML voice gender (optional)
      voice: {
        languageCode: "en-US",
        name: `en-US-Wavenet-${voices[gender.toLowerCase()]}`,
      },
      // select the type of audio encoding
      audioConfig: { audioEncoding: "LINEAR16" },
    };

    //Send the request to Google
    const [response] = await textToSpeechClient.synthesizeSpeech(request);
    const buffer = Buffer.from(response.audioContent, "base64");

    res.send({ tts: buffer.toString("base64") });
  } catch (error) {
    console.log(error);
  }
});

server.post("/stt", upload.any(), async (req, res) => {
  try {
    const buffer = req.files[0].buffer;

    const audio = {
      content: buffer.toString("base64"),
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

    res.send({ stt: transcription });
  } catch (error) {
    console.log(error);
  }
});

server.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

server.listen(port);
