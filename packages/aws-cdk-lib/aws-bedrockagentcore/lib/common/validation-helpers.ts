import type { IConstruct } from 'constructs';
import { Token } from '../../../core';
import { ValidationError, UnscopedValidationError } from '../../../core/lib/errors';
import { lit } from '../../../core/lib/helpers-internal';

export interface StringLengthValidation {
  value: string;
  fieldName: string;
  minLength: number;
  maxLength: number;
}

export type ValidationFn<T> = (param: T, scope?: IConstruct) => string[];

export function validateStringFieldLength(params: StringLengthValidation, _scope?: IConstruct): string[] {
  const errors: string[] = [];
  if (params.value == null || Token.isUnresolved(params.value)) {
    return errors;
  }
  const currentLength = params.value.length;
  if (currentLength > params.maxLength) {
    errors.push(
      `The field ${params.fieldName} is ${currentLength} characters long but must be less than or equal to ${params.maxLength} characters`,
    );
  }
  if (currentLength < params.minLength) {
    errors.push(
      `The field ${params.fieldName} is ${currentLength} characters long but must be at least ${params.minLength} characters`,
    );
  }
  return errors;
}

export function validateFieldPattern(
  value: string,
  fieldName: string,
  pattern: RegExp,
  customMessage?: string,
  _scope?: IConstruct,
): string[] {
  const errors: string[] = [];
  if (value == null || Token.isUnresolved(value)) {
    return errors;
  }
  if (typeof value !== 'string') {
    errors.push(`Expected string for ${fieldName}, got ${typeof value}`);
    return errors;
  }
  if (!(pattern instanceof RegExp)) {
    errors.push('Pattern must be a valid regular expression');
    return errors;
  }
  if (!pattern.test(value)) {
    errors.push(customMessage || `The field ${fieldName} with value "${value}" does not match the required pattern ${pattern}`);
  }
  return errors;
}

export function throwIfInvalid<T>(validationFn: ValidationFn<T>, param: T, scope?: IConstruct): T {
  const errors = validationFn(param, scope);
  if (errors.length > 0) {
    if (scope) {
      throw new ValidationError(lit`ValidationFailed`, errors.join('\n'), scope);
    } else {
      throw new UnscopedValidationError(lit`ValidationFailed`, errors.join('\n'));
    }
  }
  return param;
}
