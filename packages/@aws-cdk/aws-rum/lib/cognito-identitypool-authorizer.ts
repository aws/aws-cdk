import * as iam from '@aws-cdk/aws-iam';
import { IAppMonitorAuthorizer } from './app-monitor-authorizer';

/**
 * CognitoIdentityPoolAuthorizerProps
 */
export interface CognitoIdentityPoolAuthorizerProps {
  /**
   * Amazon Cognito identity pool id for authentication.
   */
  readonly identityPoolId: string;
  /**
   * Unauthenticated role of Amazon Cognito identity pool.
   */
  readonly unauthenticatedRole: iam.IRole;
}

/**
 * Authorizer that use Amazon Cognito identity pool.
 */
export class CognitoIdentityPoolAuthorizer implements IAppMonitorAuthorizer {
  /**
   * Amazon Cognito identity pool id for authentication.
   */
  public readonly identityPoolId: string | undefined;
  /**
   * Unauthenticated role ARN of Amazon Cognito identity pool.
   */
  public get guestRoleArn(): string | undefined {
    return this.unauthenticatedRole.roleArn;
  }
  private readonly unauthenticatedRole: iam.IRole;
  constructor(props: CognitoIdentityPoolAuthorizerProps) {
    this.identityPoolId = props.identityPoolId;
    this.unauthenticatedRole = props.unauthenticatedRole;
  }

  /**
   * Add put policy to unauthenticated role.
   * @param putPolicy policy that includes rum:PutRumEvents action.
   */
  addPutPolicy(putPolicy: iam.IManagedPolicy): void {
    this.unauthenticatedRole.addManagedPolicy(putPolicy);
  }
}