# pkglint

enforces CDK-specific linter rules

## Rules

All linter rules live in `rules.ts`. To create a new rule, create a new class
in that file that extends `ValidationRule`. That class will be automatically
picked up by pkglint when it is run.

When designing a new rule, do not assume that pkglint will run on a built
`aws-cdk` repository. pkglint is sometimes run on just the source code of
`aws-cdk` modules so validating compiled code will result in failure.