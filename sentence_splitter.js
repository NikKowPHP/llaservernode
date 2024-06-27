/**
 * Returns the system prompt for sentence splitting.
 * @returns {string} The system prompt.
 */
function getSentenceSplitPrompt() {
  return 'You are a language processing expert. Your task is to split the given text into individual sentences. Preserve the original punctuation and capitalization. Return the result as a JSON array of strings, where each string is a sentence.';
}

/**
 * Splits the given text into sentences.
 * @param {object} model The language model to use for sentence splitting.
 * @param {string} text The text to split into sentences.
 * @param {string} systemPrompt The system prompt for the language model.
 * @returns {Promise<string[]>} A promise that resolves to an array of sentences.
 */
async function splitSentences(model, text, systemPrompt) {
  const prompt = `${systemPrompt}\n\nSplit the following text into sentences:\n\n${text}`;
  try {
    const response = await model.generateText(prompt, systemPrompt); // Assuming model has a generateText method
    return JSON.parse(response); // Assuming the response is a JSON string
  } catch (error) {
    console.error('Error splitting sentences:', error);
    throw new Error(`Sentence splitting failed: ${error}`);
  }
}

module.exports = { getSentenceSplitPrompt, splitSentences };