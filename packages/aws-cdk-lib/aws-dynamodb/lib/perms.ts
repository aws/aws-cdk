export const READ_DATA_ACTIONS = [
  'dynamodb:BatchGetItem',
  'dynamodb:GetRecords',
  'dynamodb:GetShardIterator',
  'dynamodb:Query',
  'dynamodb:GetItem',
  'dynamodb:Scan',
  'dynamodb:ConditionCheckItem',
];
export const KEY_READ_ACTIONS = [
  'kms:Decrypt',
  'kms:DescribeKey',
];

export const WRITE_DATA_ACTIONS = [
  'dynamodb:BatchWriteItem',
  'dynamodb:PutItem',
  'dynamodb:UpdateItem',
  'dynamodb:DeleteItem',
];
export const KEY_WRITE_ACTIONS = [
  'kms:Encrypt',
  'kms:ReEncrypt*',
  'kms:GenerateDataKey*',
];

export const READ_STREAM_DATA_ACTIONS = [
  'dynamodb:DescribeStream',
  'dynamodb:GetRecords',
  'dynamodb:GetShardIterator',
];

export const DESCRIBE_TABLE = 'dynamodb:DescribeTable';

/**
 * Actions that are supported in DynamoDB resource policies.
 *
 * DynamoDB resource policies only support data plane operations on table resources.
 * The following are NOT supported and will cause CloudFormation deployment failures:
 * - Stream operations (GetRecords, GetShardIterator) - these apply to stream ARNs, not table ARNs
 * - Control plane operations (DescribeTable) - not supported in resource policies
 *
 * This whitelist ensures only valid actions are included in resource policies for cross-account grants.
 */
export const RESOURCE_POLICY_ACTIONS = [
  'dynamodb:BatchGetItem',
  'dynamodb:GetItem',
  'dynamodb:Query',
  'dynamodb:Scan',
  'dynamodb:BatchWriteItem',
  'dynamodb:PutItem',
  'dynamodb:UpdateItem',
  'dynamodb:DeleteItem',
  'dynamodb:ConditionCheckItem',
];
