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
   * Add put policy to this authorizer role.
   * @param putPolicy policy that includes rum:PutRumEvents action.
   */
  addPutPolicy(putPolicy: iam.IManagedPolicy): void
}