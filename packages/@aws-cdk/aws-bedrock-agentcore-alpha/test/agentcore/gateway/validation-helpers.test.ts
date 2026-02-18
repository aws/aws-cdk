import { validateFieldPattern, validateStringField } from '../../../lib/gateway/validation-helpers';

describe('Validation Helpers Tests', () => {
  describe('validateFieldPattern', () => {
    test('Should return error when value is not a string', () => {
      // Pass a non-string value (number) to trigger the typeof check
      const errors = validateFieldPattern(
        123 as any, // Force passing a number instead of string
        'TestField',
        /^[a-z]+$/,
      );

      expect(errors).toContain('Expected string for TestField, got number');
    });

    test('Should return error when pattern is not a RegExp', () => {
      // Pass a non-RegExp value to trigger the instanceof check
      const errors = validateFieldPattern(
        'test-value',
        'TestField',
        'not-a-regex' as any, // Force passing a string instead of RegExp
      );

      expect(errors).toContain('Pattern must be a valid regular expression');
    });

    test('Should return error when value does not match pattern', () => {
      const errors = validateFieldPattern(
        'test-123',
        'TestField',
        /^[a-z]+$/, // Only lowercase letters allowed
      );

      expect(errors).toContain('The field TestField with value "test-123" does not match the required pattern /^[a-z]+$/');
    });

    test('Should return empty array when value is null', () => {
      const errors = validateFieldPattern(
        null as any,
        'TestField',
        /^[a-z]+$/,
      );

      expect(errors).toEqual([]);
    });

    test('Should return empty array when value matches pattern', () => {
      const errors = validateFieldPattern(
        'test',
        'TestField',
        /^[a-z]+$/,
      );

      expect(errors).toEqual([]);
    });
  });

  describe('validateStringField', () => {
    test('Should return error when string is too short', () => {
      const errors = validateStringField({
        value: 'ab',
        fieldName: 'TestField',
        minLength: 3,
        maxLength: 10,
      });

      expect(errors).toContain('The field TestField is 2 characters long but must be at least 3 characters');
    });

    test('Should return error when string is too long', () => {
      const errors = validateStringField({
        value: 'this-is-too-long',
        fieldName: 'TestField',
        minLength: 1,
        maxLength: 10,
      });

      expect(errors).toContain('The field TestField is 16 characters long but must be less than or equal to 10 characters');
    });

    test('Should return empty array for null value', () => {
      const errors = validateStringField({
        value: null as any,
        fieldName: 'TestField',
        minLength: 1,
        maxLength: 10,
      });

      expect(errors).toEqual([]);
    });

    test('Should return empty array for valid string', () => {
      const errors = validateStringField({
        value: 'valid',
        fieldName: 'TestField',
        minLength: 1,
        maxLength: 10,
      });

      expect(errors).toEqual([]);
    });
  });
});
