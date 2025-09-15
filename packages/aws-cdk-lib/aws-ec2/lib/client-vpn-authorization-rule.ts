import { Construct } from 'constructs';
import { CfnClientVpnAuthorizationRule, IClientVpnEndpointRef } from './ec2.generated';
import { Resource, ValidationError } from '../../core';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { propertyInjectable } from '../../core/lib/prop-injectable';

/**
 * Options for a ClientVpnAuthorizationRule
 */
export interface ClientVpnAuthorizationRuleOptions {
  /**
   * The IPv4 address range, in CIDR notation, of the network for which access
   * is being authorized.
   */
  readonly cidr: string;

  /**
   * The ID of the group to grant access to, for example, the Active Directory
   * group or identity provider (IdP) group.
   *
   * @default - authorize all groups
   */
  readonly groupId?: string;

  /**
   * A brief description of the authorization rule.
   *
   * @default - no description
   */
  readonly description?: string;
}

/**
 * Properties for a ClientVpnAuthorizationRule
 */
export interface ClientVpnAuthorizationRuleProps extends ClientVpnAuthorizationRuleOptions {
  /**
   * The client VPN endpoint to which to add the rule.
   * @default clientVpnEndpoint is required
   */
  readonly clientVpnEndpoint?: IClientVpnEndpointRef;

  /**
   * The client VPN endpoint to which to add the rule.
   * @deprecated Use `clientVpnEndpoint` instead
   * @default clientVpnEndpoint is required
   */
  readonly clientVpnEndoint?: IClientVpnEndpointRef;
}

/**
 * A client VPN authorization rule
 */
@propertyInjectable
export class ClientVpnAuthorizationRule extends Resource {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-ec2.ClientVpnAuthorizationRule';

  constructor(scope: Construct, id: string, props: ClientVpnAuthorizationRuleProps) {
    if (!props.clientVpnEndoint && !props.clientVpnEndpoint) {
      throw new ValidationError(
        'ClientVpnAuthorizationRule: either clientVpnEndpoint or clientVpnEndoint (deprecated) must be specified',
        scope,
      );
    }
    if (props.clientVpnEndoint && props.clientVpnEndpoint) {
      throw new ValidationError(
        'ClientVpnAuthorizationRule: either clientVpnEndpoint or clientVpnEndoint (deprecated) must be specified' +
          ', but not both',
        scope,
      );
    }
    const clientVpnEndpoint = props.clientVpnEndoint || props.clientVpnEndpoint;
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);
    new CfnClientVpnAuthorizationRule(this, 'Resource', {
      clientVpnEndpointId: clientVpnEndpoint!.clientVpnEndpointRef.clientVpnEndpointId,
      targetNetworkCidr: props.cidr,
      accessGroupId: props.groupId,
      authorizeAllGroups: !props.groupId,
      description: props.description,
    });
  }
}
