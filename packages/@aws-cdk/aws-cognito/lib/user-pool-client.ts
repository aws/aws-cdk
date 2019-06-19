import { Construct, PhysicalName, Resource } from '@aws-cdk/cdk';
import { CfnUserPoolClient } from './cognito.generated';
import { IUserPool } from './user-pool';

/**
 * Types of authentication flow
 */
export enum AuthFlow {
  /**
   * Enable flow for server-side or admin authentication (no client app)
   */
  ADMIN_NO_SRP = 'ADMIN_NO_SRP_AUTH',

  /**
   * Enable custom authentication flow
   */
  CUSTOM_FLOW_ONLY = 'CUSTOM_AUTH_FLOW_ONLY',

  /**
   * Enable auth using username & password
   */
  USER_PASSWORD = 'USER_PASSWORD_AUTH'
}

export interface UserPoolClientProps {
  /**
   * Name of the application client
   * @default cloudformation generated name
   */
  readonly clientName?: PhysicalName;

  /**
   * The UserPool resource this client will have access to
   */
  readonly userPool: IUserPool;

  /**
   * Whether to generate a client secret
   * @default false
   */
  readonly generateSecret?: boolean;

  /**
   * List of enabled authentication flows
   * @default no enabled flows
   */
  readonly enabledAuthFlows?: AuthFlow[]
}

/**
 * Define a UserPool App Client
 */
export class UserPoolClient extends Resource {
  /**
   * @attribute
   */
  public readonly userPoolClientId: string;

  /**
   * @attribute
   */
  public readonly userPoolClientName: string;

  /**
   * @attribute
   */
  public readonly userPoolClientClientSecret: string;

  constructor(scope: Construct, id: string, props: UserPoolClientProps) {
    super(scope, id, {
      physicalName: props.clientName,
    });

    const resource = new CfnUserPoolClient(this, 'Resource', {
      clientName: this.physicalName.value,
      generateSecret: props.generateSecret,
      userPoolId: props.userPool.userPoolId,
      explicitAuthFlows: props.enabledAuthFlows
    });

    this.userPoolClientId = resource.refAsString;
    this.userPoolClientClientSecret = resource.attrClientSecret;
    this.userPoolClientName = resource.attrName;
  }
}
