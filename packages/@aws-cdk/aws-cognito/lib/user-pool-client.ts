import { Construct, IResource, Resource } from '@aws-cdk/core';
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

/**
 * Properties for the UserPoolClient construct
 */
export interface UserPoolClientProps {
  /**
   * Name of the application client
   * @default - cloudformation generated name
   */
  readonly userPoolClientName?: string;

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
   * @default - no enabled flows
   */
  readonly enabledAuthFlows?: AuthFlow[]
}

/**
 * Represents a Cognito user pool client.
 */
export interface IUserPoolClient extends IResource {
  /**
   * Name of the application client
   * @attribute
   */
  readonly userPoolClientId: string;
}

/**
 * Define a UserPool App Client
 */
export class UserPoolClient extends Resource implements IUserPoolClient {
  /**
   * Import a user pool client given its id.
   */
  public static fromUserPoolClientId(scope: Construct, id: string, userPoolClientId: string): IUserPoolClient {
    class Import extends Resource implements IUserPoolClient {
      public readonly userPoolClientId = userPoolClientId;
    }

    return new Import(scope, id);
  }

  public readonly userPoolClientId: string;
  private readonly _userPoolClientName?: string;

  /*
   * Note to implementers: Two CloudFormation return values Name and ClientSecret are part of the spec.
   * However, they have been explicity not implemented here. They are not documented in CloudFormation, and
   * CloudFormation returns the following the string when these two attributes are 'GetAtt' - "attribute not supported
   * at this time, please use the CLI or Console to retrieve this value".
   * Awaiting updates from CloudFormation.
   */

  constructor(scope: Construct, id: string, props: UserPoolClientProps) {
    super(scope, id);

    const resource = new CfnUserPoolClient(this, 'Resource', {
      clientName: props.userPoolClientName,
      generateSecret: props.generateSecret,
      userPoolId: props.userPool.userPoolId,
      explicitAuthFlows: props.enabledAuthFlows
    });

    this.userPoolClientId = resource.ref;
    this._userPoolClientName = props.userPoolClientName;
  }

  /**
   * The client name that was specified via the `userPoolClientName` property during initialization,
   * throws an error otherwise.
   */
  public get userPoolClientName(): string {
    if (this._userPoolClientName === undefined) {
      throw new Error('userPoolClientName is available only if specified on the UserPoolClient during initialization');
    }
    return this._userPoolClientName;
  }
}
