import cdk = require('@aws-cdk/cdk');
import { CfnUserPoolClient } from './cognito.generated';
import { UserPool } from './user-pool';

export enum AuthFlow {
  ADMIN_NO_SRP_AUTH = 'ADMIN_NO_SRP_AUTH',
  CUSTOM_AUTH_FLOW_ONLY = 'CUSTOM_AUTH_FLOW_ONLY',
  USER_PASSWORD_AUTH = 'USER_PASSWORD_AUTH'
}

export interface UserPoolClientProps {
  /**
   * Name of the application client
   * @default unique ID
   */
  clientName?: string;

  /**
   * The UserPool resource this client will have access to
   */
  userPool: UserPool;

  /**
   * Whether to generate a client secret
   * @default false
   */
  generateSecret?: boolean;

  /**
   * List of enabled authentication flows
   * @default no enabled flows
   */
  enabledAuthFlows?: AuthFlow[]
}

/**
 * Define a UserPool App Client
 */
export class UserPoolClient extends cdk.Construct {
  public readonly clientId: string;

  constructor(scope: cdk.Construct, id: string, props: UserPoolClientProps) {
    super(scope, id);

    const userPoolClient = new CfnUserPoolClient(this, 'UserPoolClient', {
      clientName: props.clientName || this.node.uniqueId,
      generateSecret: props.generateSecret || false,
      userPoolId: props.userPool.poolId,
      explicitAuthFlows: props.enabledAuthFlows
    });
    this.clientId = userPoolClient.userPoolClientId;
  }
}