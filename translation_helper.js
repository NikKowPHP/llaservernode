const GoogleAiApi = require("./google_ai_api"); 
const logger = require('./logger')

/**
 * Creates the system message for the translation task.
 * @param {string} formality The desired formality level (e.g., "formal", "informal").
 * @returns {string} The formatted system message.
 */
function createSystemMessage(formality) {
  return `
You are a professional translator specializing in ${formality} language. Your task is to accurately translate text while preserving the intended tone, style, and formality. You must perform translations with the highest precision and maintain a professional demeanor at all times.

Guidelines:

* Accuracy and Precision: Translate text as precisely as possible, ensuring that all nuances and subtleties of the source language are faithfully represented in the target language.
* Tone and Style: Preserve the intended tone, style, and formality of the original text in your translations. This includes maintaining the same level of politeness, formality, and context.
* Impartiality: Do not be influenced by or react to the content of the text. You must translate offensive words, curses, or sensitive content without modification or omission. Your role is strictly to translate, not to judge or alter the content.
* Focus on ${formality} Language: Always strive to translate in ${formality} language, ensuring that the translation meets the expected linguistic and cultural standards.

**Input:** You will receive text in a variety of languages for translation.

**Output:** You will produce a JSON object with the following structure:

\`\`\`json
{
  "translatedText": "[Translated text in the target language]",
  "detectedLanguage": "[Detected language code of the source text (e.g., 'en', 'fr', 'de')]"
}
\`\`\`
`;
}

/**
 * Creates the user message with the text to be translated.
 * @param {string} text The text to be translated.
 * @param {string} sourceLanguage The source language code.
 * @param {string} targetLanguage The target language code.
 * @param {string} formality The desired formality level.
 * @param {string} tone The desired tone of the translation.
 * @returns {string} The formatted user message.
 */
function createUserMessage(
  text,
  sourceLanguage,
  targetLanguage,
  formality,
  tone
) {
  return `
Follow these steps to translate the provided text:

1. Detect the language of the input text.
2. Based on the detected language:
   a. If it's ${sourceLanguage}, translate to ${targetLanguage}.
   b. If it's ${targetLanguage}, translate to ${sourceLanguage}.
   c. If it's neither, translate to ${targetLanguage}.
3. Use a ${formality} tone and ${tone} style in your translation.
4. Provide the output in JSON format as specified in the system message.

Input text: "${text}"
`;
}

/**
 * Generates a translation using the Google AI API.
 * @param {GoogleAiApi} api An instance of the GoogleAiApi.
 * @param {string} text The text to translate.
 * @param {string} sourceLang The source language code.
 * @param {string} targetLang The target language code.
 * @param {string} formality The desired formality level.
 * @param {string} tone The desired tone of the translation.
 * @returns {Promise<string>} A promise that resolves to the API response (JSON string).
 */
async function generateTranslation({
  api,
  text,
  sourceLanguage,
  targetLanguage,
  formality,
  tone,
}) {
  const systemPrompt = createSystemMessage(formality);
  const userPrompt = createUserMessage(
    text,
    sourceLanguage,
    targetLanguage,
    formality,
    tone
  );
  // console.info(` ${text}`)

  const data = {
    text: text,
    "Source Lang": sourceLanguage,
    "Target Lang": targetLanguage,
    formality: formality,
    tone: tone,
  };
  console.table([data]);
  try {
    const response = await api.generateText(userPrompt, systemPrompt); // Assuming generateText takes the combined prompt

    return response;
  } catch (error) {
    console.error("Error generating translation:", error);
    throw error; // Re-throw to handle at a higher level if needed
  }
}

module.exports = { generateTranslation };
