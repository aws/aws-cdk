import * as iam from '@aws-cdk/aws-iam';

/**
 * IAppMonitorAuthorizer
 */
export interface IAppMonitorAuthorizer {
  /**
   * ARN that used by RUM web client.
   */
  readonly guestRoleArn?: string;
  /**
   * Amazon Cognito identity pool id that used by RUM web client.
   */
  readonly identityPoolId?: string;
  /**
   * Roles used to access AWS.
   */
  readonly role: iam.IRole;
}