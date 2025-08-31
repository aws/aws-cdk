// Table Bucket
// Read priveleges
export const TABLE_BUCKET_READ_ACCESS = [
  's3tables:Get*',
  's3tables:ListNamespace',
  's3tables:ListTables',
];

// Write priveleges
export const TABLE_BUCKET_WRITE_ACCESS = [
  's3tables:PutTableData',
  's3tables:UpdateTableMetadataLocation',
  's3tables:CreateNamespace',
  's3tables:DeleteNamespace',
  's3tables:PutTableBucketMaintenanceConfiguration',
  's3tables:CreateTable',
  's3tables:RenameTable',
];

export const TABLE_BUCKET_READ_WRITE_ACCESS = [...new Set([
  ...TABLE_BUCKET_READ_ACCESS,
  ...TABLE_BUCKET_WRITE_ACCESS,
])];

// Table
// Read priveleges
export const TABLE_READ_ACCESS = [
  's3tables:Get*',
];
// Write priveleges
export const TABLE_WRITE_ACCESS = [
  's3tables:PutTableData',
  's3tables:UpdateTableMetadataLocation',
  's3tables:RenameTable',
];
export const TABLE_READ_WRITE_ACCESS = [...new Set([
  ...TABLE_READ_ACCESS,
  ...TABLE_WRITE_ACCESS,
])];

// Permissions for user defined KMS Keys
// https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-tables-kms-permissions.html
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
