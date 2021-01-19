export const MANAGEMENT_ACTIONS = [
  'athena:CreateWorkGroup',
  'athena:GetWorkGroup',
  'athena:DeleteWorkGroup',
  'athena:UpdateWorkGroup',
];

export const USER_ACTIONS = [
  'athena:StartQueryExecution',
  'athena:GetQueryResults',
  'athena:DeleteNamedQuery',
  'athena:GetNamedQuery',
  'athena:ListQueryExecutions',
  'athena:StopQueryExecution',
  'athena:GetQueryResultsStream',
  'athena:ListNamedQueries',
  'athena:CreateNamedQuery',
  'athena:GetQueryExecution',
  'athena:BatchGetNamedQuery',
  'athena:BatchGetQueryExecution',
  'athena:GetWorkGroup',
];

export const GENERAL_ACTIONS = [
  'athena:ListEngineVersions',
  'athena:ListWorkGroups',
  'athena:GetExecutionEngine',
  'athena:GetExecutionEngines',
  'athena:GetNamespace',
  'athena:GetCatalogs',
  'athena:GetTables',
  'athena:GetTable',
];
