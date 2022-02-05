import * as iam from '@aws-cdk/aws-iam';
import { IAppMonitorAuthorizer } from './app-monitor-authorizer';

/**
 * ThirdPartyAuthorizerProps
 */
export interface ThirdPartyAuthorizerProps {
  /**
   * Roles used to access AWS.
   */
  readonly role: iam.IRole;
}

/**
 * Authorizer that use third-party provider.
 */
export class ThirdPartyAuthorizer implements IAppMonitorAuthorizer {
  /**
   * Roles used to access AWS.
   */
  private readonly role: iam.IRole;
  constructor(props: ThirdPartyAuthorizerProps) {
    this.role = props.role;
  }
  /**
   * Add put policy to this authorizer role.
   * @param putPolicy policy that includes rum:PutRumEvents action.
   */
  addPutPolicy(putPolicy: iam.IManagedPolicy): void {
    this.role.addManagedPolicy(putPolicy);
  }
}