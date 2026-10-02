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

import type { IConstruct } from 'constructs';
import type { CategoricalRatingOption, FilterConfig, NumericalRatingOption } from './types';
import { Token } from '../../../core';
import { ValidationError, UnscopedValidationError } from '../../../core/lib/errors';
import { lit } from '../../../core/lib/helpers-internal';

/**
 * Interface for evaluator references used in validation.
 * @internal
 */
interface IEvaluatorSelector {
  readonly evaluatorId: string;
}

/******************************************************************************
 *                              CONSTANTS
 *****************************************************************************/
const CONFIG_NAME_MIN_LENGTH = 1;
const CONFIG_NAME_MAX_LENGTH = 48;
const DESCRIPTION_MAX_LENGTH = 200;
const EVALUATORS_MIN_COUNT = 1;
const EVALUATORS_MAX_COUNT = 10;
const SAMPLING_PERCENTAGE_MIN = 0.01;
const SAMPLING_PERCENTAGE_MAX = 100;
const FILTERS_MAX_COUNT = 5;
const SESSION_TIMEOUT_MIN = 1;
const SESSION_TIMEOUT_MAX = 1440;
const LOG_GROUPS_MIN_COUNT = 1;
const LOG_GROUPS_MAX_COUNT = 5;
const SERVICE_NAMES_MIN_COUNT = 1;
const SERVICE_NAMES_MAX_COUNT = 1;
const EVALUATOR_NAME_MIN_LENGTH = 1;
const EVALUATOR_NAME_MAX_LENGTH = 48;
const RATING_SCALE_MIN_OPTIONS = 1;
const TAG_KEY_MIN = 1;
const TAG_KEY_MAX = 128;
const TAG_VALUE_MAX = 256;
const TAGS_MAX_COUNT = 50;
const ONLINE_EVALUATION_CONFIG_TAG_KEY_PATTERN = /^[a-zA-Z+\-=._:/]+$/;
const EVALUATOR_TAG_KEY_PATTERN = /^[\p{L}\p{N}\s._:/=+@-]+$/u;
const TAG_VALUE_PATTERN = /^[\p{L}\p{N}\s._/=+-]*$/u;

/******************************************************************************
 *                              TYPES
 *****************************************************************************/
export type ValidationFn<T> = (param: T, scope?: IConstruct) => string[];

/******************************************************************************
 *                         VALIDATION FUNCTIONS
 *****************************************************************************/

/**
 * Validates the online evaluation configuration name.
 * Must start with a letter and contain only alphanumeric characters and underscores.
 * @param name - The configuration name to validate
 * @param _scope - The construct scope for error reporting (optional)
 * @returns Array of validation error messages, empty if valid
 */
export function validateConfigName(name: string, _scope?: IConstruct): string[] {
  const errors: string[] = [];

  if (name == null) {
    return errors;
  }

  if (Token.isUnresolved(name)) {
    return errors;
  }

  if (name.length < CONFIG_NAME_MIN_LENGTH) {
    errors.push(
      `Configuration name must be at least ${CONFIG_NAME_MIN_LENGTH} character(s), got ${name.length}`,
    );
  }

  if (name.length > CONFIG_NAME_MAX_LENGTH) {
    errors.push(
      `Configuration name must be at most ${CONFIG_NAME_MAX_LENGTH} characters, got ${name.length}`,
    );
  }

  // Pattern: ^[a-zA-Z][a-zA-Z0-9_]{0,47}$
  const validNamePattern = /^[a-zA-Z][a-zA-Z0-9_]{0,47}$/;
  if (!validNamePattern.test(name)) {
    errors.push(
      `Configuration name "${name}" does not match required pattern. Must start with a letter and contain only alphanumeric characters and underscores.`,
    );
  }

  return errors;
}

/**
 * Validates the description field.
 * @param description - The description to validate
 * @param _scope - The construct scope for error reporting (optional)
 * @returns Array of validation error messages, empty if valid
 */
export function validateDescription(description: string | undefined, _scope?: IConstruct): string[] {
  const errors: string[] = [];

  if (description == null) {
    return errors;
  }

  if (Token.isUnresolved(description)) {
    return errors;
  }

  if (description.length > DESCRIPTION_MAX_LENGTH) {
    errors.push(
      `Description must be at most ${DESCRIPTION_MAX_LENGTH} characters, got ${description.length}`,
    );
  }

  return errors;
}

