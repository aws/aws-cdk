import * as cdk from 'aws-cdk-lib';
import {
  validateStringField,
  validateFieldPattern,
  throwIfInvalid,
  ValidationError,
} from '../../../lib/runtime/validation-helpers';

describe('validation-helpers tests', () => {
  describe('validateStringField', () => {
    test('Should handle null values', () => {
      const errors = validateStringField({
        value: null as any,
        fieldName: 'TestField',
        minLength: 1,
        maxLength: 10,
      });

      expect(errors).toEqual([]);
    });

    test('Should handle undefined values', () => {
      const errors = validateStringField({
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
      const errors = validateStringField({
        value: tokenValue,
        fieldName: tokenField,
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
  });

  describe('throwIfInvalid', () => {
    test('Should throw ValidationError when validation fails', () => {
      const validator = (value: string) => {
        const errors: string[] = [];
        if (value !== 'valid') {
          errors.push('Value must be "valid"');
        }
        return errors;
      };

      expect(() => {
        throwIfInvalid(validator, 'invalid');
      }).toThrow(ValidationError);

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
  });

  describe('ValidationError', () => {
    test('Should be an instance of Error', () => {
      const error = new ValidationError('Test error');
      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('ValidationError');
      expect(error.message).toBe('Test error');
    });
  });
});
