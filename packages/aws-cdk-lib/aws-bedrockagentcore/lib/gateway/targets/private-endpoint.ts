import type { CfnGatewayTarget } from '../../../../aws-bedrockagentcore';
import type { ISecurityGroup, IVpc, SubnetSelection } from '../../../../aws-ec2';
import { Token } from '../../../../core';
import { UnscopedValidationError } from '../../../../core/lib/errors';
import { lit } from '../../../../core/lib/helpers-internal';

/**
 * The IP address type of the VPC Lattice resource configuration endpoint.
 */
export enum EndpointIpAddressType {
  /**
   * IPv4 addresses.
   */
  IPV4 = 'IPV4',

  /**
   * IPv6 addresses.
   */
  IPV6 = 'IPV6',
}

/**
 * Options for a private endpoint that the gateway manages in your VPC.
 */
export interface PrivateEndpointFromVpcOptions {
  /**
   * The VPC that contains the target endpoint.
   */
  readonly vpc: IVpc;

  /**
   * The subnets where the VPC Lattice resource gateway is placed.
   *
   * @default - the default subnet selection of the VPC (private subnets if available)
   */
  readonly vpcSubnets?: SubnetSelection;

  /**
   * The security groups to associate with the VPC Lattice resource gateway.
   *
   * At most 5 security groups can be specified.
   *
   * @default - the default security group of the VPC
   */
  readonly securityGroups?: ISecurityGroup[];

  /**
   * The IP address type of the resource configuration endpoint.
   *
   * @default EndpointIpAddressType.IPV4
   */
  readonly ipAddressType?: EndpointIpAddressType;

  /**
   * An intermediate domain to use as the resource configuration endpoint instead
   * of the target domain.
   *
   * Use this to route traffic through an intermediate component such as a VPC
   * endpoint or an internal load balancer. Must be 3 to 255 characters long.
   *
   * @see https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-vpc-egress.html
   * @default - the domain of the target endpoint is used
   */
  readonly routingDomain?: string;

  /**
   * Tags to apply to the managed VPC Lattice resource gateway.
   *
   * At most 50 tags can be specified. The tag key `BedrockAgentCoreGatewayManaged`
   * is reserved.
   *
   * @default - no tags
   */
  readonly tags?: { [key: string]: string };
}

/**
 * A private endpoint that the gateway uses to reach a target in your VPC
 * through Amazon VPC Lattice, without exposing the target to the internet.
 *
 * Private endpoints are supported for MCP server and OpenAPI targets, and are
 * required to use certificate configurations on a target.
 *
 * @see https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-vpc-egress.html
 */
export abstract class PrivateEndpoint {
  /**
   * A private endpoint for which the gateway creates and manages the VPC Lattice
   * resource gateway and resource configuration in the given VPC.
   *
   * The gateway uses a service-linked role to manage these resources.
   *
   * @param options The VPC and network settings of the resource gateway
   */
  public static fromVpc(options: PrivateEndpointFromVpcOptions): PrivateEndpoint {
    return new ManagedVpcPrivateEndpoint(options);
  }

  /**
   * A private endpoint that uses a VPC Lattice resource configuration that you manage.
   *
   * @param resourceConfigurationIdentifier The ID or ARN of the VPC Lattice resource configuration
   */
  public static fromResourceConfiguration(resourceConfigurationIdentifier: string): PrivateEndpoint {
    return new SelfManagedLatticePrivateEndpoint(resourceConfigurationIdentifier);
  }

  /**
   * Renders the CloudFormation property.
   * @internal
   */
  public abstract _render(): CfnGatewayTarget.PrivateEndpointProperty;
}

const MAX_SECURITY_GROUPS = 5;
const MAX_TAGS = 50;
const RESERVED_TAG_KEY = 'BedrockAgentCoreGatewayManaged';

class ManagedVpcPrivateEndpoint extends PrivateEndpoint {
  constructor(private readonly options: PrivateEndpointFromVpcOptions) {
    super();
    const { securityGroups, routingDomain, tags } = options;
    if (securityGroups !== undefined && securityGroups.length > MAX_SECURITY_GROUPS) {
      throw new UnscopedValidationError(
        lit`PrivateEndpointTooManySecurityGroups`,
        `at most ${MAX_SECURITY_GROUPS} security groups can be specified for a private endpoint, got ${securityGroups.length}`,
      );
    }
    if (routingDomain !== undefined && !Token.isUnresolved(routingDomain)
      && (routingDomain.length < 3 || routingDomain.length > 255)) {
      throw new UnscopedValidationError(
        lit`PrivateEndpointRoutingDomainLength`,
        `routingDomain must be 3 to 255 characters long, got ${JSON.stringify(routingDomain)} (${routingDomain.length} characters)`,
      );
    }
    if (tags !== undefined && !Token.isUnresolved(tags) && RESERVED_TAG_KEY in tags) {
      throw new UnscopedValidationError(
        lit`PrivateEndpointReservedTagKey`,
        `the tag key ${JSON.stringify(RESERVED_TAG_KEY)} is reserved by Amazon Bedrock AgentCore and cannot be specified for a private endpoint`,
      );
    }
    if (tags !== undefined && !Token.isUnresolved(tags) && Object.keys(tags).length > MAX_TAGS) {
      throw new UnscopedValidationError(
        lit`PrivateEndpointTooManyTags`,
        `at most ${MAX_TAGS} tags can be specified for a private endpoint, got ${Object.keys(tags).length}`,
      );
    }
  }

  public _render(): CfnGatewayTarget.PrivateEndpointProperty {
    const { vpc, vpcSubnets, securityGroups, ipAddressType, routingDomain, tags } = this.options;
    return {
      managedVpcResource: {
        vpcIdentifier: vpc.vpcId,
        subnetIds: vpc.selectSubnets(vpcSubnets).subnetIds,
        securityGroupIds: securityGroups?.length ? securityGroups.map(sg => sg.securityGroupId) : undefined,
        endpointIpAddressType: ipAddressType ?? EndpointIpAddressType.IPV4,
        routingDomain,
        tags,
      },
    };
  }
}

class SelfManagedLatticePrivateEndpoint extends PrivateEndpoint {
  constructor(private readonly resourceConfigurationIdentifier: string) {
    super();
    if (!Token.isUnresolved(resourceConfigurationIdentifier) && resourceConfigurationIdentifier.length === 0) {
      throw new UnscopedValidationError(
        lit`PrivateEndpointResourceConfigurationEmpty`,
        'resourceConfigurationIdentifier must not be empty',
      );
    }
  }

  public _render(): CfnGatewayTarget.PrivateEndpointProperty {
    return {
      selfManagedLatticeResource: {
        resourceConfigurationIdentifier: this.resourceConfigurationIdentifier,
      },
    };
  }
}
