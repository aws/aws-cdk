import * as AWS from 'aws-sdk';

/**
 * A utility class to inspect CloudFormation stack statuses.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-describing-stacks.html
 */
export class StackStatus {
  public static fromStackDescription(description: AWS.CloudFormation.Stack) {
    return new StackStatus(description.StackStatus, description.StackStatusReason);
  }

  constructor(public readonly name: string, public readonly reason?: string) {}

  get isCreationFailure(): boolean {
    return this.name === 'ROLLBACK_COMPLETE'
      || this.name === 'ROLLBACK_FAILED';
  }

  get isDeleted(): boolean {
    return this.name.startsWith('DELETE_');
  }

  get isFailure(): boolean {
    return this.name.endsWith('FAILED');
  }

  get isInProgress(): boolean {
    return this.name.endsWith('_IN_PROGRESS') && !this.isReviewInProgress;
  }

  get isReviewInProgress(): boolean {
    return this.name === 'REVIEW_IN_PROGRESS';
  }

  get isNotFound(): boolean {
    return this.name === 'NOT_FOUND';
  }

  get isDeploySuccess(): boolean {
    return !this.isNotFound && (this.name === 'CREATE_COMPLETE' || this.name === 'UPDATE_COMPLETE' || this.name === 'IMPORT_COMPLETE');
  }

  get isRollbackSuccess(): boolean {
    return this.name === 'ROLLBACK_COMPLETE'
      || this.name === 'UPDATE_ROLLBACK_COMPLETE';
  }

  public toString(): string {
    return this.name + (this.reason ? ` (${this.reason})` : '');
  }
}

/**
 * A utility class to inspect CloudFormation stack detailed statuses.
 *
 * @see https://docs.aws.amazon.com/cli/latest/reference/cloudformation/describe-stacks.html
 */
export class StackDetailedStatus {
  public static fromStackDescription(description: AWS.CloudFormation.Stack) {
    return new StackDetailedStatus(description.DetailedStatus, description.StackStatusReason);
  }

  constructor(public readonly name?: string, public readonly reason?: string) {}

  get isConfigurationComplete(): boolean {
    return this.name === 'CONFIGURATION_COMPLETE';
  }

  get isValidationFailed(): boolean {
    return this.name === 'VALIDATION_FAILED';
  }

  public toString(): string {
    return this.name + (this.reason ? ` (${this.reason})` : '');
  }
}