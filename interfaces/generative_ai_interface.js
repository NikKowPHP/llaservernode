// baseAiApi.js

/**
 * @typedef {Object} GenerationConfig
 * @property {number} temperature
 * @property {number} top_p
 * @property {number} top_k
 * @property {number} maxOutputTokens
 */

/**
 * @typedef {Object} SafetySetting
 * @property {string} category
 * @property {string} threshold
 */

/**
 * Base class for AI API interactions.
 * @class
 */
class BaseAiApi {
    /**
     * Creates a new instance of BaseAiApi.
     * @constructor
     * @param {string} [systemPrompt=null] - The system prompt.
     * @param {GenerationConfig} [generationConfig] - Generation config.
     * @param {SafetySetting[]} [safetySettings] - Safety settings.
     */
    constructor(systemPrompt = null, generationConfig = {}, safetySettings = []) {
      this.systemPrompt = systemPrompt;
      this.generationConfig = generationConfig;
      this.safetySettings = safetySettings;
    }
  
    /**
     * Generates text using the AI API (to be implemented by subclasses).
     * @method
     * @param {string} message - The message to generate text from.
     * @param {string} [systemPrompt=''] - The system prompt.
     * @returns {Promise<string>} - A promise resolving to the generated text.
     * @abstract
     */
    async generateText(message, systemPrompt = '') {
      throw new Error('generateText method must be implemented in subclass.');
    }
  }
  
  module.exports = BaseAiApi;