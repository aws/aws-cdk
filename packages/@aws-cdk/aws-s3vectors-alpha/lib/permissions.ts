/**
 * IAM actions for reading from vector buckets
 */
export const VECTOR_BUCKET_READ_ACCESS = [
  's3vectors:GetVectors',
  's3vectors:ListVectors',
  's3vectors:ListIndexes',
  's3vectors:GetIndex',
];

/**
 * IAM actions for writing to vector buckets
 */
export const VECTOR_BUCKET_WRITE_ACCESS = [
  's3vectors:PutVectors',
  's3vectors:DeleteVectors',
  's3vectors:CreateIndex',
  's3vectors:DeleteIndex',
];

/**
 * IAM actions for read/write access to vector buckets
 */
export const VECTOR_BUCKET_READ_WRITE_ACCESS = [...new Set([
  ...VECTOR_BUCKET_READ_ACCESS,
  ...VECTOR_BUCKET_WRITE_ACCESS,
])];

/**
 * IAM actions for reading from vector indexes
 */
export const INDEX_READ_ACCESS = [
  's3vectors:GetVectors',
  's3vectors:QueryVectors',
];

/**
 * IAM actions for writing to vector indexes
 */
export const INDEX_WRITE_ACCESS = [
  's3vectors:PutVectors',
  's3vectors:DeleteVectors',
];

/**
 * IAM actions for read/write access to vector indexes
 */
export const INDEX_READ_WRITE_ACCESS = [...new Set([
  ...INDEX_READ_ACCESS,
  ...INDEX_WRITE_ACCESS,
])];

/**
 * KMS actions required for reading encrypted vectors
 */
export const KEY_READ_ACCESS = ['kms:Decrypt'];

/**
 * KMS actions required for writing encrypted vectors
 */
export const KEY_WRITE_ACCESS = ['kms:Decrypt', 'kms:GenerateDataKey*'];

/**
 * KMS actions required for read/write access to encrypted vectors
 */
export const KEY_READ_WRITE_ACCESS = [...new Set([
  ...KEY_READ_ACCESS,
  ...KEY_WRITE_ACCESS,
])];
