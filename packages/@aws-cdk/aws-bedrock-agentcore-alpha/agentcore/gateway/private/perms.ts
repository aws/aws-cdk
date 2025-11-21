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
   * KMS permissions for encryption
   * Required when using KMS keys for encryption
   */
  export const KMS_KEY_PERMS = [
    'kms:GenerateDataKey',
    'kms:GenerateDataKeyWithoutPlaintext',
    'kms:GenerateDataKeyPair',
    'kms:GenerateDataKeyPairWithoutPlaintext',
    'kms:Decrypt',
    'kms:Encrypt',
    'kms:ReEncryptFrom',
    'kms:ReEncryptTo',
    'kms:CreateGrant',
    'kms:DescribeKey',
  ];

  /**
   * Assume role permission
   * Required for the gateway service to assume the execution role
   */
  export const ASSUME_ROLE = ['sts:AssumeRole'];

  /**
   * Outbound auth - Workload identity permissions
   * Used to obtain access tokens for workload identity
   */
  export const GATEWAY_WORKLOAD_IDENTITY_PERMS = [
    'bedrock-agentcore:GetWorkloadAccessToken',
  ];

  /**
   * Outbound auth - OAuth permissions
   * Used to obtain OAuth tokens for target authentication
   */
  export const GATEWAY_OAUTH_PERMS = [
    'bedrock-agentcore:GetResourceOauth2Token',
  ];

  /**
   * Outbound auth - API Key permissions
   * Used to retrieve API keys for target authentication
   */
  export const GATEWAY_API_KEY_PERMS = [
    'bedrock-agentcore:GetResourceApiKey',
  ];

  /**
   * Secrets Manager permissions
   * Required for storing and retrieving API keys and OAuth credentials
   */
  export const SECRETS_PERMS = [
    'secretsmanager:GetSecretValue',
    'secretsmanager:DescribeSecret',
  ];

  /******************************************************************************
   * Control Plane Permissions
   *****************************************************************************/

  /**
   * Get permissions for gateway resources
   */
  export const GET_PERMS = ['bedrock-agentcore:GetGatewayTarget', 'bedrock-agentcore:GetGateway'];

  /**
   * List permissions for gateway resources
   */
  export const LIST_PERMS = [
    'bedrock-agentcore:ListGateways',
    'bedrock-agentcore:ListGatewayTargets',
  ];

  /**
   * Create permissions for gateway resources
   */
  export const CREATE_PERMS = [
    'bedrock-agentcore:CreateGateway',
    'bedrock-agentcore:CreateGatewayTarget',
  ];

  /**
   * Update permissions for gateway resources
   */
  export const UPDATE_PERMS = [
    'bedrock-agentcore:UpdateGateway',
    'bedrock-agentcore:UpdateGatewayTarget',
  ];

  /**
   * Delete permissions for gateway resources
   */
  export const DELETE_PERMS = [
    'bedrock-agentcore:DeleteGateway',
    'bedrock-agentcore:DeleteGatewayTarget',
  ];

  /**
   * Combined manage permissions (create, update, delete)
   */
  export const MANAGE_PERMS = [...new Set([...CREATE_PERMS, ...UPDATE_PERMS, ...DELETE_PERMS])];

  /**
   * Synchronization permissions for MCP server targets
   * Used to refresh tool catalogs when MCP server tools change
   */
  export const SYNC_PERMS = ['bedrock-agentcore:SynchronizeGatewayTargets'];
}
