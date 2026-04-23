// Table Bucket
// Read priveleges
export const TABLE_BUCKET_READ_ACCESS = [
  's3tables:Get*',
  's3tables:ListNamespaces',
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

// Replication
// https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-tables-replication-permissions.html

// Source-side table bucket actions (bucket scope: arn:...:bucket/<name>)
export const REPLICATION_SOURCE_BUCKET_ACCESS = [
  's3tables:ListTables',
];

// Source-side table actions (table scope: arn:...:bucket/<name>/table/*)
export const REPLICATION_SOURCE_TABLE_ACCESS = [
  's3tables:GetTable',
  's3tables:GetTableMetadataLocation',
  's3tables:GetTableMaintenanceConfiguration',
  's3tables:GetTableData',
];

// Destination-side table bucket actions (bucket scope)
export const REPLICATION_DESTINATION_BUCKET_ACCESS = [
  's3tables:CreateNamespace',
  's3tables:CreateTable',
];

// Destination-side table actions (table scope)
export const REPLICATION_DESTINATION_TABLE_ACCESS = [
  's3tables:GetTableData',
  's3tables:PutTableData',
  's3tables:UpdateTableMetadataLocation',
  's3tables:PutTableMaintenanceConfiguration',
];

// KMS: source key (per S3 Tables replication permissions doc)
export const REPLICATION_KEY_SOURCE_ACCESS = [
  'kms:Decrypt',
  'kms:GenerateDataKey',
  'kms:Encrypt',
];

// KMS: destination key (per S3 Tables replication permissions doc)
export const REPLICATION_KEY_DESTINATION_ACCESS = [
  'kms:Decrypt',
  'kms:GenerateDataKey',
];
