/**
 * Extracts a JSON object from a string response, 
 * assuming the JSON is enclosed between the first '{' and last '}'.
 * 
 * @param {string} response The response string potentially containing JSON.
 * @returns {object} The parsed JSON object, or null if no valid JSON is found.
 */
function extractJsonFromResponse(response) {
    const startIndex = response.indexOf('{');
    const endIndex = response.lastIndexOf('}');
  
    if (startIndex === -1 || endIndex === -1) {
      console.error("No valid JSON found in the response.");
      return null; // Or throw an error if you want to handle it differently
    }
  
    const jsonString = response.substring(startIndex, endIndex + 1);
  
    try {
      return JSON.parse(jsonString);
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      return null; // Or throw an error
    }
  }


module.exports = extractJsonFromResponse; 