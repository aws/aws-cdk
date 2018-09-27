export const BUCKET_READ_ACTIONS = [
  's3:GetObject*',
  's3:GetBucket*',
  's3:List*',
];

export const BUCKET_PUT_ACTIONS = [
  's3:PutObject*',
  's3:Abort*'
];

export const BUCKET_DELETE_ACTIONS = [
  's3:DeleteObject*'
];

export const BUCKET_WRITE_ACTIONS = [
  ...BUCKET_DELETE_ACTIONS,
  ...BUCKET_PUT_ACTIONS
];

export const KEY_READ_ACTIONS = [
  'kms:Decrypt',
  'kms:DescribeKey',
];

export const KEY_WRITE_ACTIONS = [
  'kms:Encrypt',
  'kms:ReEncrypt*',
  'kms:GenerateDataKey*',
];
