export const rules = {
  'no-core-construct': require('./rules/no-core-construct'),
  'invalid-cfn-imports': require('./rules/invalid-cfn-imports'),
  'no-literal-partition': require('./rules/no-literal-partition'),
  'no-invalid-path': require('./rules/no-invalid-path'),
  'promiseall-no-unbounded-parallelism': require('./rules/promiseall-no-unbounded-parallelism'),
};
