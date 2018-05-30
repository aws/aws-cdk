export const BUCKET_READ_ACTIONS = [
    's3:GetObject*',
    's3:GetBucket*',
    's3:List*',
];

export const BUCKET_WRITE_ACTIONS = [
    's3:PutObject*',
    's3:DeleteObject*',
    's3:Abort*'
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
