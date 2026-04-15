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
import type { IConstruct } from 'constructs';
import { validateFieldPattern, validateStringFieldLength, throwIfInvalid } from '../memory/validation-helpers';

/** @internal */
export const CREDENTIAL_PROVIDER_NAME_MIN = 1;

/** @internal */
export const CREDENTIAL_PROVIDER_NAME_MAX = 128;

/** @internal */
export const CREDENTIAL_PROVIDER_NAME_PATTERN = /^[a-zA-Z0-9\-_]+$/;

/** @internal */
export const API_KEY_VALUE_MIN = 1;

/** @internal */
export const API_KEY_VALUE_MAX = 65536;

/** @internal */
export const CREDENTIAL_PROVIDER_TAG_MIN = 1;

/** @internal */
export const CREDENTIAL_PROVIDER_TAG_MAX = 256;

/**
 * @internal
 */
export function validateCredentialProviderName(name: string, scope?: IConstruct): string[] {
  const errors: string[] = [];
  errors.push(...validateStringFieldLength({
    value: name,
    fieldName: 'Credential provider name',
    minLength: CREDENTIAL_PROVIDER_NAME_MIN,
    maxLength: CREDENTIAL_PROVIDER_NAME_MAX,
  }, scope));
  errors.push(...validateFieldPattern(
    name,
    'Credential provider name',
    CREDENTIAL_PROVIDER_NAME_PATTERN,
    'Credential provider name may only contain letters, numbers, hyphens, and underscores.',
    scope,
  ));
  return errors;
}

/**
 * @internal
 */
export function validateApiKeyValue(apiKey: string | undefined, scope?: IConstruct): string[] {
  if (apiKey == null || apiKey === '') {
    return [];
  }
  if (Token.isUnresolved(apiKey)) {
    return [];
  }
  return validateStringFieldLength({
    value: apiKey,
    fieldName: 'API key',
    minLength: API_KEY_VALUE_MIN,
    maxLength: API_KEY_VALUE_MAX,
  }, scope);
}

/**
 * @internal
 */
export function validateCredentialProviderTags(tags?: { [key: string]: string }, scope?: IConstruct): string[] {
  let errors: string[] = [];
  if (!tags) {
    return errors;
  }

  const validKeyPattern = /^[a-zA-Z0-9\s._:/=+@-]*$/;
  const validValuePattern = /^[a-zA-Z0-9\s._:/=+@-]*$/;

  for (const [key, value] of Object.entries(tags)) {
    errors.push(...validateStringFieldLength({
      value: key,
      fieldName: 'Tag key',
      minLength: CREDENTIAL_PROVIDER_TAG_MIN,
      maxLength: CREDENTIAL_PROVIDER_TAG_MAX,
    }, scope));
    errors.push(...validateFieldPattern(key, 'Tag key', validKeyPattern, undefined, scope));

    errors.push(...validateStringFieldLength({
      value,
      fieldName: 'Tag value',
      minLength: CREDENTIAL_PROVIDER_TAG_MIN,
      maxLength: CREDENTIAL_PROVIDER_TAG_MAX,
    }, scope));
    errors.push(...validateFieldPattern(value, 'Tag value', validValuePattern, undefined, scope));
  }

  return errors;
}

export { throwIfInvalid };
