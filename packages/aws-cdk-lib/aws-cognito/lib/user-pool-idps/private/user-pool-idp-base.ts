import type { Construct } from 'constructs';
import { Resource } from '../../../../core';
import type { UserPoolIdentityProviderReference } from '../../../../interfaces/generated/aws-cognito-interfaces.generated';
import { StandardAttributeNames } from '../../private/attr-names';
import type { IUserPoolIdentityProvider } from '../../user-pool-idp';
import type { UserPoolIdentityProviderProps, AttributeMapping } from '../base';

/**
 * Options to integrate with the various social identity providers.
 *
 * @internal
 */
export abstract class UserPoolIdentityProviderBase extends Resource implements IUserPoolIdentityProvider {
  public abstract readonly providerName: string;

  public get userPoolIdentityProviderRef(): UserPoolIdentityProviderReference {
    return {
      userPoolId: this.props.userPool.userPoolRef.userPoolId,
      providerName: this.providerName,
    };
  }

  public constructor(scope: Construct, id: string, private readonly props: UserPoolIdentityProviderProps) {
    super(scope, id);
  }

  protected configureAttributeMapping(): any {
    if (!this.props.attributeMapping) {
      return undefined;
    }
    type SansCustom = Omit<AttributeMapping, 'custom'>;
    let mapping: { [key: string]: string } = {};
    mapping = Object.entries(this.props.attributeMapping)
      .filter(([k, _]) => k !== 'custom') // 'custom' handled later separately
      .reduce((agg, [k, v]) => {
        return { ...agg, [StandardAttributeNames[k as keyof SansCustom]]: v.attributeName };
      }, mapping);
    if (this.props.attributeMapping.custom) {
      mapping = Object.entries(this.props.attributeMapping.custom).reduce((agg, [k, v]) => {
        return { ...agg, [k]: v.attributeName };
      }, mapping);
    }
    if (Object.keys(mapping).length === 0) { return undefined; }
    return mapping;
  }
}
