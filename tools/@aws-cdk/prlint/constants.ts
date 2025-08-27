
export const DEFAULT_LINTER_LOGIN = 'aws-cdk-automation';

export const CODE_BUILD_WORKFLOW_FILE = 'codebuild-pr-build.yml';

/**
 * Types of exemption labels in aws-cdk project.
 */
export enum Exemption {
  README = 'pr-linter/exempt-readme',
  TEST = 'pr-linter/exempt-test',
  INTEG_TEST = 'pr-linter/exempt-integ-test',
  BREAKING_CHANGE = 'pr-linter/exempt-breaking-change',
  CLI_INTEG_TESTED = 'pr-linter/cli-integ-tested',
  ANALYTICS_METADATA_CHANGE = 'pr-linter/analytics-metadata-change',
  REQUEST_CLARIFICATION = 'pr/reviewer-clarification-requested',
  REQUEST_EXEMPTION = 'pr-linter/exemption-requested',
  CODECOV = "pr-linter/exempt-codecov",
  SIZE_CHECK = "pr-linter/exempt-size-check",
}

const CODECOV_PREFIX = 'codecov/';

export const CODECOV_CHECKS = [
  `${CODECOV_PREFIX}patch`,
  `${CODECOV_PREFIX}patch/packages/aws-cdk`,
  `${CODECOV_PREFIX}patch/packages/aws-cdk-lib/core`,
  `${CODECOV_PREFIX}project`,
  `${CODECOV_PREFIX}project/packages/aws-cdk`,
  `${CODECOV_PREFIX}project/packages/aws-cdk-lib/core`
];