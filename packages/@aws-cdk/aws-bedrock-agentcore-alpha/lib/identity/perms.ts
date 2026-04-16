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

/**
 * Secrets Manager actions to read credential material stored for Token Vault providers.
 *
 * Outbound gateway targets apply the same actions on the secret ARN; principals that call
 * `GetResourceApiKey` / `GetResourceOauth2Token` (or that mirror gateway behavior) typically need both
 * `bedrock-agentcore` data-plane actions and read access to the backing secret.
 *
 * @see https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/security-iam-awsmanpol.html
 */
export const TOKEN_VAULT_CREDENTIAL_SECRET_READ_PERMS = [
  'secretsmanager:GetSecretValue',
  'secretsmanager:DescribeSecret',
] as const;

/**
 * IAM actions for AgentCore API key credential providers (Token Vault).
 *
 * @see https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazonbedrockagentcore.html
 */
export namespace ApiKeyCredentialProviderIdentityPerms {
  /**
   * Read a single API key credential provider definition.
   */
  export const READ_PERMS = ['bedrock-agentcore:GetApiKeyCredentialProvider'];

  /**
   * List API key credential providers in the account (not scoped to a single provider ARN).
   */
  export const LIST_PERMS = ['bedrock-agentcore:ListApiKeyCredentialProviders'];

  /**
   * Control plane permissions to create, read, update, and delete this provider.
   */
  export const ADMIN_PERMS = [
    'bedrock-agentcore:CreateApiKeyCredentialProvider',
    'bedrock-agentcore:GetApiKeyCredentialProvider',
    'bedrock-agentcore:UpdateApiKeyCredentialProvider',
    'bedrock-agentcore:DeleteApiKeyCredentialProvider',
  ];

  /**
   * Data plane permissions to retrieve the API key material for outbound calls.
   */
  export const USE_PERMS = ['bedrock-agentcore:GetResourceApiKey'];

  /**
   * All API key credential provider actions used by the L2 grant helpers.
   */
  export const FULL_ACCESS_PERMS = [...new Set([...READ_PERMS, ...LIST_PERMS, ...ADMIN_PERMS, ...USE_PERMS])];
}

/**
 * IAM actions for AgentCore OAuth2 credential providers (Token Vault).
 *
 * @see https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazonbedrockagentcore.html
 */
export namespace OAuth2CredentialProviderIdentityPerms {
  /**
   * Read a single OAuth2 credential provider definition.
   */
  export const READ_PERMS = ['bedrock-agentcore:GetOauth2CredentialProvider'];

  /**
   * List OAuth2 credential providers in the account (not scoped to a single provider ARN).
   */
  export const LIST_PERMS = ['bedrock-agentcore:ListOauth2CredentialProviders'];

  /**
   * Control plane permissions to create, read, update, and delete this provider.
   */
  export const ADMIN_PERMS = [
    'bedrock-agentcore:CreateOauth2CredentialProvider',
    'bedrock-agentcore:GetOauth2CredentialProvider',
    'bedrock-agentcore:UpdateOauth2CredentialProvider',
    'bedrock-agentcore:DeleteOauth2CredentialProvider',
  ];

  /**
   * Data plane permissions to complete OAuth flows and retrieve tokens for outbound calls.
   */
  export const USE_PERMS = [
    'bedrock-agentcore:GetResourceOauth2Token',
    'bedrock-agentcore:CompleteResourceTokenAuth',
  ];

  /**
   * All OAuth2 credential provider actions used by the L2 grant helpers.
   */
  export const FULL_ACCESS_PERMS = [...new Set([...READ_PERMS, ...LIST_PERMS, ...ADMIN_PERMS, ...USE_PERMS])];
}
