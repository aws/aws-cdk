import { randomBytes } from 'crypto';
import { IUserPool } from './user-pool';
import { 
  IResource, 
  Resource,
  Lazy,
  Names
} from '@aws-cdk/core';
import { Construct } from 'constructs';
import { 
  UserPoolClient,
  UserPoolClientProps
} from './user-pool-client';
import { IUserPoolIdentityProvider } from './user-pool-idp';

/**
 * Represents a UserPoolAuthenticationProvider
 */
 export interface IUserPoolAuthenticationProvider extends IResource {
  /**
   * Client Id of the Associated User Pool Client
   */
  readonly clientId: string

  /**
   * Whether to disable the user pool's default server side token check
   */
  readonly disableServerSideTokenCheck: boolean;
   
  /**
   * The identity providers associated with the UserPool
   */
  readonly identityProviders: IUserPoolIdentityProvider[];
}

/**
 * Props for the User Pool Authentication Provider
 */
export interface UserPoolAuthenticationProviderProps extends UserPoolClientProps {

  /**
   * Name of the UserPoolAuthenticationProvider
   * @default - A name will be created
   */
  readonly userPoolAuthenticationProviderName?: string

  /**
   * Setting this to true turns off identity pool checks for this user pool to make sure the user has not been globally signed out or deleted before the identity pool provides an OIDC token or AWS credentials for the user
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypool-cognitoidentityprovider.html
   * @default false
   */
  readonly disableServerSideTokenCheck?: boolean;
}

/**
 * Define a User Pool Authentication Provider
 */
export class UserPoolAuthenticationProvider extends Resource implements IUserPoolAuthenticationProvider {

  /**
   * Form User Pool Authentication Provider from existing User Pool
   */
  static fromUserPool(scope: Construct, id: string, userPool: IUserPool): IUserPoolAuthenticationProvider {
    return new UserPoolAuthenticationProvider(scope, id, { userPool });
  }

  /**
   * Client Id of the Associated User Pool Client
   */
  public readonly clientId: string

  /**
   * Whether to disable the user pool's default server side token check
   */
  public readonly disableServerSideTokenCheck: boolean;

  /**
   * The identity providers associated with the UserPool
   */
  public identityProviders: IUserPoolIdentityProvider[] = [];

  constructor(scope: Construct, id: string, props: UserPoolAuthenticationProviderProps) {
    super(scope, id, {
      physicalName: props.userPoolAuthenticationProviderName || Lazy.string({ produce: () => 
        Names.uniqueId(this).substring(0,20), 
      }),
    });
    const client = this.configureUserPoolClient(props);
    this.clientId = client.userPoolClientId;
    this.identityProviders = props.userPool.identityProviders;
    this.disableServerSideTokenCheck = props.disableServerSideTokenCheck ? true : false;
  }

  /**
   * Configures and returns new User Pool Client that will implement Identity Providers in Identity Pool
   */
  private configureUserPoolClient(props: UserPoolAuthenticationProviderProps): UserPoolClient {
    return props.userPool.addClient('UserPoolClientFor' + props.userPoolClientName || this.generateRandomName(), props);
  }

  private generateRandomName(bytes: number = 5): string {
    return randomBytes(bytes).toString('hex');
  }
}