import { Construct } from 'constructs';
import { UserPoolIdentityProviderProps } from './base';
import { UserPoolIdentityProviderBase } from './private/user-pool-idp-base';
import { CfnUserPoolIdentityProvider } from '../cognito.generated';

/**
 * Properties to initialize UserPoolAmazonIdentityProvider
 */
export interface UserPoolIdentityProviderAmazonProps extends UserPoolIdentityProviderProps {
  /**
   * The client id recognized by 'Login with Amazon' APIs.
   * @see https://developer.amazon.com/docs/login-with-amazon/security-profile.html#client-identifier
   */
  readonly clientId: string;
  /**
   * The client secret to be accompanied with clientId for 'Login with Amazon' APIs to authenticate the client.
   * @see https://developer.amazon.com/docs/login-with-amazon/security-profile.html#client-identifier
   */
  readonly clientSecret: string;
  /**
   * The types of user profile data to obtain for the Amazon profile.
   * @see https://developer.amazon.com/docs/login-with-amazon/customer-profile.html
   * @default [ profile ]
   */
  readonly scopes?: string[];
}

/**
 * Represents a identity provider that integrates with 'Login with Amazon'
 * @resource AWS::Cognito::UserPoolIdentityProvider
 */
export class UserPoolIdentityProviderAmazon extends UserPoolIdentityProviderBase {
  public readonly providerName: string;

  constructor(scope: Construct, id: string, props: UserPoolIdentityProviderAmazonProps) {
    super(scope, id, props);

    const scopes = props.scopes ?? ['profile'];

    const resource = new CfnUserPoolIdentityProvider(this, 'Resource', {
      userPoolId: props.userPool.userPoolId,
      providerName: 'LoginWithAmazon', // must be 'LoginWithAmazon' when the type is 'LoginWithAmazon'
      providerType: 'LoginWithAmazon',
      providerDetails: {
        client_id: props.clientId,
        client_secret: props.clientSecret,
        authorize_scopes: scopes.join(' '),
      },
      attributeMapping: super.configureAttributeMapping(),
    });

    this.providerName = super.getResourceNameAttribute(resource.ref);
  }
}