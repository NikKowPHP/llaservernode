/**
 * Extracts a JSON object from a string response,
 * assuming the JSON is enclosed between the first '{' and last '}'.
 *
 * @param {string} response The response string potentially containing JSON.
 * @returns {object} The parsed JSON object, or null if no valid JSON is found.
 */
function extractJsonFromResponse(response) {
  const startIndex = response.indexOf("{");
  const endIndex = response.lastIndexOf("}");

  if (startIndex === -1 || endIndex === -1) {
    console.error("No valid JSON found in the response.");
    throw new Error("No valid JSON found in the response.");
  }

  const jsonString = response.substring(startIndex, endIndex + 1);

  try {
    return JSON.parse(jsonString);
  } catch (parseError) {
    console.error("Error parsing JSON:", parseError);
    return null; // Or throw an error
  }
}

/**
 * Checks if a value is valid JSON and optionally validates its structure.
 * @param {string | object} jsonData - The data to check (either a JSON string or an object).
 * @param {object} [expectedStructure={}] - An object describing the expected structure (optional).
 * @returns {boolean} True if valid JSON and matches the structure (if provided), otherwise false.
 */
function isValidJson(jsonData, expectedStructure = {}) {
  let parsedData;
  try {
    if (typeof jsonData === "string") {
      try {
        parsedData = JSON.parse(jsonData);
      } catch (error) {
        return false; // Invalid JSON string
      }
    } else if (typeof jsonData === "object" && jsonData !== null) {
      parsedData = jsonData; // Already an object
    } else {
      return false; // Invalid input type
    }

    if (Object.keys(expectedStructure).length === 0) {
      return true; // No structure validation required
    }

    // Basic structure validation (can be made more robust)
    for (const key in expectedStructure) {
      if (
        !(key in parsedData) ||
        typeof parsedData[key] !== typeof expectedStructure[key]
      ) {
        return false;
      }
    }
    return true;
  } catch (error) {
    return false;
  }
}

module.exports = { extractJsonFromResponse, isValidJson };
