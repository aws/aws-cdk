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