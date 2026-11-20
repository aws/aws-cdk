import * as cdk from '../../../core';
import { UnscopedValidationError } from '../../../core/lib/errors';
import { lit } from '../../../core/lib/helpers-internal';
import {
  validateStringFieldLength,
  validateFieldPattern,
  throwIfInvalid,
} from '../../lib/common/validation-helpers';

describe('validation-helpers tests', () => {
  describe('validateStringFieldLength', () => {
    test('Should handle null values', () => {
      const errors = validateStringFieldLength({
        value: null as any,
        fieldName: 'TestField',
        minLength: 1,
        maxLength: 10,
      });

      expect(errors).toEqual([]);
    });

    test('Should handle undefined values', () => {
      const errors = validateStringFieldLength({
        value: undefined as any,
        fieldName: 'TestField',
        minLength: 1,
        maxLength: 10,
      });

      expect(errors).toEqual([]);
    });

    test('Should handle token values', () => {
      const tokenValue = cdk.Lazy.string({ produce: () => 'test' });
      const tokenField = cdk.Lazy.string({ produce: () => 'TestField' });
      const errors = validateStringFieldLength({
        value: tokenValue,
        fieldName: tokenField,
        minLength: 1,
        maxLength: 10,
      });

      expect(errors).toEqual([]);
    });

    test('Should return error when value is too short', () => {
      const errors = validateStringFieldLength({
        value: 'ab',
        fieldName: 'TestField',
        minLength: 5,
        maxLength: 10,
      });

      expect(errors).toContain('The field TestField is 2 characters long but must be at least 5 characters');
    });

    test('Should return error when value is too long', () => {
      const errors = validateStringFieldLength({
        value: 'this is way too long',
        fieldName: 'TestField',
        minLength: 1,
        maxLength: 10,
      });

      expect(errors).toContain('The field TestField is 20 characters long but must be less than or equal to 10 characters');
    });

    test('Should pass when value is exactly at min boundary', () => {
      const errors = validateStringFieldLength({
        value: 'abc',
        fieldName: 'TestField',
        minLength: 3,
        maxLength: 10,
      });

      expect(errors).toEqual([]);
    });

    test('Should pass when value is exactly at max boundary', () => {
      const errors = validateStringFieldLength({
        value: '1234567890',
        fieldName: 'TestField',
        minLength: 1,
        maxLength: 10,
      });

      expect(errors).toEqual([]);
    });
  });

  describe('validateFieldPattern', () => {
    test('Should handle null values', () => {
      const errors = validateFieldPattern(
        null as any,
        'TestField',
        /^test$/,
        'Custom error message',
      );

      expect(errors).toEqual([]);
    });

    test('Should handle undefined values', () => {
      const errors = validateFieldPattern(
        undefined as any,
        'TestField',
        /^test$/,
        'Custom error message',
      );

      expect(errors).toEqual([]);
    });

    test('Should handle non-string values', () => {
      const errors = validateFieldPattern(
        123 as any,
        'TestField',
        /^test$/,
        'Custom error message',
      );

      expect(errors).toContain('Expected string for TestField, got number');
    });

    test('Should use custom error message when provided', () => {
      const errors = validateFieldPattern(
        'invalid',
        'TestField',
        /^test$/,
        'Custom error: value does not match',
      );

      expect(errors).toContain('Custom error: value does not match');
    });

    test('Should use default error message when custom message is not provided', () => {
      const errors = validateFieldPattern(
        'invalid',
        'TestField',
        /^test$/,
      );

      expect(errors[0]).toMatch(/The field TestField with value "invalid" does not match the required pattern/);
    });

    test('Should handle token values', () => {
      const tokenValue = cdk.Lazy.string({ produce: () => 'test' });
      const errors = validateFieldPattern(
        tokenValue,
        'TestField',
        /^test$/,
        'Custom error message',
      );

      expect(errors).toEqual([]);
    });

    test('Should return error when pattern is not a RegExp', () => {
      const errors = validateFieldPattern(
        'test-value',
        'TestField',
        'not-a-regex' as any,
      );

      expect(errors).toContain('Pattern must be a valid regular expression');
    });

    test('Should return empty array when value matches pattern', () => {
      const errors = validateFieldPattern(
        'test',
        'TestField',
        /^test$/,
      );

      expect(errors).toEqual([]);
    });
  });

  describe('throwIfInvalid', () => {
    test('Should throw UnscopedValidationError when validation fails', () => {
      const validator = (value: string) => {
        const errors: string[] = [];
        if (value !== 'valid') {
          errors.push('Value must be "valid"');
        }
        return errors;
      };

      expect(() => {
        throwIfInvalid(validator, 'invalid');
      }).toThrow(UnscopedValidationError);

      expect(() => {
        throwIfInvalid(validator, 'invalid');
      }).toThrow('Value must be "valid"');
    });

    test('Should return the parameter when validation passes', () => {
      const validator = (value: string) => {
        const errors: string[] = [];
        if (value !== 'valid') {
          errors.push('Value must be "valid"');
        }
        return errors;
      };

      const result = throwIfInvalid(validator, 'valid');
      expect(result).toBe('valid');
    });

    test('Should handle multiple errors', () => {
      const validator = (value: number) => {
        const errors: string[] = [];
        if (value < 0) {
          errors.push('Value must be positive');
        }
        if (value > 100) {
          errors.push('Value must be less than 100');
        }
        if (value % 2 !== 0) {
          errors.push('Value must be even');
        }
        return errors;
      };

      expect(() => {
        throwIfInvalid(validator, -5);
      }).toThrow('Value must be positive\nValue must be even');

      expect(() => {
        throwIfInvalid(validator, 101);
      }).toThrow('Value must be less than 100\nValue must be even');
    });

    test('Should work with complex validation functions', () => {
      interface Config {
        name: string;
        value: number;
      }

      const validator = (config: Config) => {
        const errors: string[] = [];
        if (!config.name) {
          errors.push('Name is required');
        }
        if (config.value < 0) {
          errors.push('Value must be positive');
        }
        return errors;
      };

      expect(() => {
        throwIfInvalid(validator, { name: '', value: -1 });
      }).toThrow('Name is required\nValue must be positive');

      const result = throwIfInvalid(validator, { name: 'test', value: 5 });
      expect(result).toEqual({ name: 'test', value: 5 });
    });
    test('Should throw ValidationError with scope when scope is provided', () => {
      const stack = new cdk.Stack();
      const validator = (value: string) => {
        return value === 'valid' ? [] : ['Value must be "valid"'];
      };

      expect(() => {
        throwIfInvalid(validator, 'invalid', stack);
      }).toThrow('Value must be "valid"');
    });
  });

  describe('UnscopedValidationError', () => {
    test('Should be an instance of Error', () => {
      const error = new UnscopedValidationError(lit`TestError`, 'Test error');
      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('TestError');
      expect(error.message).toBe('Test error');
    });
  });
});
