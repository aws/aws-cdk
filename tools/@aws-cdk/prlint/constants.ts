
export const CODE_BUILD_CONTEXT = 'AWS CodeBuild us-east-1 (AutoBuildv2Project1C6BFA3F-wQm2hXv2jqQv)';

/**
 * Types of exemption labels in aws-cdk project.
 */
export enum Exemption {
  README = 'pr-linter/exempt-readme',
  TEST = 'pr-linter/exempt-test',
  INTEG_TEST = 'pr-linter/exempt-integ-test',
  BREAKING_CHANGE = 'pr-linter/exempt-breaking-change',
  CLI_INTEG_TESTED = 'pr-linter/cli-integ-tested',
  REQUEST_CLARIFICATION = 'pr/reviewer-clarification-requested',
  REQUEST_EXEMPTION = 'pr-linter/exemption-requested',
  CODECOV = "pr-linter/exempt-codecov",
}
