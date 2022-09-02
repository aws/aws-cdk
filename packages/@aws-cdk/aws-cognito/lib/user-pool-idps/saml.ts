import { Names, Token } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnUserPoolIdentityProvider } from '../cognito.generated';
import { UserPoolIdentityProviderProps } from './base';
import { UserPoolIdentityProviderBase } from './private/user-pool-idp-base';

/**
 * Properties to initialize UserPoolIdentityProviderSaml.
 */
export interface UserPoolIdentityProviderSamlProps extends UserPoolIdentityProviderProps {
  /**
   * The name of the provider.
   *
   * @default - the unique ID of the construct
   */
  readonly name?: string;

  /**
   * Identifiers
   *
   * Identifiers can be used to redirect users to the correct IdP in multitenant apps.
   *
   * @default - no identifiers used
   */
  readonly identifiers?: string[]

  /**
   * The SAML metadata file content.
   *
   * @default - no file content specified
   */
  readonly metadataFile?: string;

  /**
   * The SAML metadata URL.
   *
   * @default - no URL specified
   */
  readonly metadataUrl?: string;

  /**
   * Whether to enable the "Sign-out flow" feature.
   *
   * @default - false
   */
  readonly idpSignout?: boolean;
}

/**
 * Represents a identity provider that integrates with SAML.
 * @resource AWS::Cognito::UserPoolIdentityProvider
 */
export class UserPoolIdentityProviderSaml extends UserPoolIdentityProviderBase {
  public readonly providerName: string;

  constructor(scope: Construct, id: string, props: UserPoolIdentityProviderSamlProps) {
    super(scope, id, props);

    this.validateName(props.name);

    if ((props.metadataFile === undefined && props.metadataUrl === undefined) ||
        (props.metadataFile !== undefined && props.metadataUrl !== undefined)) {
      throw new Error('Specify exactly one of metadataUrl and metadataFile');
    }

    const resource = new CfnUserPoolIdentityProvider(this, 'Resource', {
      userPoolId: props.userPool.userPoolId,
      providerName: this.getProviderName(props.name),
      providerType: 'SAML',
      providerDetails: {
        IDPSignout: props.idpSignout ?? false,
        MetadataURL: props.metadataUrl,
        MetadataFile: props.metadataFile,
      },
      idpIdentifiers: props.identifiers,
      attributeMapping: super.configureAttributeMapping(),
    });

    this.providerName = super.getResourceNameAttribute(resource.ref);
  }

  private getProviderName(name?: string): string {
    if (name) {
      this.validateName(name);
      return name;
    }

    const uniqueName = Names.uniqueResourceName(this, {
      maxLength: 32,
    });

    if (uniqueName.length < 3) {
      return `${uniqueName}saml`;
    }

    return uniqueName;
  }

  private validateName(name?: string) {
    if (name && !Token.isUnresolved(name) && (name.length < 3 || name.length > 32)) {
      throw new Error(`Expected provider name to be between 3 and 32 characters, received ${name} (${name.length} characters)`);
    }
  }
}
