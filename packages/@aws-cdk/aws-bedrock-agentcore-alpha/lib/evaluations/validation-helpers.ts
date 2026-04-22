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
import { UnscopedValidationError } from 'aws-cdk-lib/core/lib/errors';
import { lit } from 'aws-cdk-lib/core/lib/helpers-internal';

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
 * @param params - Validation parameters including value, fieldName, minLength, and maxLength
 * @returns Array of validation error messages, empty if valid
 */
export function validateStringFieldLength(params: StringLengthValidation): string[] {
  const errors: string[] = [];

  // Handle null/undefined values
  if (params.value == null) {
    return errors;
  }

  const currentLength = params.value.length;

  // Evaluate only if it is not an unresolved Token
  if (!Token.isUnresolved(params.value)) {
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
 * @returns Array of validation error messages, empty if valid
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
    return errors;
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
    throw new UnscopedValidationError(lit`ValidationFailed`, errors.join('\n'));
  }
  return param;
}

/**
 * Validates that a sampling percentage is between 0.01 and 100 (inclusive).
 * @param value - The sampling percentage to validate
 * @returns Array of validation error messages, empty if valid
 */
export function validateSamplingPercentage(value: number): string[] {
  const errors: string[] = [];

  if (Token.isUnresolved(value)) {
    return errors;
  }

  if (value < 0.01 || value > 100) {
    errors.push(
      `sampling percentage must be between 0.01 and 100, got ${value}`,
    );
  }

  return errors;
}

/**
 * Validates that the number of evaluators does not exceed the maximum count.
 * @param evaluators - The array of evaluators to validate
 * @param maxCount - The maximum allowed number of evaluators
 * @returns Array of validation error messages, empty if valid
 */
export function validateEvaluatorCount(evaluators: unknown[], maxCount: number): string[] {
  const errors: string[] = [];

  if (Token.isUnresolved(evaluators)) {
    return errors;
  }

  if (evaluators.length > maxCount) {
    errors.push(
      `maximum of ${maxCount} evaluator references allowed, got ${evaluators.length}`,
    );
  }

  return errors;
}

/**
 * Validates an evaluator name for length (1-48) and pattern ([a-zA-Z][a-zA-Z0-9_]*).
 * @param name - The evaluator name to validate
 * @returns Array of validation error messages, empty if valid
 */
export function validateEvaluatorName(name: string): string[] {
  const errors: string[] = [];

  if (Token.isUnresolved(name)) {
    return errors;
  }

  errors.push(...validateStringFieldLength({
    value: name,
    fieldName: 'evaluatorName',
    minLength: 1,
    maxLength: 48,
  }));

  errors.push(...validateFieldPattern(
    name,
    'evaluatorName',
    /^[a-zA-Z][a-zA-Z0-9_]*$/,
    `evaluator name must match pattern [a-zA-Z][a-zA-Z0-9_]*, got "${name}"`,
  ));

  return errors;
}

/**
 * Validates an online evaluation config name for length (1-48) and pattern ([a-zA-Z][a-zA-Z0-9_]*).
 * @param name - The online evaluation config name to validate
 * @returns Array of validation error messages, empty if valid
 */
export function validateOnlineEvaluationConfigName(name: string): string[] {
  const errors: string[] = [];

  if (Token.isUnresolved(name)) {
    return errors;
  }

  errors.push(...validateStringFieldLength({
    value: name,
    fieldName: 'onlineEvaluationConfigName',
    minLength: 1,
    maxLength: 48,
  }));

  errors.push(...validateFieldPattern(
    name,
    'onlineEvaluationConfigName',
    /^[a-zA-Z][a-zA-Z0-9_]*$/,
    `online evaluation config name must match pattern [a-zA-Z][a-zA-Z0-9_]*, got "${name}"`,
  ));

  return errors;
}

/**
 * Validates tags for key length (1-128) and value length (0-256).
 * @param tags - Optional map of tag key-value pairs to validate
 * @returns Array of validation error messages, empty if valid
 */
export function validateTags(tags?: { [key: string]: string }): string[] {
  const errors: string[] = [];

  if (tags === undefined) {
    return errors;
  }

  if (Token.isUnresolved(tags)) {
    return errors;
  }

  for (const [key, value] of Object.entries(tags)) {
    if (Token.isUnresolved(key) || Token.isUnresolved(value)) {
      continue;
    }

    errors.push(...validateStringFieldLength({
      value: key,
      fieldName: `Tag key "${key}"`,
      minLength: 1,
      maxLength: 128,
    }));

    errors.push(...validateStringFieldLength({
      value: value,
      fieldName: `Tag value for key "${key}"`,
      minLength: 0,
      maxLength: 256,
    }));
  }

  return errors;
}
