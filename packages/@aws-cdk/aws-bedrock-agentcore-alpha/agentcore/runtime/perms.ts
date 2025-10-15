/******************************************************************************
 *                         Data Plane Permissions
 *****************************************************************************/
/**
 * Permissions to invoke the agent runtime
 */
export const RUNTIME_INVOKE_PERMS = ['bedrock-agentcore:InvokeAgentRuntime'];

/**
 * Permissions to invoke the agent runtime on behalf of a user
 * Required when using the X-Amzn-Bedrock-AgentCore-Runtime-User-Id header
 */
export const RUNTIME_INVOKE_USER_PERMS = ['bedrock-agentcore:InvokeAgentRuntimeForUser'];

/******************************************************************************
 *                         Control Plane Permissions
 *****************************************************************************/
/**
 * Grants control plane operations to manage the runtime (CRUD)
 */
export const RUNTIME_ADMIN_PERMS = [
  'bedrock-agentcore:CreateAgentRuntime',
  'bedrock-agentcore:CreateAgentRuntimeEndpoint',
  'bedrock-agentcore:DeleteAgentRuntime',
  'bedrock-agentcore:DeleteAgentRuntimeEndpoint',
  'bedrock-agentcore:GetAgentRuntime',
  'bedrock-agentcore:GetAgentRuntimeEndpoint',
  'bedrock-agentcore:ListAgentRuntimes',
  'bedrock-agentcore:ListAgentRuntimeVersions',
  'bedrock-agentcore:ListAgentRuntimeEndpoints',
  'bedrock-agentcore:UpdateAgentRuntime',
  'bedrock-agentcore:UpdateAgentRuntimeEndpoint',
];

/******************************************************************************
 *                    Execution Role Permissions
 *****************************************************************************/

/**
 * ECR permissions for pulling container images
 * Used to download container images from ECR repositories
 */
export const RUNTIME_ECR_IMAGE_ACTIONS = [
  'ecr:BatchGetImage',
  'ecr:GetDownloadUrlForLayer',
];

/**
 * ECR authorization token permissions
 * Required to authenticate with ECR (must use * resource)
 */
export const RUNTIME_ECR_TOKEN_ACTIONS = ['ecr:GetAuthorizationToken'];

/**
 * CloudWatch Logs permissions for log group operations
 * Used to create and describe log groups for runtime logs
 */
export const RUNTIME_LOGS_GROUP_ACTIONS = [
  'logs:DescribeLogStreams',
  'logs:CreateLogGroup',
];

/**
 * CloudWatch Logs describe permissions
 * Used to list and describe all log groups
 */
export const RUNTIME_LOGS_DESCRIBE_ACTIONS = ['logs:DescribeLogGroups'];

/**
 * CloudWatch Logs permissions for log stream operations
 * Used to create log streams and write log events
 */
export const RUNTIME_LOGS_STREAM_ACTIONS = [
  'logs:CreateLogStream',
  'logs:PutLogEvents',
];

/**
 * X-Ray tracing permissions
 * Required for distributed tracing (must use * resource)
 */
export const RUNTIME_XRAY_ACTIONS = [
  'xray:PutTraceSegments',
  'xray:PutTelemetryRecords',
  'xray:GetSamplingRules',
  'xray:GetSamplingTargets',
];

/**
 * CloudWatch metrics permissions
 * Used to publish custom metrics
 */
export const RUNTIME_CLOUDWATCH_METRICS_ACTIONS = ['cloudwatch:PutMetricData'];

/**
 * Bedrock AgentCore workload identity permissions
 * Used to obtain access tokens for workload identity
 */
export const RUNTIME_WORKLOAD_IDENTITY_ACTIONS = [
  'bedrock-agentcore:GetWorkloadAccessToken',
  'bedrock-agentcore:GetWorkloadAccessTokenForJWT',
  'bedrock-agentcore:GetWorkloadAccessTokenForUserId',
];
/**
 * CloudWatch namespace for metrics
 * Used as a condition for CloudWatch metrics permissions
 */
export const RUNTIME_CLOUDWATCH_NAMESPACE = 'bedrock-agentcore';
