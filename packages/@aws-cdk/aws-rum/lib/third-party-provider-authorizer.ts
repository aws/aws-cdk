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
  public readonly role: iam.IRole;

  constructor(props: ThirdPartyAuthorizerProps) {
    this.role = props.role;
  }
}