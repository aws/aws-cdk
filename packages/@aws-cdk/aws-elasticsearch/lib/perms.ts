export const ES_READ_ACTIONS = [
  'es:ESHttpGet',
  'es:ESHttpHead',
];

export const ES_WRITE_ACTIONS = [
  'es:ESHttpDelete',
  'es:ESHttpPost',
  'es:ESHttpPut',
  'es:ESHttpPatch',
];

export const ES_READ_WRITE_ACTIONS = [
  ...ES_READ_ACTIONS,
  ...ES_WRITE_ACTIONS,
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

export const KEY_READ_WRITE_ACTIONS = [
  ...KEY_READ_ACTIONS,
  ...KEY_WRITE_ACTIONS,
];
