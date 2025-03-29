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
];

// Full access
export const TABLE_BUCKET_FULL_ACCESS = 's3tables:*';

export const TABLE_BUCKET_READ_WRITE_ACCESS = [...new Set([
  ...TABLE_BUCKET_READ_ACCESS,
  ...TABLE_BUCKET_WRITE_ACCESS,
])];
