import { Construct } from 'constructs';
import { UserPoolIdentityProviderProps } from './base';
import { UserPoolIdentityProviderBase } from './private/user-pool-idp-base';
import { CfnUserPoolIdentityProvider } from '../cognito.generated';

/**
 * Properties to initialize UserPoolFacebookIdentityProvider
 */
export interface UserPoolIdentityProviderFacebookProps extends UserPoolIdentityProviderProps {
  /**
   * The client id recognized by Facebook APIs.
   */
  readonly clientId: string;
  /**
   * The client secret to be accompanied with clientUd for Facebook to authenticate the client.
   * @see https://developers.facebook.com/docs/facebook-login/security#appsecret
   */
  readonly clientSecret: string;
  /**
   * The list of facebook permissions to obtain for getting access to the Facebook profile.
   * @see https://developers.facebook.com/docs/facebook-login/permissions
   * @default [ public_profile ]
   */
  readonly scopes?: string[];
  /**
   * The Facebook API version to use
   * @default - to the oldest version supported by Facebook
   */
  readonly apiVersion?: string;
}

/**
 * Represents a identity provider that integrates with 'Facebook Login'
 * @resource AWS::Cognito::UserPoolIdentityProvider
 */
export class UserPoolIdentityProviderFacebook extends UserPoolIdentityProviderBase {
  public readonly providerName: string;

  constructor(scope: Construct, id: string, props: UserPoolIdentityProviderFacebookProps) {
    super(scope, id, props);

    const scopes = props.scopes ?? ['public_profile'];

    const resource = new CfnUserPoolIdentityProvider(this, 'Resource', {
      userPoolId: props.userPool.userPoolId,
      providerName: 'Facebook', // must be 'Facebook' when the type is 'Facebook'
      providerType: 'Facebook',
      providerDetails: {
        client_id: props.clientId,
        client_secret: props.clientSecret,
        authorize_scopes: scopes.join(','),
        api_version: props.apiVersion,
      },
      attributeMapping: super.configureAttributeMapping(),
    });

    this.providerName = super.getResourceNameAttribute(resource.ref);
  }
}