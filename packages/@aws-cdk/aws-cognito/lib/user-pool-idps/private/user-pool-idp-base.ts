import { Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { StandardAttributeNames } from '../../private/attr-names';
import { IUserPoolIdentityProvider } from '../../user-pool-idp';
import { UserPoolIdentityProviderProps, AttributeMapping } from '../base';

/**
 * Options to integrate with the various social identity providers.
 *
 * @internal
 */
export abstract class UserPoolIdentityProviderBase extends Resource implements IUserPoolIdentityProvider {
  public abstract readonly providerName: string;

  public constructor(scope: Construct, id: string, private readonly props: UserPoolIdentityProviderProps) {
    super(scope, id);
    props.userPool.registerIdentityProvider(this);
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