/**
 * Validates the evaluators array.
 * @param evaluators - The evaluators array to validate
 * @param _scope - The construct scope for error reporting (optional)
 * @returns Array of validation error messages, empty if valid
 */
export function validateEvaluators(evaluators: IEvaluatorSelector[], _scope?: IConstruct): string[] {
  const errors: string[] = [];

  if (evaluators == null) {
    errors.push('Evaluators array is required');
    return errors;
  }

  if (evaluators.length < EVALUATORS_MIN_COUNT) {
    errors.push(
      `At least ${EVALUATORS_MIN_COUNT} evaluator is required, got ${evaluators.length}`,
    );
  }

  if (evaluators.length > EVALUATORS_MAX_COUNT) {
    errors.push(
      `At most ${EVALUATORS_MAX_COUNT} evaluators are allowed, got ${evaluators.length}`,
    );
  }

  return errors;
}

/**
 * Validates the sampling percentage.
 * @param percentage - The sampling percentage to validate
 * @param _scope - The construct scope for error reporting (optional)
 * @returns Array of validation error messages, empty if valid
 */
export function validateSamplingPercentage(percentage: number | undefined, _scope?: IConstruct): string[] {
  const errors: string[] = [];

  if (percentage == null) {
    return errors;
  }

  if (Token.isUnresolved(percentage)) {
    return errors;
  }

  if (percentage < SAMPLING_PERCENTAGE_MIN) {
    errors.push(
      `Sampling percentage must be at least ${SAMPLING_PERCENTAGE_MIN}, got ${percentage}`,
    );
  }

  if (percentage > SAMPLING_PERCENTAGE_MAX) {
    errors.push(
      `Sampling percentage must be at most ${SAMPLING_PERCENTAGE_MAX}, got ${percentage}`,
    );
  }

  return errors;
}

/**
 * Validates the filters array.
 * @param filters - The filters array to validate
 * @param _scope - The construct scope for error reporting (optional)
 * @returns Array of validation error messages, empty if valid
 */
export function validateFilters(filters: FilterConfig[] | undefined, _scope?: IConstruct): string[] {
  const errors: string[] = [];

  if (filters == null) {
    return errors;
  }

  if (filters.length > FILTERS_MAX_COUNT) {
    errors.push(
      `At most ${FILTERS_MAX_COUNT} filters are allowed, got ${filters.length}`,
    );
  }

  return errors;
}

/**
 * Validates the session timeout in minutes.
 * @param minutes - The session timeout in minutes to validate
 * @param _scope - The construct scope for error reporting (optional)
 * @returns Array of validation error messages, empty if valid
 */
export function validateSessionTimeout(minutes: number | undefined, _scope?: IConstruct): string[] {
  const errors: string[] = [];

  if (minutes == null) {
    return errors;
  }

  if (Token.isUnresolved(minutes)) {
    return errors;
  }

  if (minutes < SESSION_TIMEOUT_MIN) {
    errors.push(
      `Session timeout must be at least ${SESSION_TIMEOUT_MIN} minute(s), got ${minutes}`,
    );
  }

  if (minutes > SESSION_TIMEOUT_MAX) {
    errors.push(
      `Session timeout must be at most ${SESSION_TIMEOUT_MAX} minutes, got ${minutes}`,
    );
  }

  return errors;
}

/**
 * Validates the log group names array.
 * @param names - The log group names array to validate
 * @param _scope - The construct scope for error reporting (optional)
 * @returns Array of validation error messages, empty if valid
 */
export function validateLogGroupNames(names: string[], _scope?: IConstruct): string[] {
  const errors: string[] = [];

  if (names == null || names.length < LOG_GROUPS_MIN_COUNT) {
    errors.push(`At least ${LOG_GROUPS_MIN_COUNT} log group name is required, got ${names?.length ?? 0}`);
    return errors;
  }

  if (names.length > LOG_GROUPS_MAX_COUNT) {
    errors.push(`At most ${LOG_GROUPS_MAX_COUNT} log group names are allowed, got ${names.length}`);
  }

  return errors;
}

