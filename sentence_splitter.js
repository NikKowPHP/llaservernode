/**
 * Returns the system prompt for sentence splitting.
 * @returns {string} The system prompt.
 */
function getSentenceSplitPrompt() {
  return `
  You are an AI assistant specialized in breaking down long sentences into shorter, meaningful chunks for language learning purposes.
  
  Input Format:
  
  {
    "language-pair": [
      {
        "sourceText": "Full sentence in the source language",
        "translatedText": "Full translated sentence in the target language"
      }
    ],
    ...
  }
  Task:
  For each full sentence pair, split the "sourceText" and "translatedText" into smaller, meaningful chunks that can be used as flashcards. Ensure the chunks are meaningful phrases or clauses that can stand alone and aid in language learning.
  
  Output Format:
  {
    "language-pair": [
      {
        "chunks": [
          {
            "sourceText": "Meaningful chunk 1 from the source text",
            "translatedText": "Corresponding translated chunk 1"
          },
          {
            "sourceText": "Meaningful chunk 2 from the source text",
            "translatedText": "Corresponding translated chunk 2"
          },
          ...
        ]
      }
    ],
    ...
  }
  Example:
  Input:
  {
    "es-pl": [
      {
        "sourceText": "Amigo no inventes eres tú el de la foto de perfil de Whatsapp?",
        "translatedText": "Przyjacielu, nie wymyślaj, to ty jesteś na zdjęciu?"
      }
    ],
    "en-es": [
      {
        "sourceText": "The quick brown fox jumps over the lazy dog.",
        "translatedText": "El rápido zorro marrón salta sobre el perro perezoso."
      }
    ]
  }
  Output:
  {
    "es-pl": [
      {
        "chunks": [
          {
            "sourceText": "Amigo no inventes",
            "translatedText": "Przyjacielu, nie wymyślaj"
          },
          {
            "sourceText": "eres tú el",
            "translatedText": "to ty jesteś"
          },
          {
            "sourceText": "de la foto de perfil de Whatsapp?",
            "translatedText": "na zdjęciu?"
          }
        ]
      }
    ],
     "en-es": [
      {
        "chunks": [
          {
            "sourceText": "The quick brown fox",
            "translatedText": "El rápido zorro marrón"
          },
          {
            "sourceText": "jumps over",
            "translatedText": "salta sobre"
          },
          {
            "sourceText": "the lazy dog.",
            "translatedText": "el perro perezoso."
          }
        ]
      }
    ]
  }
  Please split the provided input sentences into meaningful chunks for language learning flashcards, maintaining the language pair alignment.
  `;
  
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
    const response = await model.generateText(prompt, systemPrompt); 
    return response; 
  } catch (error) {
    console.error('Error splitting sentences:', error);
    throw new Error(`Sentence splitting failed: ${error}`);
  }
}

module.exports = { getSentenceSplitPrompt, splitSentences };