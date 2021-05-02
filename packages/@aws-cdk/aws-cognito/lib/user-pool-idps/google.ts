import { Construct } from 'constructs';
import { CfnUserPoolIdentityProvider } from '../cognito.generated';
import { UserPoolIdentityProviderProps } from './base';
import { UserPoolIdentityProviderBase } from './private/user-pool-idp-base';

/**
 * Properties to initialize UserPoolGoogleIdentityProvider
 */
export interface UserPoolIdentityProviderGoogleProps extends UserPoolIdentityProviderProps {
  /**
   * The client id recognized by Google APIs.
   * @see https://developers.google.com/identity/sign-in/web/sign-in#specify_your_apps_client_id
   */
  readonly clientId: string;
  /**
   * The client secret to be accompanied with clientId for Google APIs to authenticate the client.
   * @see https://developers.google.com/identity/sign-in/web/sign-in
   */
  readonly clientSecret: string;
  /**
   * The list of google permissions to obtain for getting access to the google profile
   * @see https://developers.google.com/identity/sign-in/web/sign-in
   * @default [ profile ]
   */
  readonly scopes?: string[];
}

/**
 * Represents a identity provider that integrates with 'Google'
 * @resource AWS::Cognito::UserPoolIdentityProvider
 */
export class UserPoolIdentityProviderGoogle extends UserPoolIdentityProviderBase {
  public readonly providerName: string;

  constructor(scope: Construct, id: string, props: UserPoolIdentityProviderGoogleProps) {
    super(scope, id, props);

    const scopes = props.scopes ?? ['profile'];

    const resource = new CfnUserPoolIdentityProvider(this, 'Resource', {
      userPoolId: props.userPool.userPoolId,
      providerName: 'Google', // must be 'Google' when the type is 'Google'
      providerType: 'Google',
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