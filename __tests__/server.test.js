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

  describe("POST /generateTranslation", () => {
    it("should translate text with valid parameters", async () => {
      const requestData = {
        text: "Hello, how are you?",
        sourceLanguage: "en",
        targetLanguage: "fr",
        formality: "formal",
        tone: "neutral",
      };

      const response = await request(app)
        .post("/generateTranslation")
        .send(requestData)
        .set("Accept", "application/json");

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("translated_text");
      expect(typeof response.body.translated_text).toBe("object"); // Assuming you expect a JSON object
    });

    it.only("empty message throws an error", async () => {
      const requestData = {
        text: "",
        sourceLanguage: "en",
        targetLanguage: "fr",
        formality: "formal",
        tone: "neutral",
      };

      const response = await request(app)
        .post("/generateTranslation")
        .send(requestData)
        .set("Accept", "application/json");

      expect(response.statusCode).toBe(400); // Expecting a bad request error
      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("Message cannot be empty."); // Check for the specific error message
    });
  });

  //   describe("POST /generateTranslation", () => {

  //   });
});

