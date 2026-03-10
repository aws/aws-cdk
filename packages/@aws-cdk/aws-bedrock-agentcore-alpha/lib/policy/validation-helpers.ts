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
import {
  validateStringFieldLength,
  validateFieldPattern,
  throwIfInvalid,
  type ValidationFn,
} from '../memory/validation-helpers';

/**
 * Validation constants for PolicyEngine
 */
export const POLICY_ENGINE_NAME_MIN_LENGTH = 1;
export const POLICY_ENGINE_NAME_MAX_LENGTH = 48;
export const POLICY_ENGINE_NAME_PATTERN = /^[A-Za-z][A-Za-z0-9_]*$/;

/**
 * Validation constants for Policy
 */
export const POLICY_NAME_MIN_LENGTH = 1;
export const POLICY_NAME_MAX_LENGTH = 48;
export const POLICY_NAME_PATTERN = /^[A-Za-z][A-Za-z0-9_]*$/;

/**
 * Validation constants for Cedar policy definitions
 */
export const POLICY_DEFINITION_MIN_LENGTH = 35;
export const POLICY_DEFINITION_MAX_LENGTH = 153600;

/**
 * Validation constants for descriptions
 */
export const DESCRIPTION_MAX_LENGTH = 4096;

/**
 * Validation constants for tags
 */
export const MAX_TAGS = 50;
export const TAG_KEY_MIN_LENGTH = 1;
export const TAG_KEY_MAX_LENGTH = 128;
export const TAG_VALUE_MAX_LENGTH = 256;
export const TAG_KEY_PATTERN = /^[a-zA-Z0-9\s._:/=+@-]+$/;
export const TAG_VALUE_PATTERN = /^[a-zA-Z0-9\s._:/=+@-]*$/;

/**
 * Validates a policy engine name.
 * Names must:
 * - Start with a letter (a-z, A-Z)
 * - Contain only letters, numbers, and underscores
 * - Be between 1 and 48 characters
 *
 * @param name - The policy engine name to validate
 * @param scope - The construct scope for error reporting (optional)
 * @returns Array of validation error messages, empty if valid
 */
export function validatePolicyEngineName(name: string, scope?: IConstruct): string[] {
  const errors: string[] = [];

  // Handle null/undefined values
  if (name == null) {
    return errors;
  }

  // Validate length
  errors.push(
    ...validateStringFieldLength(
      {
        value: name,
        fieldName: 'policyEngineName',
        minLength: POLICY_ENGINE_NAME_MIN_LENGTH,
        maxLength: POLICY_ENGINE_NAME_MAX_LENGTH,
      },
      scope,
    ),
  );

  // Validate pattern
  errors.push(
    ...validateFieldPattern(
      name,
      'policyEngineName',
      POLICY_ENGINE_NAME_PATTERN,
      `The policy engine name "${name}" must start with a letter and contain only letters, numbers, and underscores`,
      scope,
    ),
  );

  return errors;
}

/**
 * Validates a policy name.
 * Names must:
 * - Start with a letter (a-z, A-Z)
 * - Contain only letters, numbers, and underscores
 * - Be between 1 and 48 characters
 *
 * @param name - The policy name to validate
 * @param scope - The construct scope for error reporting (optional)
 * @returns Array of validation error messages, empty if valid
 */
export function validatePolicyName(name: string, scope?: IConstruct): string[] {
  const errors: string[] = [];

  // Handle null/undefined values
  if (name == null) {
    return errors;
  }

  // Validate length
  errors.push(
    ...validateStringFieldLength(
      {
        value: name,
        fieldName: 'policyName',
        minLength: POLICY_NAME_MIN_LENGTH,
        maxLength: POLICY_NAME_MAX_LENGTH,
      },
      scope,
    ),
  );

  // Validate pattern
  errors.push(
    ...validateFieldPattern(
      name,
      'policyName',
      POLICY_NAME_PATTERN,
      `The policy name "${name}" must start with a letter and contain only letters, numbers, and underscores`,
      scope,
    ),
  );

  return errors;
}

/**
 * Validates a Cedar policy definition string.
 * Definitions must be between 35 and 153,600 characters.
 *
 * @param definition - The Cedar policy definition to validate
 * @param scope - The construct scope for error reporting (optional)
 * @returns Array of validation error messages, empty if valid
 */
export function validatePolicyDefinition(definition: string, scope?: IConstruct): string[] {
  const errors: string[] = [];

  // Handle null/undefined values
  if (definition == null) {
    errors.push('Policy definition is required and cannot be null or undefined');
    return errors;
  }

  // Validate length
  errors.push(
    ...validateStringFieldLength(
      {
        value: definition,
        fieldName: 'definition',
        minLength: POLICY_DEFINITION_MIN_LENGTH,
        maxLength: POLICY_DEFINITION_MAX_LENGTH,
      },
      scope,
    ),
  );

  return errors;
}

/**
 * Validates a description string.
 * Descriptions must not exceed 4,096 characters.
 *
 * @param description - The description to validate
 * @param scope - The construct scope for error reporting (optional)
 * @returns Array of validation error messages, empty if valid
 */
