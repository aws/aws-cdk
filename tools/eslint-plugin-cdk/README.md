# eslint-plugin-cdk

Eslint plugin for the CDK repository. Contains rules that need to be applied specific to the CDK repository.

## Rules

* `no-core-construct`: Forbid the use of `Construct` and `IConstruct` from the "@aws-cdk/core" module.
  Instead use `Construct` and `IConstruct` from the "constructs" module.
  Rule only applies to typescript files under the `test/` folder.