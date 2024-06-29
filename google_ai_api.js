const os = require('os');
const dotenv = require('dotenv');
const { GoogleGenerativeAI, GoogleGenerativeAIFetchError } = require('@google/generative-ai');
const extractJsonFromResponse = require('./helper_functions');
const logger = require('./logger')


dotenv.config();
// Access environment variables directly using process.env
const apiKey = process.env.GOOGLE_API_KEY;



class GoogleAiApi {
  constructor() {
    this.systemPrompt = null;
    this.googleAI = new GoogleGenerativeAI(apiKey);
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
   async _getApiKey() {
    
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
    this.model = this.googleAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash', 

    });
  }

  /**
   * Generates text using the Google AI API.
   * @param {string} message The message to generate text from.
   * @param {string} systemPrompt The system prompt for the conversation.
   * @returns {Promise<string>} A promise that resolves to the generated text.
   */
   async generateText(message, systemPrompt = '') { 
    if (!this.model) {
      throw new Error('Google AI model not initialized.');
    }

    try {
      logger.info(`received data from front`)
      const response = await this.model.generateContent([`${systemPrompt}\n${message}` // The actual text content
      ], 
      
    
    );
      

      const generatedText = response.response?.text();

      if (generatedText) {
        logger.info(`API response from Google: ${generatedText}`);
        const parsedData = extractJsonFromResponse(generatedText);
        return parsedData;
      } else {
        logger.error('Google AI API returned an empty response.');
        throw new Error('Google AI API returned an empty response.');
      }

    } catch (error) {
      let errorMessage = `Google AI call failed: ${error.message}`;

      if (error instanceof GoogleGenerativeAIFetchError) {
        errorMessage += `\nStatus: ${error.status} ${error.statusText}`;
        if (error.errorDetails && error.errorDetails.length > 0) {
          errorMessage += `\nDetails: ${JSON.stringify(error.errorDetails, null, 2)}`;
        }
      }
      logger.error(errorMessage)
      throw new Error(errorMessage)
    }
  }
}

module.exports = GoogleAiApi;