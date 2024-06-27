const os = require('os');
const { load } = require('dotenv');
const { promisify } = require('util');
const { generateText } = require('@google/generative-ai');
const logging = require('Logging');

const loadEnv = promisify(load);

const logger = logging.getLogger(__name__);

class GoogleAiApi {
  constructor() {
    this.systemPrompt = null;
    this._apiKey = null;
    this._model = null;
    this.generationConfig = {
      temperature: 0.5,
      top_p: 0.95,
      top_k: 64,
      maxOutputTokens: 8192,
    };
    this.safetySettings = [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
    ];
  }

  /**
   * Creates an instance of the GoogleAiApi class.
   * @returns {Promise<GoogleAiApi>} A promise that resolves to a new instance of the GoogleAiApi class.
   */
  static async create() {
    const instance = new GoogleAiApi();
    await instance._initialize();
    return instance;
  }

  /**
   * Initializes the Google AI API.
   * @returns {Promise<void>} A promise that resolves when the initialization is complete.
   * @private
   */
  async _initialize() {
    this._apiKey = await this._getApiKey();
    this._initializeModel();
  }

  /**
   * Retrieves the Google API key from environment variables.
   * @returns {Promise<string>} A promise that resolves to the API key.
   * @private
   */
  static async _getApiKey() {
    await loadEnv();
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error('GOOGLE_API_KEY not found in environment variables');
    }
    return apiKey;
  }

  /**
   * Initializes the Google AI model.
   * @private
   */
  _initializeModel() {
    generateText.configure({ apiKey: this._apiKey });
    this._model = 'models/gemini-1.5-flash';
  }

  /**
   * Generates text using the Google AI API.
   * @param {string} message The message to generate text from.
   * @param {string} systemPrompt The system prompt for the conversation.
   * @returns {Promise<string>} A promise that resolves to the generated text.
   */
  async generateText(message, systemPrompt) {
    try {
      const completion = await generateText({
        model: this._model,
        prompt: `${systemPrompt}\n${message}`,
        temperature: this.generationConfig.temperature,
        top_k: this.generationConfig.top_k,
        top_p: this.generationConfig.top_p,
        maxOutputTokens: this.generationConfig.maxOutputTokens,
        safetySettings: this.safetySettings,
      });
      logger.warning(`API response from Google: ${completion.result}`);
      return completion.result;
    } catch (error) {
      logger.error(`Google AI API error: ${error}`);
      throw new Error(`Google API call failed: ${error}`);
    }
  }
}

module.exports = GoogleAiApi;