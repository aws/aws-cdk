import { Construct } from 'constructs';
import { ValidationError } from '../../lib/errors';
import { validateAllProps, ValidationRule } from '../../lib/helpers-internal/validate-all-props';

class TestConstruct extends Construct {
  constructor() {
    super(undefined as any, 'TestConstruct');
  }
}

describe('validateAllProps', () => {
  let testScope: Construct;

  beforeEach(() => {
    testScope = new TestConstruct();
  });

  it('should not throw an error when all validations pass', () => {
    const props = { value: 5 };
    const rules: ValidationRule<typeof props>[] = [
      {
        condition: (p) => p.value < 0,
        message: (p) => `Value ${p.value} should be non-negative`,
      },
    ];

    expect(() => validateAllProps(testScope, 'TestClass', props, rules)).not.toThrow();
  });

  it('should throw a ValidationError when a validation fails', () => {
    const props = { value: -5 };
    const rules: ValidationRule<typeof props>[] = [
      {
        condition: (p) => p.value < 0,
        message: (p) => `Value ${p.value} should be non-negative`,
      },
    ];

    expect(() => validateAllProps(testScope, 'TestClass', props, rules)).toThrow(ValidationError);
  });

  it('should include all failed validation messages in the error', () => {
    const props = { value1: -5, value2: 15 };
    const rules: ValidationRule<typeof props>[] = [
      {
        condition: (p) => p.value1 < 0,
        message: (p) => `Value1 ${p.value1} should be non-negative`,
      },
      {
        condition: (p) => p.value2 > 10,
        message: (p) => `Value2 ${p.value2} should be 10 or less`,
      },
    ];

    expect(() => validateAllProps(testScope, 'TestClass', props, rules)).toThrow(ValidationError);
    try {
      validateAllProps(testScope, 'TestClass', props, rules);
    } catch (error) {
      if (error instanceof ValidationError) {
        expect(error.message).toBe(
          'TestClass initialization failed due to the following validation error(s):\n' +
          '- Value1 -5 should be non-negative\n' +
          '- Value2 15 should be 10 or less',
        );
      }
    }
  });

  it('should work with complex object structures', () => {
    const props = { nested: { value: 'invalid' } };
    const rules: ValidationRule<typeof props>[] = [
      {
        condition: (p) => p.nested.value !== 'valid',
        message: (p) => `Nested value "${p.nested.value}" is not valid`,
      },
    ];

    expect(() => validateAllProps(testScope, 'TestClass', props, rules)).toThrow(ValidationError);
    try {
      validateAllProps(testScope, 'TestClass', props, rules);
    } catch (error) {
      if (error instanceof ValidationError) {
        expect(error.message).toBe(
          'TestClass initialization failed due to the following validation error(s):\n' +
          '- Nested value "invalid" is not valid',
        );
      }
    }
  });
});
