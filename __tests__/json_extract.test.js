const extractJsonFromResponse = require('../helper_functions'); // Assuming your file is named helper_functions.js

describe('extractJsonFromResponse', () => {
  it('should extract and parse valid JSON from a string', () => {
    const response = '```json Some text {"name": "John", "age": 30} More text```';
    const expectedJson = { name: 'John', age: 30 };
    const result = extractJsonFromResponse(response);
    expect(result).toEqual(expectedJson);
  });

  it('should throw an error for a string with no valid JSON', () => {
    const response = 'Some text with no JSON object';
    expect(() => extractJsonFromResponse(response)).toThrowError('No valid JSON found in the response.');
  });

  it('should return null for invalid JSON', () => {
    const response = 'Some text {invalid-json} More text';
    const result = extractJsonFromResponse(response);
    expect(result).toBeNull();
  });

  it('should handle nested JSON objects', () => {
    const response = '{"outer": {"name": "Alice", "inner": {"value": 123}}}';
    const expectedJson = { outer: { name: 'Alice', inner: { value: 123 } } };
    const result = extractJsonFromResponse(response);
    expect(result).toEqual(expectedJson);
  });
});