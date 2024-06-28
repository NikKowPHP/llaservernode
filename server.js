const express = require('express');
const bodyParser = require('body-parser');
const GoogleAiApi = require('./google_ai_api');
const { generateTranslation } = require('./translation_helper'); 
const { getSentenceSplitPrompt } = require('./sentence_splitter'); // Assuming you have this module

const app = express();
app.use(bodyParser.json());

// Initialize API instances
let generalApi;
let translationApi;
let sentenceSplitApi;

const initializeApis = async () => {
  try {
    generalApi = await GoogleAiApi.create();
    translationApi = await GoogleAiApi.create();
    sentenceSplitApi = await GoogleAiApi.create();
    console.log('Google AI APIs initialized successfully.');
  } catch (error) {
    console.error('Error initializing Google AI APIs:', error);
    process.exit(1); 
  }
};

initializeApis();

app.get('/', (req, res) => {
  res.send('Server is reachable!');
});

app.post('/generate', async (req, res) => {
  const { prompt } = req.body;
  try {
    const response = await generalApi.generateText(prompt, ''); 
    res.json({ response });
  } catch (error) {
    console.error('Error generating text:', error);
    res.status(400).json({ error: error.message });
  }
});


app.get('/health', (req, res) => {
  res.status(200).send('OK'); // Simple health check response
});


app.post('/generateTranslation', async (req, res) => {
  const { text, sourceLanguage, targetLanguage, formality, tone } = req.body;
  try {
    const translatedText = await generateTranslation(
      translationApi,
      formality,
      sourceLanguage,
      targetLanguage,
      text,
      tone
    );
    res.json({ translated_text: translatedText });
  } catch (error) {
    console.error('Error translating text:', error);
    res.status(400).json({ error: error.message });
  }
});

app.post('/splitSentences', async (req, res) => {
  const { text } = req.body;
  const systemPrompt = getSentenceSplitPrompt(); 
  try {
    const response = await sentenceSplitApi.generateText(text, systemPrompt);
    let sentences;
    try {
      sentences = JSON.parse(response);
      if (!Array.isArray(sentences)) {
        throw new Error('Response is not an array'); 
      }
    } catch (error) {
      // If parsing fails, attempt a simple split
      console.warn('Model response parsing failed, attempting manual split.');
      sentences = response.split(/[.!?]+/g).map((s) => s.trim()).filter(Boolean); 
    }
    res.json({ sentences });
  } catch (error) {
    console.error('Error splitting sentences:', error);
    res.status(400).json({ error: error.message });
  }
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});