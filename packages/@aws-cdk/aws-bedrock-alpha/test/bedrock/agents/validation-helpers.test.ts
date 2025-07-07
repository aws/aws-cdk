import { Token } from 'aws-cdk-lib';
import { validateStringFieldLength, validateFieldPattern, throwIfInvalid } from '../../../bedrock/agents/validation-helpers';

describe('validation-helpers', () => {
  describe('validateStringFieldLength', () => {
    test('returns empty array for valid string length', () => {
      const result = validateStringFieldLength({
        value: 'test',
        fieldName: 'testField',
        minLength: 2,
        maxLength: 10,
      });
      expect(result).toEqual([]);
    });

    test('returns error when string is too short', () => {
      const result = validateStringFieldLength({
        value: 'a',
        fieldName: 'testField',
        minLength: 2,
        maxLength: 10,
      });
      expect(result).toHaveLength(1);
      expect(result[0]).toContain('must be at least 2 characters');
    });

    test('returns error when string is too long', () => {
      const result = validateStringFieldLength({
        value: 'this is a very long string',
        fieldName: 'testField',
        minLength: 2,
        maxLength: 10,
      });
      expect(result).toHaveLength(1);
      expect(result[0]).toContain('must be less than or equal to 10 characters');
    });

    test('skips validation for unresolved tokens', () => {
      const tokenValue = Token.asString({ Ref: 'SomeParameter' });
      const result = validateStringFieldLength({
        value: tokenValue,
        fieldName: tokenValue,
        minLength: 2,
        maxLength: 10,
      });
      expect(result).toEqual([]);
    });
  });

  describe('validateFieldPattern', () => {
    test('returns empty array for valid pattern match', () => {
      const result = validateFieldPattern(
        'test123',
        'testField',
        /^[a-z0-9]+$/,
      );
      expect(result).toEqual([]);
    });

    test('returns error for invalid pattern match', () => {
      const result = validateFieldPattern(
        'test@123',
        'testField',
        /^[a-z0-9]+$/,
      );
      expect(result).toHaveLength(1);
      expect(result[0]).toContain('does not match the required pattern');
    });

    test('uses custom error message when provided', () => {
      const customMessage = 'Custom validation error';
      const result = validateFieldPattern(
        'test@123',
        'testField',
        /^[a-z0-9]+$/,
        customMessage,
      );
      expect(result).toEqual([customMessage]);
    });

    test('returns error for non-string value', () => {
      const result = validateFieldPattern(
        42 as any,
        'testField',
        /^[0-9]+$/,
      );
      expect(result).toHaveLength(1);
      expect(result[0]).toContain('Expected string');
    });

    test('skips validation for unresolved tokens', () => {
      const tokenValue = Token.asString({ Ref: 'SomeParameter' });
      const result = validateFieldPattern(
        tokenValue,
        'testField',
        /^[a-z0-9]+$/,
      );
      expect(result).toEqual([]);
    });
  });

  describe('throwIfInvalid', () => {
    test('returns parameter when validation passes', () => {
      const param = { value: 'test', fieldName: 'testField', minLength: 2, maxLength: 10 };
      const result = throwIfInvalid(validateStringFieldLength, param);
      expect(result).toBe(param);
    });

    test('throws error when validation fails', () => {
      const param = { value: 'a', fieldName: 'testField', minLength: 2, maxLength: 10 };
      expect(() => {
        throwIfInvalid(validateStringFieldLength, param);
      }).toThrow('must be at least 2 characters');
    });

    test('throws combined error messages when multiple validations fail', () => {
      const validationFn = () => [
        'Error 1',
        'Error 2',
      ];
      expect(() => {
        throwIfInvalid(validationFn, 'test');
      }).toThrow('Error 1\nError 2');
    });
  });
});
