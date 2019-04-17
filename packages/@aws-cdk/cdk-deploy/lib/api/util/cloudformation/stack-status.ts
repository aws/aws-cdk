import AWS = require('aws-sdk');

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

  get isRollback(): boolean {
    return this.name.indexOf('ROLLBACK') !== -1;
  }

  get isStable(): boolean {
    return !this.name.endsWith('_IN_PROGRESS');
  }

  get isSuccess(): boolean {
    return !this.isRollback && !this.isFailure;
  }

  public toString(): string {
    return this.name + (this.reason ? ` (${this.reason})` : '');
  }
}