/**
 * Validates the service names array.
 * @param names - The service names array to validate
 * @param _scope - The construct scope for error reporting (optional)
 * @returns Array of validation error messages, empty if valid
 */
export function validateServiceNames(names: string[], _scope?: IConstruct): string[] {
  const errors: string[] = [];

  if (names == null || names.length < SERVICE_NAMES_MIN_COUNT) {
    errors.push(`At least ${SERVICE_NAMES_MIN_COUNT} service name is required, got ${names?.length ?? 0}`);
    return errors;
  }

  if (names.length > SERVICE_NAMES_MAX_COUNT) {
    errors.push(`At most ${SERVICE_NAMES_MAX_COUNT} service name is allowed, got ${names.length}`);
  }

  return errors;
}

/**
 * Validates the evaluator name.
 * Must start with a letter and contain only alphanumeric characters and underscores.
 * @param name - The evaluator name to validate
 * @param _scope - The construct scope for error reporting (optional)
 * @returns Array of validation error messages, empty if valid
 */
export function validateEvaluatorName(name: string, _scope?: IConstruct): string[] {
  const errors: string[] = [];

  if (name == null) {
    return errors;
  }

  if (Token.isUnresolved(name)) {
    return errors;
  }

  if (name.length < EVALUATOR_NAME_MIN_LENGTH) {
    errors.push(
      `Evaluator name must be at least ${EVALUATOR_NAME_MIN_LENGTH} character(s), got ${name.length}`,
    );
  }

  if (name.length > EVALUATOR_NAME_MAX_LENGTH) {
    errors.push(
      `Evaluator name must be at most ${EVALUATOR_NAME_MAX_LENGTH} characters, got ${name.length}`,
    );
  }

  // Pattern: ^[a-zA-Z][a-zA-Z0-9_]{0,47}$
  const validNamePattern = /^[a-zA-Z][a-zA-Z0-9_]{0,47}$/;
  if (!validNamePattern.test(name)) {
    errors.push(
      `Evaluator name "${name}" does not match required pattern. Must start with a letter and contain only alphanumeric characters and underscores.`,
    );
  }

  return errors;
}

/**
 * Validates that instructions are provided and non-empty.
 * @param instructions - The instructions to validate
 * @param _scope - The construct scope for error reporting (optional)
 * @returns Array of validation error messages, empty if valid
 */
export function validateInstructions(instructions: string, _scope?: IConstruct): string[] {
  const errors: string[] = [];

  if (instructions == null) {
    errors.push('Instructions are required for LLM-as-a-Judge evaluators');
    return errors;
  }

  if (Token.isUnresolved(instructions)) {
    return errors;
  }

  if (instructions.trim().length === 0) {
    errors.push('Instructions must not be empty');
  }

  return errors;
}

/**
 * Validates a categorical rating scale.
 * @param options - The categorical rating options to validate
 * @param _scope - The construct scope for error reporting (optional)
 * @returns Array of validation error messages, empty if valid
 */
export function validateCategoricalRatingScale(options: CategoricalRatingOption[], _scope?: IConstruct): string[] {
  const errors: string[] = [];

  if (options == null || options.length < RATING_SCALE_MIN_OPTIONS) {
    errors.push(`At least ${RATING_SCALE_MIN_OPTIONS} categorical rating option is required, got ${options?.length ?? 0}`);
    return errors;
  }

  for (let i = 0; i < options.length; i++) {
    if (!Token.isUnresolved(options[i].label) && (!options[i].label || options[i].label.trim().length === 0)) {
      errors.push(`Categorical rating option at index ${i} must have a non-empty label`);
    }
    if (!Token.isUnresolved(options[i].definition) && (!options[i].definition || options[i].definition.trim().length === 0)) {
      errors.push(`Categorical rating option at index ${i} must have a non-empty definition`);
    }
  }

  return errors;
}

/**
 * Validates a numerical rating scale.
 * @param options - The numerical rating options to validate
 * @param _scope - The construct scope for error reporting (optional)
 * @returns Array of validation error messages, empty if valid
 */
