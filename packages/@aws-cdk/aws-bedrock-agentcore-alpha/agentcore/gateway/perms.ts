export namespace GatewayPerms {

  /******************************************************************************
 * Data Plane Permissions
 *****************************************************************************/

  /**
   * Permissions to invoke the gateway
   * Used by agents or other services that need to call the gateway
   */
  export const INVOKE_PERMS = ['bedrock-agentcore:InvokeGateway'];

  /******************************************************************************
   * Execution Role Permissions
   *****************************************************************************/

  /**
   * Gateway service role permissions
   * Used by the Gateway to manage its own resources and invoke targets
   */
  export const SERVICE_ROLE_PERMS = [
    'bedrock-agentcore:*Gateway*',
    'bedrock-agentcore:*GatewayTarget*',
  ];

  /**
   * Workload identity permissions
   * Used to manage authentication identities for gateway access
   */
  export const WORKLOAD_IDENTITY_PERMS = [
    'bedrock-agentcore:*WorkloadIdentity',
  ];

  /**
   * Credential provider permissions
   * Used to manage credential configurations for outbound auth
   */
  export const CREDENTIAL_PROVIDER_PERMS = [
    'bedrock-agentcore:*CredentialProvider',
  ];

  /**
   * Token management permissions
   * Used for JWT token operations
   */
  export const TOKEN_PERMS = [
    'bedrock-agentcore:*Token*',
  ];

  /**
   * Access control permissions
   * Used to manage who can access the gateway
   */
  export const ACCESS_PERMS = [
    'bedrock-agentcore:*Access*',
  ];

  /**
   * Lambda target permissions
   * Required when Gateway invokes Lambda functions
   */
  export const LAMBDA_INVOKE_PERMS = ['lambda:InvokeFunction'];

  /**
   * KMS permissions for encryption
   * Required when using KMS keys for encryption
   */
  export const KMS_KEY_PERMS = [
    'kms:GenerateDataKey',
    'kms:Decrypt',
    'kms:Encrypt',
    'kms:GenerateDataKey*',
    'kms:ReEncrypt*',
    'kms:CreateGrant',
    'kms:DescribeKey',
  ];

  /**
   * Assume role
   */
  export const ASSUME_ROLE = ['sts:AssumeRole'];

  // Outbound auth permissions
  export const GATEWAY_WORKLOAD_IDENTITY_PERMS = [
    'bedrock-agentcore:GetWorkloadAccessToken',
  ];

  export const GATEWAY_OAUTH_PERMS = [
    'bedrock-agentcore:GetResourceOauth2Token',
  ];

  export const GATEWAY_API_KEY_PERMS = [
    'bedrock-agentcore:GetResourceApiKey',
  ];

  /**
   * S3 permissions for schema storage
   * Required when schemas are stored in S3
   */
  export const S3_SCHEMA_PERMS = [
    's3:GetObject',
    's3:PutObject',
  ];

  /**
   * Secrets Manager permissions
   * Required for storing and retrieving API keys and OAuth credentials
   */
  export const SECRETS_PERMS = [
    'secretsmanager:GetSecretValue',
    'secretsmanager:DescribeSecret',
  ];

  /**
   * CloudWatch Logs permissions for gateway logs
   */
  export const LOGS_PERMS = [
    'logs:CreateLogGroup',
    'logs:CreateLogStream',
    'logs:PutLogEvents',
  ];

  export const GET_PERMS = ['bedrock-agentcore:GetGatewayTarget', 'bedrock-agentcore:GetGateway'];
  export const LIST_PERMS = [
    'bedrock-agentcore:ListGateways',
    'bedrock-agentcore:ListGatewayTargets',
  ];

  export const CREATE_PERMS = [
    'bedrock-agentcore:CreateGateway',
    'bedrock-agentcore:CreateGatewayTarget',
  ];
  export const UPDATE_PERMS = [
    'bedrock-agentcore:UpdateGateway',
    'bedrock-agentcore:UpdateGatewayTarget',
  ];
  export const DELETE_PERMS = [
    'bedrock-agentcore:DeleteGateway',
    'bedrock-agentcore:DeleteGatewayTarget',
  ];

  export const READ_PERMS = [...new Set([...GET_PERMS, ...LIST_PERMS])];
  export const MANAGE_PERMS = [...new Set([...CREATE_PERMS, ...UPDATE_PERMS, ...DELETE_PERMS])];

  /**
   * Synchronization permissions for MCP server targets
   * Used to refresh tool catalogs when MCP server tools change
   */
  export const SYNC_PERMS = ['bedrock-agentcore:SynchronizeGatewayTargets'];
}
