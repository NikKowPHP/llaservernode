const request = require("supertest");
const { app, server } = require("../server"); // Import your Express app

describe("API Tests", () => {
  beforeAll(async () => {
    // Use a Promise to wait for the server to be listening
    new Promise((resolve, reject) => {
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

  describe('POST /generateTranslation', () => {
    it('should translate text with valid parameters', async () => {
      const requestData = {
        text: 'Hello, how are you?',
        sourceLanguage: 'en',
        targetLanguage: 'fr',
        formality: 'formal',
        tone: 'neutral',
      };

      const response = await request(app)
        .post('/generateTranslation')
        .send(requestData)
        .set('Accept', 'application/json');

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('translated_text');
      expect(typeof response.body.translated_text).toBe('object'); // Assuming you expect a JSON object
    });

    // it("should handle invalid or missing prompts", async () => {
    //   const response = await request(app)
    //     .post("/generate")
    //     .send({}) // Sending an empty request body
    //     .set("Accept", "application/json");

    //     await expect(response).rejects.toThrow('Message cannot be empty.');
    // // await expect(api.generateText('   ')).rejects.toThrow('Message cannot be empty.');
      
    // });
  });
});
