import * as AWS from 'aws-sdk';

/**
 * A utility class to inspect CloudFormation stack statuses.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-describing-stacks.html
 */
export class StackStatus {
  public static fromStackDescription(description: AWS.CloudFormation.Stack) {
    return new StackStatus(description.StackStatus, description.StackStatusReason, description.DetailedStatus);
  }

  constructor(public readonly event: string, public readonly reason?: string, public readonly detailedEvent?: string) {}

  get isCreationFailure(): boolean {
    return this.event === 'ROLLBACK_COMPLETE'
      || this.event === 'ROLLBACK_FAILED';
  }

  get isDeleted(): boolean {
    return this.event.startsWith('DELETE_');
  }

  get isFailure(): boolean {
    return this.event.endsWith('FAILED');
  }

  public isInProgress(exitOnConfigComplete?: boolean): boolean {
    if (exitOnConfigComplete && this.isConfigurationComplete) {
      return false;
    }
    return this.event.endsWith('_IN_PROGRESS') && !this.isReviewInProgress;
  }

  get isReviewInProgress(): boolean {
    return this.event === 'REVIEW_IN_PROGRESS';
  }

  get isNotFound(): boolean {
    return this.event === 'NOT_FOUND';
  }

  public isDeploySuccess(exitOnConfigComplete?: boolean): boolean {
    if (exitOnConfigComplete && this.isConfigurationComplete) {
      return true;
    }
    return !this.isNotFound && (this.event === 'CREATE_COMPLETE' || this.event === 'UPDATE_COMPLETE' || this.event === 'IMPORT_COMPLETE');
  }

  get isRollbackSuccess(): boolean {
    return this.event === 'ROLLBACK_COMPLETE'
      || this.event === 'UPDATE_ROLLBACK_COMPLETE';
  }

  private get isConfigurationComplete() {
    return this.detailedEvent === 'CONFIGURATION_COMPLETE';
  }
}
