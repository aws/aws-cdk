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
