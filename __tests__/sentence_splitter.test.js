const request = require("supertest");
const { app, server } = require("../server"); // Import your Express app
const {
  getSentenceSplitPrompt,
  splitSentences,
} = require("../sentence_splitter"); // Assuming your sentence splitter is in sentence_splitter.js
const MockSentenceData = require("../classes/mock_data_class");
const extractJsonFromResponse = require("../helper_functions"); // Import your Express app

// Set timeout globally for all tests in this file
jest.setTimeout(20000);

describe("sentence splitter tests", () => {
  let mockData;
  beforeAll(async () => {
    // Use a Promise to wait for the server to be listening
    await new Promise((resolve, reject) => {
      server.on("listening", resolve);
      server.on("error", reject);
    })
      .then(() => {
        console.log("Server started for testing...");
      })
      .catch((error) => {
        console.error("Error starting server:", error);
      });
  });

  afterAll(async () => {
    // Close the server after all tests are done
    await server.close();
  });

  describe("POST /splitSentences", () => {
    beforeEach(() => {
      mockData = new MockSentenceData();
    });

    it.only("should return split sentences in JSON format", async () => {
      const languagePair = "fr-en";
      const sentences = mockData.getMockSentencesAsJSON(languagePair);
      const inputData = JSON.stringify(sentences);

      const response = await request(app)
        .post("/splitSentences")
        .send({ text: inputData });

      expect(response.statusCode).toBe(200);

      expect(response.body).toEqual({
        splitted_sentences: expect.objectContaining({
          "fr-en": expect.arrayContaining([
            expect.objectContaining({
              chunks: expect.any(Array),
            }),
            // ... more objects for each sentence in the language pair
          ]),
          // ... more language pairs if your API supports them
        }),
      });
    });

    it("should handle errors gracefully", async () => {
      const invalidJSON = "This is not valid JSON"; // Invalid input

      const response = await request(app)
        .post("/splitSentences")
        .send({ text: invalidJSON });

      expect(response.status).toBe(500);
      expect(response.body).toEqual(
        expect.objectContaining({
          error: expect.any(String),
        })
      );
    });
  });

  //   describe("POST /generateTranslation", () => {

  //   });
});
