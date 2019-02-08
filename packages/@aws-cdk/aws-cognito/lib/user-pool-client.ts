import cdk = require('@aws-cdk/cdk');
import { CfnUserPoolClient } from './cognito.generated';
import { IUserPool } from './user-pool';

/**
 * Types of authentication flow
 */
export enum AuthFlow {
  /**
   * Enable flow for server-side or admin authentication (no client app)
   */
  AdminNoSrp = 'ADMIN_NO_SRP_AUTH',

  /**
   * Enable custom authentication flow
   */
  CustomFlowOnly = 'CUSTOM_AUTH_FLOW_ONLY',

  /**
   * Enable auth using username & password
   */
  UserPassword = 'USER_PASSWORD_AUTH'
}

export interface UserPoolClientProps {
  /**
   * Name of the application client
   * @default cloudformation generated name
   */
  clientName?: string;

  /**
   * The UserPool resource this client will have access to
   */
  userPool: IUserPool;

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

    const userPoolClient = new CfnUserPoolClient(this, 'Resource', {
      clientName: props.clientName,
      generateSecret: props.generateSecret,
      userPoolId: props.userPool.userPoolId,
      explicitAuthFlows: props.enabledAuthFlows
    });
    this.clientId = userPoolClient.userPoolClientId;
  }
}