export function validateNumericalRatingScale(options: NumericalRatingOption[], _scope?: IConstruct): string[] {
  const errors: string[] = [];

  if (options == null || options.length < RATING_SCALE_MIN_OPTIONS) {
    errors.push(`At least ${RATING_SCALE_MIN_OPTIONS} numerical rating option is required, got ${options?.length ?? 0}`);
    return errors;
  }

  for (let i = 0; i < options.length; i++) {
    if (!Token.isUnresolved(options[i].label) && (!options[i].label || options[i].label.trim().length === 0)) {
      errors.push(`Numerical rating option at index ${i} must have a non-empty label`);
    }
    if (!Token.isUnresolved(options[i].definition) && (!options[i].definition || options[i].definition.trim().length === 0)) {
      errors.push(`Numerical rating option at index ${i} must have a non-empty definition`);
    }
  }

  return errors;
}

/**
 * Validates the Lambda timeout in seconds.
 * @param seconds - The timeout in seconds to validate
 * @param _scope - The construct scope for error reporting (optional)
 * @returns Array of validation error messages, empty if valid
 */
export function validateLambdaTimeout(seconds: number | undefined, _scope?: IConstruct): string[] {
  const errors: string[] = [];

  if (seconds == null) {
    return errors;
  }

  if (Token.isUnresolved(seconds)) {
    return errors;
  }

  if (seconds <= 0) {
    errors.push(`Lambda timeout must be a positive number, got ${seconds}`);
  }

  return errors;
}

/******************************************************************************
 *                              HELPER FUNCTIONS
 *****************************************************************************/

/**
 * Throws a validation error if the validation function returns any errors.
 * @param validationFn - The validation function to execute
 * @param param - The parameter to validate
 * @param scope - The construct scope for error reporting (optional)
 * @returns The validated parameter
 */
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

/**
 * Validates tags for evaluation resources.
 * @param tags - The tags object to validate
 * @param keyPattern - The regex pattern to validate tag keys against
 * @param _scope - The construct scope for error reporting (optional)
 * @returns Array of validation error messages, empty if valid
 */
function validateTags(tags: { [key: string]: string } | undefined, keyPattern: RegExp, _scope?: IConstruct): string[] {
  const errors: string[] = [];
  if (tags == null) {
    return errors;
  }
  if (Token.isUnresolved(tags)) {
    return errors;
  }

  if (Object.keys(tags).length > TAGS_MAX_COUNT) {
    errors.push(`Cannot have more than ${TAGS_MAX_COUNT} tags, got ${Object.keys(tags).length}`);
  }

  for (const [key, value] of Object.entries(tags)) {
    if (!Token.isUnresolved(key)) {
      if (key.trim().length === 0) {
        errors.push('Tag key cannot be empty or consist only of whitespace');
      } else if (key.length < TAG_KEY_MIN || key.length > TAG_KEY_MAX) {
        errors.push(`Tag key "${key}" must be between ${TAG_KEY_MIN} and ${TAG_KEY_MAX} characters, got ${key.length}`);
      }
      if (key.toLowerCase().startsWith('aws:')) {
        errors.push(`Tag key "${key}" cannot start with "aws:" as this prefix is reserved by AWS`);
      }
      if (!keyPattern.test(key)) {
        errors.push(`Tag key "${key}" contains invalid characters`);
      }
    }
    if (!Token.isUnresolved(value)) {
      if (value.length > TAG_VALUE_MAX) {
        errors.push(`Tag value for key "${key}" must be at most ${TAG_VALUE_MAX} characters, got ${value.length}`);
      }
      if (!TAG_VALUE_PATTERN.test(value)) {
        errors.push(`Tag value for key "${key}" contains invalid characters. Valid: Unicode letters, digits, whitespace, and _./=+-`);
      }
    }
  }

  return errors;
}

/** Validates tags for Evaluator resources (Unicode keys allowed per CFN docs) */
export function validateEvaluatorTags(tags?: { [key: string]: string }, scope?: IConstruct): string[] {
  return validateTags(tags, EVALUATOR_TAG_KEY_PATTERN, scope);
}

/** Validates tags for OnlineEvaluationConfig resources (ASCII keys per CFN pattern) */
export function validateEvaluationTags(tags?: { [key: string]: string }, scope?: IConstruct): string[] {
  return validateTags(tags, ONLINE_EVALUATION_CONFIG_TAG_KEY_PATTERN, scope);
}
