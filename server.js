/***********************
LexMitra – Backend
Azure Vision OCR + Azure OpenAI
***********************/
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const os = require("os");
const { DocumentAnalysisClient } = require("@azure/ai-form-recognizer");
const { AzureKeyCredential } = require("@azure/core-auth");
const { AzureOpenAI } = require("openai");

const app = express();
const PORT = process.env.PORT || 5000;

// Azure OCR Client
const ocrClient = new DocumentAnalysisClient(
  process.env.AZURE_VISION_ENDPOINT,
  new AzureKeyCredential(process.env.AZURE_VISION_KEY)
);

// Azure OpenAI Client
const openai = new AzureOpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  endpoint: process.env.AZURE_OPENAI_ENDPOINT,
  deployment: process.env.AZURE_OPENAI_DEPLOYMENT,
  apiVersion: "2024-02-15-preview",
});

// File Upload Setup
const storage = multer.diskStorage({
  destination: os.tmpdir(),
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
});

// Serve Frontend
app.use(express.static("public"));

app.listen(PORT, () => {
  console.log(`LexMitra running on http://localhost:${PORT}`);
});
