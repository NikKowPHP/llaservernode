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
        done(); // Tell Jest that the server is ready
      })
      .catch((error) => {
        console.error("Error starting server:", error);
        done(error); // Fail the tests if the server fails to start
      });
  });

  afterAll(async () => {
    // Close the server after all tests are done
    await server.close();
  });

  describe("POST /generate", () => {
    it("should generate text with a valid prompt", async () => {
      const prompt = "Translate hello to French";
      const response = await request(app)
        .post("/generate")
        .send({ prompt })
        .set("Accept", "application/json");

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("response");
      expect(typeof response.body.response).toBe("string"); // Expecting a string response
    });

    it("should handle invalid or missing prompts", async () => {
      const response = await request(app)
        .post("/generate")
        .send({}) // Sending an empty request body
        .set("Accept", "application/json");

      expect(response.statusCode).toBe(500); // Or another appropriate error code
      expect(response.body).toHaveProperty("error");
    });
  });
});
