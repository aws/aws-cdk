import { Token } from 'aws-cdk-lib';

/**
 * Error thrown when validation fails
 */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}
interface IntervalValidation {
  fieldName: string;
  minLength: number;
  maxLength: number;
}

interface StringLengthValidation extends IntervalValidation {
  value: string;
}

/**
 * Validates the length of a string field against minimum and maximum constraints.
 * @param value - The string value to validate
 * @param fieldName - Name of the field being validated (for error messages)
 * @param minLength - Minimum allowed length (defaults to 0)
 * @param maxLength - Maximum allowed length
 * @returns true if validation passes
 * @throws Error if validation fails with current length information
 */
export function validateStringFieldLength(params: StringLengthValidation): string[] {
  const currentLength = params.value.length;
  const errors: string[] = [];

  // Evaluate only if it is not an unresolved Token
  if (!Token.isUnresolved(params.fieldName)) {
    if (params.value.length > params.maxLength) {
      errors.push(
        `The field ${params.fieldName} is ${currentLength} characters long but must be less than or equal to ${params.maxLength} characters`,
      );
    }

    if (params.value.length < params.minLength) {
      errors.push(
        `The field ${params.fieldName} is ${currentLength} characters long but must be at least ${params.minLength} characters`,
      );
    }
  }

  return errors;
}

/**
 * Validates a string field against a regex pattern.
 * @param value - The string value to validate
 * @param fieldName - Name of the field being validated (for error messages)
 * @param pattern - Regular expression pattern to test against
 * @param customMessage - Optional custom error message
 * @returns true if validation passes
 * @throws Error if validation fails with detailed message
 */
export function validateFieldPattern(
  value: string,
  fieldName: string,
  pattern: RegExp,
  customMessage?: string,
): string[] {
  const errors: string[] = [];
  // Evaluate only if it is not an unresolved Token
  if (!Token.isUnresolved(value)) {
    // Verify type
    if (typeof value !== 'string') {
      errors.push(`Expected string for ${fieldName}, got ${typeof value}`);
    }
    // Validate specified regex
    if (!(pattern instanceof RegExp)) {
      errors.push('Pattern must be a valid regular expression');
    }

    // Pattern validation
    if (!pattern.test(value)) {
      const defaultMessage = `The field ${fieldName} with value "${value}" does not match the required pattern ${pattern}`;
      errors.push(customMessage || defaultMessage);
    }
  }

  return errors;
}

export type ValidationFn<T> = (param: T) => string[];

export function throwIfInvalid<T>(validationFn: ValidationFn<T>, param: T): T {
  const errors = validationFn(param);
  if (errors.length > 0) {
    throw new ValidationError(errors.join('\n'));
  }
  return param;
}
