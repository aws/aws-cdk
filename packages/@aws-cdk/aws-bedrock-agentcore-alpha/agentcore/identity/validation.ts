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

import { IdentityType } from './identity';
import { validateStringField } from '../utils/validation';

export namespace IdentityValidation {
  export function validateOAuth2ProviderName(name: string): void {
    validateStringField(name, {
      minLength: 1,
      maxLength: 128,
      pattern: /^[a-zA-Z0-9\-_]+$/,
      fieldName: 'OAuth2 provider name',
      extraErrorInfo: 'must contain only letters, numbers, hyphens, and underscores',
    });
  }

  export function validateApiKeyProviderName(name: string): void {
    validateStringField(name, {
      minLength: 1,
      maxLength: 128,
      pattern: /^[a-zA-Z0-9\-_]+$/,
      fieldName: 'API key provider name',
      extraErrorInfo: 'must contain only letters, numbers, hyphens, and underscores',
    });
  }

  export function validateWorkloadIdentityName(name: string): void {
    validateStringField(name, {
      minLength: 3,
      maxLength: 255,
      pattern: /^[A-Za-z0-9_.-]+$/,
      fieldName: 'Workload identity name',
      extraErrorInfo: 'must contain only letters, numbers, underscores, periods, and hyphens',
    });
  }

  export function validateApiKey(apiKey: string): void {
    validateStringField(apiKey, {
      minLength: 1,
      maxLength: 65536,
      fieldName: 'API key',
    });
  }

  export function validateClientId(clientId: string): void {
    validateStringField(clientId, {
      minLength: 1,
      maxLength: 256,
      fieldName: 'Client ID',
    });
  }

  export function validateClientSecret(clientSecret: string): void {
    validateStringField(clientSecret, {
      minLength: 1,
      maxLength: 2048,
      fieldName: 'Client secret',
    });
  }

  export function validateIdentityName(name: string, identityType: IdentityType): void {
    switch (identityType) {
      case IdentityType.OAUTH:
        validateOAuth2ProviderName(name);
        break;
      case IdentityType.API_KEY:
        validateApiKeyProviderName(name);
        break;
      default:
        throw new Error(`Unknown identity type: ${identityType}`);
    }
  }
}
