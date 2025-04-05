import { Construct } from 'constructs';
import * as cdk from '../../../core';
import { UnscopedValidationError } from '../../../core';
import { ActionCategory } from '../action';
import { Artifact } from '../artifact';
import { GitConfiguration, GitPullRequestFilter, GitPushFilter } from '../trigger';

/**
 * Validation function that checks if the number of artifacts is within the given bounds
 */
export function validateArtifactBounds(
  type: string, artifacts: Artifact[],
  min: number, max: number,
  category: string, provider: string): string[] {
  const ret: string[] = [];

  if (artifacts.length < min) {
    ret.push(`${category}/${provider} must have at least ${min} ${type} artifacts`);
  }

  if (artifacts.length > max) {
    ret.push(`${category}/${provider} cannot have more than ${max} ${type} artifacts`);
  }

  return ret;
}

/**
 * Validation function that guarantees that an action is or is not a source action. This is useful because Source actions can only be
 * in the first stage of a pipeline, and the first stage can only contain source actions.
 */
export function validateSourceAction(mustBeSource: boolean, category: string, actionName: string, stageName: string): string[] {
  if (mustBeSource !== (category === ActionCategory.SOURCE)) {
    return [`Action ${actionName} in stage ${stageName}: ` + (mustBeSource ? 'first stage may only contain Source actions'
      : 'Source actions may only occur in first stage')];
  }
  return [];
}

/**
 * Regex to validate Pipeline, Stage, Action names
 *
 * https://docs.aws.amazon.com/codepipeline/latest/userguide/limits.html
 */
const VALID_IDENTIFIER_REGEX = /^[a-zA-Z0-9.@_-]{1,100}$/;

/**
 * Validate the given name of a pipeline component. Pipeline component names all have the same restrictions.
 * This can be used to validate the name of all components of a pipeline.
 */
export function validateName(scope: Construct, thing: string, name: string | undefined): void {
  validateAgainstRegex(scope, VALID_IDENTIFIER_REGEX, thing, name);
}

export function validateArtifactName(artifactName: string | undefined): void {
  // https://docs.aws.amazon.com/codepipeline/latest/APIReference/API_Artifact.html#CodePipeline-Type-Artifact-name
  validateAgainstRegex(undefined, /^[a-zA-Z0-9_-]{1,100}$/, 'Artifact', artifactName);
}

export function validateNamespaceName(scope: Construct, namespaceName: string | undefined): void {
  validateAgainstRegex(scope, /^[A-Za-z0-9@_-]{1,100}$/, 'Namespace', namespaceName);
}

export function validatePipelineVariableName(variableName: string | undefined): void {
  validateAgainstRegex(undefined, /^[A-Za-z0-9@\-_]{1,128}$/, 'Variable', variableName);
}

export function validateRuleName(ruleName: string | undefined): void {
  validateAgainstRegex(undefined, /^[A-Za-z0-9.@\-_]{1,100}$/, 'Rule', ruleName);
}

function validateAgainstRegex(scope: Construct | undefined, regex: RegExp, thing: string, name: string | undefined) {
  // name could be a Token - in that case, skip validation altogether
  if (cdk.Token.isUnresolved(name)) {
    return;
  }

  if (name !== undefined && !regex.test(name)) {
    const msg = `${thing} name must match regular expression: ${regex.toString()}, got '${name}'`;
    if (scope) {
      throw new cdk.ValidationError(msg, scope);
    } else {
      throw new cdk.UnscopedValidationError(msg);
    }
  }
}
export function validateTriggers(gitConfiguration: GitConfiguration) {
  const { sourceAction, pushFilter, pullRequestFilter } = gitConfiguration;
  if (sourceAction.actionProperties.provider !== 'CodeStarSourceConnection') {
    throw new UnscopedValidationError(`provider for actionProperties in sourceAction with name '${sourceAction.actionProperties.actionName}' must be 'CodeStarSourceConnection', got '${sourceAction.actionProperties.provider}'`);
  }
  if (pushFilter?.length && pullRequestFilter?.length) {
    throw new UnscopedValidationError(`cannot specify both GitPushFilter and GitPullRequestFilter for the trigger with sourceAction with name '${sourceAction.actionProperties.actionName}'`);
  }
  if (!pushFilter?.length && !pullRequestFilter?.length) {
    throw new UnscopedValidationError(`must specify either GitPushFilter or GitPullRequestFilter for the trigger with sourceAction with name '${sourceAction.actionProperties.actionName}'`);
  }
  if (pushFilter !== undefined) {
    validateGitPushFilter(pushFilter, sourceAction.actionProperties.actionName);
  }
  if (pullRequestFilter !== undefined) {
    validateGitPullRequestFilter(pullRequestFilter, sourceAction.actionProperties.actionName);
  }
}

