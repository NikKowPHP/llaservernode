class MockSentenceData {
  constructor() {
    this.data = {
      "fr-en": [
        {
          sourceText:
            "Alors que la pluie tombait sans cesse sur Paris, créant une atmosphère mélancolique, j'ai décidé de me rendre dans un café pittoresque et de profiter d'un bon livre tout en dégustant un café chaud.",
          translatedText:
            "As the rain poured relentlessly over Paris, creating a melancholic atmosphere, I decided to head to a quaint café and enjoy a good book while sipping a hot coffee.",
        },
        {
          sourceText:
            "Après avoir passé des heures à explorer les rues sinueuses de Rome, j'ai trouvé un petit restaurant familial où j'ai dégusté un délicieux plat de pâtes fraîches, accompagné d'un verre de vin rouge local.",
          translatedText:
            "After spending hours exploring the winding streets of Rome, I found a small family-run restaurant where I enjoyed a delicious plate of fresh pasta, paired with a glass of local red wine.",
        },
      ],
      "de-en": [
        {
          sourceText:
            "Während ich durch den geschäftigen Berliner Weihnachtsmarkt schlenderte, wurde ich von dem Duft frisch gebackener Lebkuchen und Glühwein verführt und beschloss, eine Tasse des warmen Getränks zu genießen und den festlichen Trubel zu beobachten.",
          translatedText:
            "As I strolled through the bustling Berlin Christmas market, I was enticed by the aroma of freshly baked gingerbread and mulled wine, and decided to indulge in a cup of the warm beverage and watch the festive commotion.",
        },
      ],
      "pt-es": [
        {
          sourceText:
            "Enquanto a brisa suave acariciava as folhas das árvores, eu me sentei à beira da praia e observei o pôr do sol, pintando o céu com cores vibrantes e mágicas, enquanto as ondas quebrando suavemente na areia criavam uma melodia relaxante.",
          translatedText:
            "Mientras la suave brisa acariciaba las hojas de los árboles, me senté a la orilla de la playa y contemplé la puesta de sol, pintando el cielo con colores vibrantes y mágicos, mientras las olas rompiendo suavemente en la arena creaban una melodía relajante.",
        },
      ],
    };
  }

  /**
   * Gets mock sentence data for a specific language pair.
   * @param {string} languagePair - The language pair (e.g., "fr-en").
   * @returns {Array} An array of sentence pairs.
   */
  getMockSentences(languagePair) {
    if (this.data[languagePair]) {
      return this.data[languagePair];
    } else {
      return []; // Or throw an error if the language pair is not found
    }
  }

   /**
   * Gets mock sentence data for a specific language pair as a JSON string.
   * @param {string} languagePair - The language pair (e.g., "fr-en").
   * @returns {string} A JSON string representing the mock sentence data.
   */
   getMockSentencesAsJSON(languagePair) {
    if (this.data[languagePair]) {
      return JSON.stringify(this.data[languagePair]);
    } else {
      return "[]"; // Or throw an error if the language pair is not found
    }
  }


}

module.exports = MockSentenceData;
