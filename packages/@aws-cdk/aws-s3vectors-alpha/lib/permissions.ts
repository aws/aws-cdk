// =============================================================================
// VectorBucket Resource Actions
// Resource ARN: arn:aws:s3vectors:region:account:bucket/bucket-name
// =============================================================================

/**
 * IAM actions for reading from vector buckets (VectorBucket resource type)
 * @see https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-vectors-access-management.html
 */
export const VECTOR_BUCKET_READ_ACCESS = [
  's3vectors:ListIndexes',
];

/**
 * IAM actions for writing to vector buckets (VectorBucket resource type)
 * @see https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-vectors-access-management.html
 */
export const VECTOR_BUCKET_WRITE_ACCESS: string[] = [];

/**
 * IAM actions for read/write access to vector buckets (VectorBucket resource type)
 */
export const VECTOR_BUCKET_READ_WRITE_ACCESS = [...new Set([
  ...VECTOR_BUCKET_READ_ACCESS,
  ...VECTOR_BUCKET_WRITE_ACCESS,
])];

// =============================================================================
// Index Resource Actions
// Resource ARN: arn:aws:s3vectors:region:account:bucket/bucket-name/index/index-name
// =============================================================================

/**
 * IAM actions for reading from vector indexes (Index resource type)
 * @see https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-vectors-access-management.html
 */
export const INDEX_READ_ACCESS = [
  's3vectors:GetIndex',
  's3vectors:GetVectors',
  's3vectors:ListVectors',
  's3vectors:QueryVectors',
];

/**
 * IAM actions for writing to vector indexes (Index resource type)
 * @see https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-vectors-access-management.html
 */
export const INDEX_WRITE_ACCESS = [
  's3vectors:CreateIndex',
  's3vectors:DeleteIndex',
  's3vectors:PutVectors',
  's3vectors:DeleteVectors',
];

/**
 * IAM actions for read/write access to vector indexes (Index resource type)
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
