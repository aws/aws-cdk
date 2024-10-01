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

  /**
   * Whether the stack is in a paused state due to `--no-rollback`.
   *
   * The possible actions here are retrying a new `--no-rollback` deployment, or initiating a rollback.
   */
  get rollbackChoice(): RollbackChoice {
    switch (this.name) {
      case 'CREATE_FAILED':
      case 'UPDATE_FAILED':
        return RollbackChoice.START_ROLLBACK;
      case 'UPDATE_ROLLBACK_FAILED':
        return RollbackChoice.CONTINUE_UPDATE_ROLLBACK;
      case 'ROLLBACK_FAILED':
        // Unfortunately there is no option to continue a failed rollback without
        // a stable target state.
        return RollbackChoice.ROLLBACK_FAILED;
      default:
        return RollbackChoice.NONE;
    }
  }

  public toString(): string {
    return this.name + (this.reason ? ` (${this.reason})` : '');
  }
}

/**
 * Describe the current rollback options for this state
 */
export enum RollbackChoice {
  START_ROLLBACK,
  CONTINUE_UPDATE_ROLLBACK,
  /**
   * A sign that stack creation AND its rollback have failed.
   *
   * There is no way to recover from this, other than recreating the stack.
   */
  ROLLBACK_FAILED,
  NONE,
}