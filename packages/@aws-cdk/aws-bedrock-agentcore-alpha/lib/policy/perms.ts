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
 *
 * TODO: When this package graduates from alpha and is moved into aws-cdk-lib (and renamed from
 * `aws-bedrock-agentcore-alpha` to `aws-bedrockagentcore` to align with the L1 module name),
 * replace this file with an auto-generated grants class following the CDK Design Guidelines:
 * @see https://github.com/aws/aws-cdk/blob/main/docs/DESIGN_GUIDELINES.md#grants
 * This requires creating a `grants.json` file at the package root, after which the tooling
 * will auto-generate the `*Grants` class on every `yarn build`.
 */

/**
 * Runtime evaluation permissions for PolicyEngine (data plane).
 *
 * These permissions are required for evaluating authorization policies at runtime.
 * Grant these to Gateway execution roles that evaluate policies during agent requests.
 *
 * Usage: policyEngine.grantEvaluate(gatewayRole)
 */
export const POLICY_ENGINE_EVALUATE_PERMS = [
  'bedrock-agentcore:GetPolicyEngine',
  'bedrock-agentcore:AuthorizeAction',
  'bedrock-agentcore:PartiallyAuthorizeActions',
];

/**
 * Read permissions for PolicyEngine (data plane).
 *
 * These permissions allow reading policy engine configuration at runtime.
 * Typically used for monitoring, observability, or read-only administrative tools.
 */
export const POLICY_ENGINE_READ_PERMS = [
  'bedrock-agentcore:GetPolicyEngine',
];

/**
 * Read permissions for Policy (data plane).
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
export const POLICY_READ_PERMS = [
  'bedrock-agentcore:GetPolicy',
];
