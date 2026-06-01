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

import { Annotations, ArnFormat, Stack, Token } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import type { IConstruct } from 'constructs';

/**
 * Parent/collection resource ARN segments for Token Vault credential providers.
 *
 * Bedrock AgentCore uses a hierarchical authorization model where Get/List actions
 * require IAM permission on the parent and collection resources in addition to the
 * specific resource instance. For example, GetApiKeyCredentialProvider needs:
 *   - token-vault/default                             (vault)
 *   - token-vault/default/apikeycredentialprovider    (collection)
 *   - token-vault/default/apikeycredentialprovider/*  (instance)
 *
 * @internal
 * @deprecated Use the equivalent construct from `aws-cdk-lib/aws-bedrockagentcore` instead.
 */
export const TOKEN_VAULT_API_KEY_PARENT_RESOURCES = [
  'token-vault/default',
  'token-vault/default/apikeycredentialprovider',
] as const;

/**
 * @internal
 * @deprecated Use the equivalent construct from `aws-cdk-lib/aws-bedrockagentcore` instead.
 */
export const TOKEN_VAULT_OAUTH2_PARENT_RESOURCES = [
  'token-vault/default',
  'token-vault/default/oauth2credentialprovider',
] as const;

/**
 * @internal
 * @deprecated Use the equivalent construct from `aws-cdk-lib/aws-bedrockagentcore` instead.
 */
export const WORKLOAD_IDENTITY_PARENT_RESOURCES = [
  'workload-identity-directory/default',
  'workload-identity-directory/default/workload-identity',
] as const;

/**
 * Workload identity resource ARN segments required by data-plane actions
 * (GetResourceApiKey, GetResourceOauth2Token, CompleteResourceTokenAuth).
 *
 * These actions require both the workload identity directory and a wildcard
 * over workload identities because the specific identity is created dynamically
 * by the gateway/service at runtime.
 *
 * @internal
 * @deprecated Use the equivalent construct from `aws-cdk-lib/aws-bedrockagentcore` instead.
 */
export const WORKLOAD_IDENTITY_USE_RESOURCES = [
  'workload-identity-directory/default',
  'workload-identity-directory/default/workload-identity/*',
] as const;

/**
 * Build the full set of resource ARNs for an identity grant: the instance ARN
 * plus all parent/collection ARNs that the service's authorization model requires.
 *
 * @internal
 * @deprecated Use the equivalent construct from `aws-cdk-lib/aws-bedrockagentcore` instead.
 */
export function buildIdentityResourceArns(
  scope: IConstruct,
  instanceArn: string,
  parentResources: readonly string[],
): string[] {
  const stack = Stack.of(scope);
  const parentArns = parentResources.map(resource =>
    stack.formatArn({
      service: 'bedrock-agentcore',
      resource,
      arnFormat: ArnFormat.NO_RESOURCE_NAME,
    }),
  );
  return [instanceArn, ...parentArns];
}

/**
 * Grant read and list permissions on a specific identity resource, including
 * parent/collection ARNs required by the Bedrock AgentCore authorization model.
 *
 * @internal
 * @deprecated Use the equivalent construct from `aws-cdk-lib/aws-bedrockagentcore` instead.
 */
export function grantReadWithList(
  scope: IConstruct,
  grantee: iam.IGrantable,
  resourceArn: string,
  resourceReadActions: string[],
  listActions: string[],
  parentResources: readonly string[],
): iam.Grant {
  return iam.Grant.addToPrincipal({
    grantee,
    actions: [...resourceReadActions, ...listActions],
    resourceArns: buildIdentityResourceArns(scope, resourceArn, parentResources),
    scope,
  });
}

/**
 * Grants Secrets Manager actions on the credential secret when an ARN is available
 * (e.g. not omitted on import). Used for both read (GetSecretValue) and write
 * (PutSecretValue) grants.
 *
 * The CFN attribute for the secret ARN (e.g. `attrApiKeySecretArn`) resolves to an
 * object `{ SecretArn: string }` at deploy time, not a plain string, so the Token
 * cannot be placed directly in IAM Resource fields. When the secret ARN is unresolved
 * (Token), we fall back to a service-managed prefix wildcard. When a literal ARN is
 * supplied (e.g. via `fromApiKeyCredentialProviderAttributes`), we scope tightly.
 *
 * @internal
 * @deprecated Use the equivalent construct from `aws-cdk-lib/aws-bedrockagentcore` instead.
 */
export function grantCredentialSecret(
  scope: IConstruct,
  grantee: iam.IGrantable,
  secretArn: string | undefined,
  secretActions: string[],
): iam.Grant | undefined {
  if (secretArn == null || secretArn === '') {
    return undefined;
  }
  let secretResourceArns: string[];
  if (Token.isUnresolved(secretArn)) {
    Annotations.of(scope).addWarningV2(
      '@aws-cdk/aws-bedrock-agentcore-alpha:wildcardSecretArnGrant',
      'The secret ARN is an unresolved token. Granting access using a wildcard prefix (bedrock-agentcore-identity!*). ' +
      'To scope the grant to a specific secret, import the credential provider with an explicit secretArn.',
    );
    secretResourceArns = [Stack.of(scope).formatArn({
      service: 'secretsmanager',
      resource: 'secret',
      resourceName: 'bedrock-agentcore-identity!*',
      arnFormat: ArnFormat.COLON_RESOURCE_NAME,
    })];
  } else {
    secretResourceArns = [secretArn];
  }
  return iam.Grant.addToPrincipal({
    grantee,
    actions: secretActions,
    resourceArns: secretResourceArns,
    scope,
  });
}
