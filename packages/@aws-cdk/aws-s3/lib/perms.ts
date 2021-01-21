export const BUCKET_READ_ACTIONS = [
  's3:GetObject*',
  's3:GetBucket*',
  's3:List*',
];

export const LEGACY_BUCKET_PUT_ACTIONS = [
  's3:PutObject*',
  's3:Abort*',
];

export const BUCKET_PUT_ACTIONS = [
  's3:PutObject',
  's3:Abort*',
];

export const BUCKET_PUT_ACL_ACTIONS = [
  's3:PutObjectAcl',
];

export const BUCKET_DELETE_ACTIONS = [
  's3:DeleteObject*',
];

export const KEY_READ_ACTIONS = [
  'kms:Decrypt',
  'kms:DescribeKey',
];

export const KEY_WRITE_ACTIONS = [
  'kms:Encrypt',
  'kms:ReEncrypt*',
  'kms:GenerateDataKey*',
  'kms:Decrypt', // required for multipart uploads. Refer https://aws.amazon.com/premiumsupport/knowledge-center/s3-multipart-kms-decrypt/
];
