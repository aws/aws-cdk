/**
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance
 *  with the License. A copy of the License is located at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  or in the 'license' file accompanying this file. This file is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES
 *  OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions
 *  and limitations under the License.
 */

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
  const errors: string[] = [];

  // Handle null/undefined values
  if (params.value == null) {
    return errors; // Skip validation for null/undefined values
  }

  const currentLength = params.value.length;

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

  // Handle null/undefined values
  if (value == null) {
    return errors; // Skip validation for null/undefined values
  }

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
