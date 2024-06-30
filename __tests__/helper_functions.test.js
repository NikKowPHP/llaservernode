const { isValidJson } = require('../helper_functions'); // Assuming your function is in helper_functions.js

describe('isValidJson', () => {
  it('should return true for valid JSON strings', () => {
    expect(isValidJson('{}')).toBe(true);
    expect(isValidJson('[]')).toBe(true);
    expect(isValidJson('{"name": "John", "age": 30}')).toBe(true);
  });

  it('should return false for invalid JSON strings', () => {
    expect(isValidJson('{name: "John"}')).toBe(false); // Missing quotes
    expect(isValidJson('this is not json')).toBe(false);
    expect(isValidJson(123)).toBe(false); // Not a string
  });

  it('should return true for valid JSON objects', () => {
    expect(isValidJson({})).toBe(true);
    expect(isValidJson({ name: 'John', age: 30 })).toBe(true);
  });

  it('should return false for invalid input types', () => {
    expect(isValidJson(null)).toBe(false);
    expect(isValidJson(undefined)).toBe(false);
    expect(isValidJson(123)).toBe(false);
    expect(isValidJson(true)).toBe(false);
  });

  it('should validate structure when expectedStructure is provided', () => {
    const expectedStructure = {
      name: '',
      age: 0,
      address: {}
    };

    expect(isValidJson({ name: 'John', age: 30, address: { city: 'New York' } }, expectedStructure)).toBe(true);
    expect(isValidJson({ name: 'Jane', age: '25', address: { city: 'London' } }, expectedStructure)).toBe(false); // Age is a string, not a number
    expect(isValidJson({ name: 'Bob' }, expectedStructure)).toBe(false); // Missing properties
  });

  it('should return true when expectedStructure is empty', () => {
    expect(isValidJson('{"name": "John", "age": 30}', {})).toBe(true);
    expect(isValidJson({ name: 'John', age: 30 }, {})).toBe(true);
  });
});