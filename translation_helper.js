const GoogleAiApi = require("./google_ai_api");
const logger = require("./logger");

/**
 * Creates the system message for the translation task.
 * @param {string} formality The desired formality level (e.g., "formal", "informal").
 * @returns {string} The formatted system message.
 */
function createSystemMessage(formality) {
  const baseMessage = `
You are a professional translator specializing in ${formality} language. Your task is to accurately translate text while adjusting the formality level as needed. You must perform translations with the highest precision and maintain a professional demeanor at all times.

Guidelines:
- Accuracy and Precision: Translate text as precisely as possible, ensuring that all nuances and subtleties of the source language are faithfully represented in the target language.
- Tone and Style: While adjusting formality, strive to maintain the overall tone and style of the original text as much as possible.
- Impartiality: Do not be influenced by or react to the content of the text. Translate offensive words, curses, or sensitive content without censorship, but adjust their formality level as required.
- Cultural Sensitivity: Be aware of cultural differences and adjust idiomatic expressions or culturally specific references to maintain meaning in the target language and culture.
`;

const formalGuidelines = `
Formality Adjustment for Highly Formal Translation:
- Elevate the register to a highly formal level, regardless of the input text's formality
- Employ sophisticated, erudite vocabulary and complex sentence structures
- Use formal address forms, honorifics, and titles where appropriate
- Avoid all colloquialisms, idioms, and informal expressions; replace with formal equivalents
- Utilize passive voice and impersonal constructions where suitable to increase formality
- Incorporate formal transitional phrases and conjunctions to create a polished, academic tone
- Prioritize precision and clarity in language, avoiding any ambiguity
- When translating from informal sources, significantly restructure sentences to align with formal writing conventions
- In appropriate contexts, use archaic or highly literary terms to emphasize formality
- Maintain strict adherence to grammatical rules, avoiding contractions and abbreviations
`;

  const informalGuidelines = `
Formality Adjustment for Informal Translation:
- When the required formality is informal, translate using colloquial language and casual expressions
- Use everyday vocabulary and phrases that native speakers would use in relaxed, friendly conversations
- Employ contractions, informal greetings, and common slang where appropriate
- Simplify complex sentence structures to reflect natural, spoken language
- Feel free to drop honorifics or formal address forms unless they're essential to the meaning
`;

  const outputFormat = `
Input: You will receive text in a variety of languages for translation, along with the desired formality level.

Output: You will produce a JSON object with the following structure:
\`\`\`json
{
  "translatedText": "[Translated text in the target language]",
  "detectedLanguage": "[Detected language code of the source text (e.g., 'en', 'fr', 'de')]"
}
\`\`\`
`;

  let formalitySpecificGuidelines = "";
  if (formality === "formal") {
    formalitySpecificGuidelines = formalGuidelines;
  } else if (formality === "informal") {
    formalitySpecificGuidelines = informalGuidelines;
  } else {
    formalitySpecificGuidelines = formalGuidelines + informalGuidelines;
  }
  const concatenatedMessage =
    baseMessage + formalitySpecificGuidelines + outputFormat;
    logger.info(concatenatedMessage);
  return concatenatedMessage;
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
function createUserMessage({
  text,
  sourceLanguage,
  targetLanguage,
  formality,
  tone,
}) {
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
  if (!text || text.trim() === "") {
    // Check for empty or whitespace-only messages
    throw new Error("Message cannot be empty.");
  }

  const systemPrompt = createSystemMessage(formality);
  const userPrompt = createUserMessage({
    text: text,
    formality: formality,
    sourceLanguage: sourceLanguage,
    targetLanguage: targetLanguage,
    tone: tone,
  });
  logger.info(`user prompt: \n${userPrompt}`);
  logger.info(`system prompt: \n${systemPrompt}`);
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
