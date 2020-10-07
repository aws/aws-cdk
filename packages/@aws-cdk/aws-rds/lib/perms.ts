// https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/data-api.html#data-api.access
export const DATA_API_ACTIONS = [
  'secretsmanager:CreateSecret',
  'secretsmanager:ListSecrets',
  'secretsmanager:GetRandomPassword',
  'tag:GetResources',
  'rds-data:BatchExecuteStatement',
  'rds-data:BeginTransaction',
  'rds-data:CommitTransaction',
  'rds-data:ExecuteStatement',
  'rds-data:RollbackTransaction',
];