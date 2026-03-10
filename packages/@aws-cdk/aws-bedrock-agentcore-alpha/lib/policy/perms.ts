/**
 * IAM permissions for PolicyEngine and Policy operations.
 *
 * IMPORTANT: This module contains DATA PLANE (runtime) permissions only.
 *
 * Control plane operations (Create/Update/Delete) are performed by AWS CloudFormation
 * during `cdk deploy` and do not need to be granted to application runtime roles.
 *
 * When you run `cdk deploy`, CloudFormation uses its own service principal to create/update/delete
 * PolicyEngine and Policy resources. Your IAM user/role running `cdk deploy` needs control plane
 * permissions in their IAM policies, but these should NOT be granted through CDK construct grant methods.
 *
 * @see https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy-permissions.html
 */

/**
 * IAM permissions for PolicyEngine runtime operations (data plane)
 */
export namespace PolicyEnginePerms {
  /**
   * Runtime evaluation permissions (data plane).
   *
   * These permissions are required for evaluating authorization policies at runtime.
   * Grant these to Gateway execution roles that evaluate policies during agent requests.
   *
   * Usage: policyEngine.grantEvaluate(gatewayRole)
   */
  export const EVALUATE_PERMS = [
    'bedrock-agentcore:GetPolicyEngine',
    'bedrock-agentcore:AuthorizeAction',
    'bedrock-agentcore:PartiallyAuthorizeActions',
  ];

  /**
   * Read permissions (data plane).
   *
   * These permissions allow reading policy engine configuration at runtime.
   * Typically used for monitoring, observability, or read-only administrative tools.
   *
   */
  export const READ_PERMS = [
    'bedrock-agentcore:GetPolicyEngine',
  ];

  /**
   * Policy generation permissions (optional AI-powered feature).
   *
   * These permissions enable natural language to Cedar policy conversion.
   * This is an optional feature that allows generating Cedar policies from
   * natural language descriptions using AI.
   *
   * Only grant these to roles that need policy authoring capabilities.
   * This is NOT required for runtime policy evaluation.
   *
   * Actions:
   * - `bedrock-agentcore:StartPolicyGeneration` - Start a policy generation job
   * - `bedrock-agentcore:GetPolicyGeneration` - Get policy generation job status and results
   * - `bedrock-agentcore:ListPolicyGenerations` - List policy generation jobs
   * - `bedrock-agentcore:ListPolicyGenerationAssets` - List policy generation assets
   *
   * Usage: policyEngine.grantGeneratePolicy(authoringRole)
   */
  export const POLICY_GENERATION_PERMS = [
    'bedrock-agentcore:StartPolicyGeneration',
    'bedrock-agentcore:GetPolicyGeneration',
    'bedrock-agentcore:ListPolicyGenerations',
    'bedrock-agentcore:ListPolicyGenerationAssets',
  ];

  /**
   * KMS permissions for encrypted policy engines.
   *
   * NOTE: These permissions are automatically managed by AWS KMS grants when you specify
   * a KMS key for PolicyEngine encryption. You typically do NOT need to manually grant these.
   *
   * The BedrockAgentCore service automatically creates KMS grants with these permissions
   * when the policy engine is created with a customer-managed KMS key.
   *
   * Actions:
   * - `kms:CreateGrant` - Create KMS grants for service operations (automatically managed)
   * - `kms:Decrypt` - Decrypt policy data (automatically managed)
   * - `kms:GenerateDataKey` - Generate data keys for encryption (automatically managed)
   * - `kms:DescribeKey` - Read key metadata (automatically managed)
   *
   * @see https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy-encryption.html
   */
  export const KMS_PERMS = [
    'kms:CreateGrant',
    'kms:Decrypt',
    'kms:GenerateDataKey',
    'kms:DescribeKey',
  ];
}

/**
 * IAM permissions for Policy runtime operations (data plane)
 */
export namespace PolicyPerms {
  /**
   * Read permissions (data plane).
   *
   * These permissions allow reading policy configuration at runtime.
   * Grant these to monitoring or audit roles that need to inspect policy definitions.
   *
   * Actions:
   * - `bedrock-agentcore:GetPolicy` - Retrieve specific policy configuration and Cedar statement
   *
   * Note: `ListPolicies` is intentionally excluded as it's an administrative operation.
   * Applications should reference specific policies by ID/ARN, not list all policies.
   */
  export const READ_PERMS = [
    'bedrock-agentcore:GetPolicy',
  ];
}
