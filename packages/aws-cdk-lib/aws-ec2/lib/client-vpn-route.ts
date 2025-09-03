import { Construct } from 'constructs';
import { IClientVpnEndpoint } from './client-vpn-endpoint-types';
import { CfnClientVpnRoute, ISubnetRef } from './ec2.generated';
import { Resource, ValidationError } from '../../core';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { propertyInjectable } from '../../core/lib/prop-injectable';

/**
 * Options for a ClientVpnRoute
 */
export interface ClientVpnRouteOptions {
  /**
   * The IPv4 address range, in CIDR notation, of the route destination.
   *
   * For example:
   *   - To add a route for Internet access, enter 0.0.0.0/0
   *   - To add a route for a peered VPC, enter the peered VPC's IPv4 CIDR range
   *   - To add a route for an on-premises network, enter the AWS Site-to-Site VPN
   *     connection's IPv4 CIDR range
   *   - To add a route for the local network, enter the client CIDR range
   */
  readonly cidr: string;

  /**
   * A brief description of the authorization rule.
   *
   * @default - no description
   */
  readonly description?: string;

  /**
   * The target for the route
   */
  readonly target: ClientVpnRouteTarget;
}

/**
 * Target for a client VPN route
 */
export abstract class ClientVpnRouteTarget {
  /**
   * Subnet
   *
   * The specified subnet must be an existing target network of the client VPN
   * endpoint.
   */
  public static subnet(subnet: ISubnetRef): ClientVpnRouteTarget {
    return { subnetId: subnet.subnetRef.subnetId };
  }

  /**
   * Local network
   */
  public static local(): ClientVpnRouteTarget {
    return { subnetId: 'local' };
  }

  /** The subnet ID */
  public abstract readonly subnetId: string;
}

/**
 * Properties for a ClientVpnRoute
 */
export interface ClientVpnRouteProps extends ClientVpnRouteOptions {
  /**
   * The client VPN endpoint to which to add the route.
   * @default clientVpnEndpoint is required
   */
  readonly clientVpnEndpoint?: IClientVpnEndpoint;

  /**
   * The client VPN endpoint to which to add the route.
   * @deprecated Use `clientVpnEndpoint` instead
   * @default clientVpnEndpoint is required
   */
  readonly clientVpnEndoint?: IClientVpnEndpoint;
}

/**
 * A client VPN route
 */
@propertyInjectable
export class ClientVpnRoute extends Resource {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-ec2.ClientVpnRoute';

  constructor(scope: Construct, id: string, props: ClientVpnRouteProps) {
    if (!props.clientVpnEndoint && !props.clientVpnEndpoint) {
      throw new ValidationError(
        'ClientVpnRoute: either clientVpnEndpoint or clientVpnEndoint (deprecated) must be specified', scope,
      );
    }
    if (props.clientVpnEndoint && props.clientVpnEndpoint) {
      throw new ValidationError(
        'ClientVpnRoute: either clientVpnEndpoint or clientVpnEndoint (deprecated) must be specified' +
          ', but not both',
        scope,
      );
    }
    const clientVpnEndpoint = props.clientVpnEndoint || props.clientVpnEndpoint;
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);
    const route = new CfnClientVpnRoute(this, 'Resource', {
      clientVpnEndpointId: clientVpnEndpoint!.endpointId,
      description: props.description,
      destinationCidrBlock: props.cidr,
      targetVpcSubnetId: props.target.subnetId,
    });

    // See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-clientvpnroute.html
    route.node.addDependency(clientVpnEndpoint!.targetNetworksAssociated);
  }
}
