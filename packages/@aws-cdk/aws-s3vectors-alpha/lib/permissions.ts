// Action names are taken from the Service Authorization Reference for Amazon S3 Vectors:
// https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazons3vectors.html

// Vector Bucket read privileges
export const VECTOR_BUCKET_READ_ACCESS = [
  's3vectors:GetVectorBucket',
  's3vectors:GetVectorBucketPolicy',
  's3vectors:ListIndexes',
  's3vectors:ListTagsForResource',
];

// Vector Bucket write privileges
export const VECTOR_BUCKET_WRITE_ACCESS = [
  's3vectors:CreateIndex',
  's3vectors:DeleteIndex',
];

export const VECTOR_BUCKET_READ_WRITE_ACCESS = [...new Set([
  ...VECTOR_BUCKET_READ_ACCESS,
  ...VECTOR_BUCKET_WRITE_ACCESS,
])];

// Vector Index read privileges (data plane)
export const VECTOR_INDEX_READ_ACCESS = [
  's3vectors:GetIndex',
  's3vectors:GetVectors',
  's3vectors:ListVectors',
  's3vectors:QueryVectors',
  's3vectors:ListTagsForResource',
];

// Vector Index write privileges (data plane)
export const VECTOR_INDEX_WRITE_ACCESS = [
  's3vectors:PutVectors',
  's3vectors:DeleteVectors',
];

export const VECTOR_INDEX_READ_WRITE_ACCESS = [...new Set([
  ...VECTOR_INDEX_READ_ACCESS,
  ...VECTOR_INDEX_WRITE_ACCESS,
])];

// Permissions for customer-managed KMS keys used by S3 Vectors.
// https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-vectors-kms-permissions.html
export const KEY_READ_ACCESS = [
  'kms:Decrypt',
];

export const KEY_WRITE_ACCESS = [
  'kms:Decrypt',
  'kms:GenerateDataKey*',
];

export const KEY_READ_WRITE_ACCESS = [...new Set([
  ...KEY_READ_ACCESS,
  ...KEY_WRITE_ACCESS,
])];