export function validateDescription(description: string, scope?: IConstruct): string[] {
  const errors: string[] = [];

  // Handle null/undefined values
  if (description == null) {
    return errors;
  }

  // Validate length (no minimum length requirement)
  errors.push(
    ...validateStringFieldLength(
      {
        value: description,
        fieldName: 'description',
        minLength: 0,
        maxLength: DESCRIPTION_MAX_LENGTH,
      },
      scope,
    ),
  );

  return errors;
}

/**
 * Validates a policy engine name and throws if invalid.
 *
 * @param name - The policy engine name to validate
 * @param scope - The construct scope for error reporting (optional)
 * @returns The validated name
 * @throws ValidationError if validation fails
 */
export function throwIfInvalidPolicyEngineName(name: string, scope?: IConstruct): string {
  return throwIfInvalid(validatePolicyEngineName as ValidationFn<string>, name, scope);
}

/**
 * Validates a policy name and throws if invalid.
 *
 * @param name - The policy name to validate
 * @param scope - The construct scope for error reporting (optional)
 * @returns The validated name
 * @throws ValidationError if validation fails
 */
export function throwIfInvalidPolicyName(name: string, scope?: IConstruct): string {
  return throwIfInvalid(validatePolicyName as ValidationFn<string>, name, scope);
}

/**
 * Validates a policy definition and throws if invalid.
 *
 * @param definition - The Cedar policy definition to validate
 * @param scope - The construct scope for error reporting (optional)
 * @returns The validated definition
 * @throws ValidationError if validation fails
 */
export function throwIfInvalidPolicyDefinition(definition: string, scope?: IConstruct): string {
  return throwIfInvalid(validatePolicyDefinition as ValidationFn<string>, definition, scope);
}

/**
 * Validates a description and throws if invalid.
 *
 * @param description - The description to validate
 * @param scope - The construct scope for error reporting (optional)
 * @returns The validated description
 * @throws ValidationError if validation fails
 */
export function throwIfInvalidDescription(description: string, scope?: IConstruct): string {
  return throwIfInvalid(validateDescription as ValidationFn<string>, description, scope);
}

/**
 * Validates tags for a PolicyEngine.
 * Tags must:
 * - Not exceed 50 tags
 * - Have keys between 1 and 128 characters
 * - Have values between 0 and 256 characters
 * - Match allowed character patterns
 *
 * @param tags - The tags object to validate
 * @param resourceName - The name of the resource being tagged (for error messages)
 * @param scope - The construct scope for error reporting (optional)
 * @returns Array of validation error messages, empty if valid
 */
export function validateTags(
  tags: { [key: string]: string },
  resourceName: string,
  _scope?: IConstruct,
): string[] {
  const errors: string[] = [];

  // Handle null/undefined values
  if (tags == null) {
    return errors;
  }

  // Validate tag count
  const tagCount = Object.keys(tags).length;
  if (tagCount > MAX_TAGS) {
    errors.push(
      `PolicyEngine '${resourceName}' cannot have more than ${MAX_TAGS} tags. Found: ${tagCount}`,
    );
  }

  // Validate each tag
  for (const [key, value] of Object.entries(tags)) {
    // Validate key length
    if (key.length < TAG_KEY_MIN_LENGTH || key.length > TAG_KEY_MAX_LENGTH) {
      errors.push(
        `PolicyEngine '${resourceName}' tag key length must be between ${TAG_KEY_MIN_LENGTH} and ${TAG_KEY_MAX_LENGTH} characters. ` +
          `Key: "${key}" has length ${key.length}`,
      );
    }

    // Validate key pattern
    if (!TAG_KEY_PATTERN.test(key)) {
      errors.push(
        `PolicyEngine '${resourceName}' tag key contains invalid characters. ` +
          `Key: "${key}". Valid characters: a-zA-Z0-9 and ._:/=+@-`,
      );
    }

    // Validate value length
    if (value.length > TAG_VALUE_MAX_LENGTH) {
      errors.push(
        `PolicyEngine '${resourceName}' tag value length cannot exceed ${TAG_VALUE_MAX_LENGTH} characters. ` +
          `Key: "${key}", value has length ${value.length}`,
      );
    }

    // Validate value pattern
    if (!TAG_VALUE_PATTERN.test(value)) {
      errors.push(
        `PolicyEngine '${resourceName}' tag value contains invalid characters. ` +
          `Key: "${key}", Value: "${value}". Valid characters: a-zA-Z0-9 and ._:/=+@-`,
      );
    }
  }

  return errors;
}

/**
 * Validates tags and throws if invalid.
 *
 * @param tags - The tags object to validate
 * @param resourceName - The name of the resource being tagged (for error messages)
 * @param scope - The construct scope for error reporting (optional)
 * @returns The validated tags
 * @throws ValidationError if validation fails
 */
export function throwIfInvalidTags(
  tags: { [key: string]: string },
  resourceName: string,
  scope?: IConstruct,
): { [key: string]: string } {
  return throwIfInvalid(
    (t: { [key: string]: string }, s?: IConstruct) => validateTags(t, resourceName, s),
    tags,
    scope,
  );
}
