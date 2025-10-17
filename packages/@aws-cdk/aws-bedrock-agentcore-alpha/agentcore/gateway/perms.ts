export namespace GatewayPerms {
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

  export const KMS_KEY_PERMS = [
    'kms:GenerateDataKey',
    'kms:Decrypt',
    'kms:Encrypt',
  ];
  export const READ_PERMS = [...new Set([...GET_PERMS, ...LIST_PERMS])];
  export const MANAGE_PERMS = [...new Set([...CREATE_PERMS, ...UPDATE_PERMS, ...DELETE_PERMS])];
}
