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
 * @deprecated Use the equivalent construct from `aws-cdk-lib/aws-bedrockagentcore` instead.
 */
export const TOKEN_VAULT_CREDENTIAL_SECRET_READ_PERMS = [
  'secretsmanager:GetSecretValue',
  'secretsmanager:DescribeSecret',
] as const;

/**
 * Secrets Manager actions to write credential material for Token Vault providers.
 *
 * Create and Update control plane operations (e.g. CreateApiKeyCredentialProvider,
 * UpdateApiKeyCredentialProvider) store/update the credential in Secrets Manager,
 * requiring PutSecretValue on the backing secret.
 * @deprecated Use the equivalent construct from `aws-cdk-lib/aws-bedrockagentcore` instead.
 */
export const TOKEN_VAULT_CREDENTIAL_SECRET_WRITE_PERMS = [
  'secretsmanager:PutSecretValue',
] as const;

/**
 * IAM actions for AgentCore API key credential providers (Token Vault).
 *
 * @see https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazonbedrockagentcore.html
 * @deprecated Use the equivalent construct from `aws-cdk-lib/aws-bedrockagentcore` instead.
 */
export class ApiKeyCredentialProviderIdentityPerms {
  /**
   * Read a single API key credential provider definition.
   */
  public static readonly READ_PERMS: string[] = ['bedrock-agentcore:GetApiKeyCredentialProvider'];

  /**
   * List API key credential providers (resource-scoped per IAM service authorization reference).
   */
  public static readonly LIST_PERMS: string[] = ['bedrock-agentcore:ListApiKeyCredentialProviders'];

  /**
   * Control plane permissions to create, read, update, and delete this provider.
   */
  public static readonly ADMIN_PERMS: string[] = [
    'bedrock-agentcore:CreateApiKeyCredentialProvider',
    'bedrock-agentcore:GetApiKeyCredentialProvider',
    'bedrock-agentcore:UpdateApiKeyCredentialProvider',
    'bedrock-agentcore:DeleteApiKeyCredentialProvider',
  ];

  /**
   * Data plane permissions to retrieve the API key material for outbound calls.
   */
  public static readonly USE_PERMS: string[] = ['bedrock-agentcore:GetResourceApiKey'];

  /**
   * All API key credential provider actions used by the L2 grant helpers.
   */
  public static readonly FULL_ACCESS_PERMS: string[] = [
    ...new Set([
      ...ApiKeyCredentialProviderIdentityPerms.READ_PERMS,
      ...ApiKeyCredentialProviderIdentityPerms.LIST_PERMS,
      ...ApiKeyCredentialProviderIdentityPerms.ADMIN_PERMS,
      ...ApiKeyCredentialProviderIdentityPerms.USE_PERMS,
    ]),
  ];

  private constructor() {}
}

/**
 * IAM actions for AgentCore OAuth2 credential providers (Token Vault).
 *
 * @see https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazonbedrockagentcore.html
 * @deprecated Use the equivalent construct from `aws-cdk-lib/aws-bedrockagentcore` instead.
 */
export class OAuth2CredentialProviderIdentityPerms {
  /**
   * Read a single OAuth2 credential provider definition.
   */
  public static readonly READ_PERMS: string[] = ['bedrock-agentcore:GetOauth2CredentialProvider'];

  /**
   * List OAuth2 credential providers (resource-scoped per IAM service authorization reference).
   */
  public static readonly LIST_PERMS: string[] = ['bedrock-agentcore:ListOauth2CredentialProviders'];

  /**
   * Control plane permissions to create, read, update, and delete this provider.
   */
  public static readonly ADMIN_PERMS: string[] = [
    'bedrock-agentcore:CreateOauth2CredentialProvider',
    'bedrock-agentcore:GetOauth2CredentialProvider',
    'bedrock-agentcore:UpdateOauth2CredentialProvider',
    'bedrock-agentcore:DeleteOauth2CredentialProvider',
  ];

  /**
   * Data plane permissions to complete OAuth flows and retrieve tokens for outbound calls.
   */
  public static readonly USE_PERMS: string[] = [
    'bedrock-agentcore:GetResourceOauth2Token',
    'bedrock-agentcore:CompleteResourceTokenAuth',
  ];

  /**
   * All OAuth2 credential provider actions used by the L2 grant helpers.
   */
  public static readonly FULL_ACCESS_PERMS: string[] = [
    ...new Set([
      ...OAuth2CredentialProviderIdentityPerms.READ_PERMS,
      ...OAuth2CredentialProviderIdentityPerms.LIST_PERMS,
      ...OAuth2CredentialProviderIdentityPerms.ADMIN_PERMS,
      ...OAuth2CredentialProviderIdentityPerms.USE_PERMS,
    ]),
  ];

  private constructor() {}
}

/**
 * IAM actions for AgentCore workload identities.
 *
 * @see https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazonbedrockagentcore.html
 * @deprecated Use the equivalent construct from `aws-cdk-lib/aws-bedrockagentcore` instead.
 */
export class WorkloadIdentityPerms {
  /**
   * Read a single workload identity.
   */
  public static readonly READ_PERMS: string[] = ['bedrock-agentcore:GetWorkloadIdentity'];

  /**
   * List workload identities (resource-scoped per IAM service authorization reference).
   */
  public static readonly LIST_PERMS: string[] = ['bedrock-agentcore:ListWorkloadIdentities'];

  /**
   * Control plane permissions to create, read, update, and delete this workload identity.
   */
  public static readonly ADMIN_PERMS: string[] = [
    'bedrock-agentcore:CreateWorkloadIdentity',
    'bedrock-agentcore:GetWorkloadIdentity',
    'bedrock-agentcore:UpdateWorkloadIdentity',
    'bedrock-agentcore:DeleteWorkloadIdentity',
  ];

  /**
   * Data plane permissions to mint workload access tokens.
   *
   * These actions require both the workload identity ARN and the
   * workload-identity-directory ARN as resource scope.
   *
   * @see https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazonbedrockagentcore.html
   */
  public static readonly USE_PERMS: string[] = [
    'bedrock-agentcore:GetWorkloadAccessToken',
    'bedrock-agentcore:GetWorkloadAccessTokenForJWT',
    'bedrock-agentcore:GetWorkloadAccessTokenForUserId',
  ];

  /**
   * All workload identity actions used by the L2 grant helpers.
   */
  public static readonly FULL_ACCESS_PERMS: string[] = [
    ...new Set([
      ...WorkloadIdentityPerms.READ_PERMS,
      ...WorkloadIdentityPerms.LIST_PERMS,
      ...WorkloadIdentityPerms.ADMIN_PERMS,
      ...WorkloadIdentityPerms.USE_PERMS,
    ]),
  ];

  private constructor() {}
}
