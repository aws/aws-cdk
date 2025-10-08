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

export interface StringValidationConfig {
  minLength: number;
  maxLength: number;
  fieldName: string;
  pattern?: RegExp;
  extraErrorInfo?: string;
}

export function validateStringField(value: string, config: StringValidationConfig): void {
  if (value.length < config.minLength || value.length > config.maxLength) {
    throw new Error(
      `${config.fieldName} must be between ${config.minLength} and ${config.maxLength} characters long`,
    );
  }
  if (config.pattern && !config.pattern.test(value)) {
    const errorMsg = config.extraErrorInfo
      ? `${config.fieldName} ${config.extraErrorInfo}. Must match pattern ${config.pattern}`
      : `${config.fieldName} must match pattern ${config.pattern}`;
    throw new Error(errorMsg);
  }
}

export interface NumberValidationConfig {
  min: number;
  max: number;
  fieldName: string;
}

export function validateNumberField(value: number, config: NumberValidationConfig): void {
  if (value < config.min || value > config.max) {
    throw new Error(
      `${config.fieldName} must be between ${config.min} and ${config.max}`,
    );
  }
}

// Memory validations
export function validateMemoryName(name: string): void {
  validateStringField(name, {
    minLength: 1,
    maxLength: 48,
    pattern: /^[a-zA-Z][a-zA-Z0-9_]{0,47}$/,
    fieldName: 'Memory name',
    extraErrorInfo: 'must start with a letter and contain only letters, numbers, and underscores',
  });
}