function validateGitPushFilter(pushFilter: GitPushFilter[], actionName: string) {
  if (pushFilter.length > 3) {
    throw new UnscopedValidationError(`length of GitPushFilter for sourceAction with name '${actionName}' must be less than or equal to 3, got ${pushFilter.length}`);
  }
  pushFilter.forEach(filter => {
    validateGitFilterPropertiesLength(filter, actionName, 'GitPushFilter');
    validateArrayLength(filter.tagsExcludes, 'tagsExcludes', actionName, 'GitPushFilter');
    validateArrayLength(filter.tagsIncludes, 'tagsIncludes', actionName, 'GitPushFilter');
    validateFilePathsWithBranches(filter, actionName);
    validateTagsOrBranchesExist(filter, actionName);
  });
}

function validateGitPullRequestFilter(pullRequestFilter: GitPullRequestFilter[], actionName: string) {
  if (pullRequestFilter.length > 3) {
    throw new UnscopedValidationError(`length of GitPullRequestFilter for sourceAction with name '${actionName}' must be less than or equal to 3, got ${pullRequestFilter.length}`);
  }
  pullRequestFilter.forEach(filter =>{
    validateBranchesSpecified(filter, actionName);
    validateGitFilterPropertiesLength(filter, actionName, 'GitPullRequestFilter');
  });
}

function validateGitFilterPropertiesLength(filter: GitPushFilter | GitPullRequestFilter, actionName: string, filterType: string) {
  validateArrayLength(filter.branchesExcludes, 'branchesExcludes', actionName, filterType);
  validateArrayLength(filter.branchesIncludes, 'branchesIncludes', actionName, filterType);
  validateArrayLength(filter.filePathsExcludes, 'filePathsExcludes', actionName, filterType);
  validateArrayLength(filter.filePathsIncludes, 'filePathsIncludes', actionName, filterType);
}

const validateBranchesSpecified = (filter: GitPullRequestFilter, actionName: string) => {
  if (!filter.branchesExcludes && !filter.branchesIncludes) {
    throw new UnscopedValidationError(
      `must specify branches in GitPullRequestFilter for sourceAction with name '${actionName}'`,
    );
  }
};

const validateArrayLength = (
  array: string[] | undefined,
  fieldName: string,
  actionName: string,
  filterType: string,
) => {
  if (array && array.length > MAX_FILTER_LENGTH) {
    throw new UnscopedValidationError(
      `maximum length of ${fieldName} in ${filterType} for sourceAction with name '${actionName}' is ${MAX_FILTER_LENGTH}, got ${array.length}`,
    );
  }
};

const hasFilePaths = (filter: GitPushFilter | GitPullRequestFilter): boolean => {
  return Boolean(filter.filePathsExcludes || filter.filePathsIncludes);
};

const hasBranches = (filter: GitPushFilter | GitPullRequestFilter): boolean => {
  return Boolean(filter.branchesExcludes || filter.branchesIncludes);
};

const hasTags = (filter: GitPushFilter ): boolean => {
  return Boolean(filter.tagsExcludes || filter.tagsIncludes);
};

const validateFilePathsWithBranches = (filter: GitPushFilter | GitPullRequestFilter, actionName: string) => {
  if (!hasBranches(filter) && hasFilePaths(filter)) {
    throw new UnscopedValidationError(
      `cannot specify filePaths without branches for sourceAction with name '${actionName}'`,
    );
  }
};

const validateTagsOrBranchesExist = (filter: GitPushFilter, actionName: string) => {
  if (!hasTags(filter) && !hasBranches(filter)) {
    throw new UnscopedValidationError(
      `must specify either tags or branches in GitpushFilter for sourceAction with name '${actionName}'`,
    );
  }
};
const MAX_FILTER_LENGTH = 8;
