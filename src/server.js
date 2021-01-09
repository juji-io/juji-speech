/***
 *
 * author: Wenhao Zhang
 *
 */
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const yaml = require("js-yaml");

let data = {};

try {
  const fileContents = fs.readFileSync("./config.yaml", "utf8");
  data = yaml.load(fileContents);
} catch (e) {
  console.log(e);
}
let speech = {};

if (data.speech === "azure") {
  speech = require("./speech/azure");
} else {
  speech = require("./speech/google");
}

const server = express();

server.use(bodyParser.json({ limit: "50mb" }));
server.use(express.static(path.join(__dirname, "../client/build")));
server.use(express.static("public"));

const port = process.env.PORT || 8080;

const upload = multer();

server.post("/tts", async (req, res) => {
  try {
    const { text, gender } = req.body;
    const voice = await speech.tts(text, gender.toLowerCase());
    res.send({ tts: voice });
  } catch (error) {
    console.log(error);
  }
});

server.post("/stt", upload.any(), async (req, res) => {
  try {
    const buffer = req.files[0].buffer;
    fs.writeFileSync("test.wav", buffer, 'binary');
    const transcription = await speech.sst(buffer);
    res.send({ stt: transcription });
  } catch (error) {
    console.log(error);
  }
});

server.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

server.listen(port);
