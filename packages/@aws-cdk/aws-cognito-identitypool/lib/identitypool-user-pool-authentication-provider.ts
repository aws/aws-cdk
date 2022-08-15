import {
  IUserPool,
  IUserPoolClient,
} from '@aws-cdk/aws-cognito';
import { Stack } from '@aws-cdk/core';
import {
  IdentityPoolProviderUrl,
  IIdentityPool,
} from './identitypool';

/**
 * Represents the concept of a User Pool Authentication Provider.
 * You use user pool authentication providers to configure User Pools
 * and User Pool Clients for use with Identity Pools
 */
export interface IUserPoolAuthenticationProvider {
  /**
   * The method called when a given User Pool Authentication Provider is added
   * (for the first time) to an Identity Pool.
   */
  bind(
    identityPool: IIdentityPool,
    options?: UserPoolAuthenticationProviderBindOptions
  ): UserPoolAuthenticationProviderBindConfig;
}

/**
 * Props for the User Pool Authentication Provider
 */
export interface UserPoolAuthenticationProviderProps {
  /**
   * The User Pool of the Associated Identity Providers
   */
  readonly userPool: IUserPool;

  /**
   * The User Pool Client for the provided User Pool
   * @default - A default user pool client will be added to User Pool
   */
  readonly userPoolClient?: IUserPoolClient;

  /**
   * Setting this to true turns off identity pool checks for this user pool to make sure the user has not been globally signed out or deleted before the identity pool provides an OIDC token or AWS credentials for the user
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypool-cognitoidentityprovider.html
   * @default false
   */
  readonly disableServerSideTokenCheck?: boolean;

}

/**
 * Represents UserPoolAuthenticationProvider Bind Options
 */
export interface UserPoolAuthenticationProviderBindOptions { }

/**
 * Represents a UserPoolAuthenticationProvider Bind Configuration
 */
export interface UserPoolAuthenticationProviderBindConfig {
  /**
   * Client Id of the Associated User Pool Client
   */
  readonly clientId: string

  /**
   * The identity providers associated with the UserPool
   */
  readonly providerName: string;

  /**
   * Whether to enable the identity pool's server side token check
   */
  readonly serverSideTokenCheck: boolean;
}

/**
 * Defines a User Pool Authentication Provider
 */
export class UserPoolAuthenticationProvider implements IUserPoolAuthenticationProvider {

  /**
   * The User Pool of the Associated Identity Providers
   */
  private userPool: IUserPool;

  /**
   * The User Pool Client for the provided User Pool
   */
  private userPoolClient: IUserPoolClient;

  /**
   * Whether to disable the pool's default server side token check
   */
  private disableServerSideTokenCheck: boolean
  constructor(props: UserPoolAuthenticationProviderProps) {
    this.userPool = props.userPool;
    this.userPoolClient = props.userPoolClient || this.userPool.addClient('UserPoolAuthenticationProviderClient');
    this.disableServerSideTokenCheck = props.disableServerSideTokenCheck ?? false;
  }

  public bind(
    identityPool: IIdentityPool,
    _options?: UserPoolAuthenticationProviderBindOptions,
  ): UserPoolAuthenticationProviderBindConfig {
    Node.of(identityPool).addDependency(this.userPool);
    Node.of(identityPool).addDependency(this.userPoolClient);

    return {
      clientId: this.userPoolClient.userPoolClientId,
      providerName: this.getProviderName(scope),
      serverSideTokenCheck: !this.disableServerSideTokenCheck,
    };
  }

  /**
   * The identity providers associated with the UserPool.
   */
  private getProviderName(scope: Construct): string {
    const region = Stack.of(scope).region;
    const urlSuffix = Stack.of(scope).urlSuffix;

    return `cognito-idp.${region}.${urlSuffix}/${this.userPool.userPoolId}`;
  }

  /**
   * The User Pool Provider Url.
   */
  public get providerUrl(): IdentityPoolProviderUrl {
    const providerName = this.getProviderName(this.construct.scope);
    const userPoolClientId = this.userPoolClient.userPoolClientId;

    return IdentityPoolProviderUrl.userPool(`${providerName}:${userPoolClientId}`);
  }
}
