import type { Construct } from 'constructs';
import { CfnNetworkConnector } from './lambda.generated';
import type * as ec2 from '../../aws-ec2';
import * as iam from '../../aws-iam';
import type { IResource } from '../../core';
import { Resource, Token, ValidationError } from '../../core';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { lit } from '../../core/lib/private/literal-string';
import { propertyInjectable } from '../../core/lib/prop-injectable';
import type { INetworkConnectorRef, NetworkConnectorReference } from '../../interfaces/generated/aws-lambda-interfaces.generated';

/**
 * Network protocol for a VPC egress network connector.
 */
export enum NetworkProtocol {
  /** IPv4 only */
  IPV4 = 'IPv4',
  /** Dual-stack */
  DUAL_STACK = 'DualStack',
}

/**
 * Lambda compute types that can use a network connector.
 */
export enum ComputeType {
  /** Lambda MicroVMs */
  MICROVMS = 'MicroVm',
}

/**
 * Configuration for a VPC egress network connector.
 */
export interface VpcEgressConfig {
  /**
   * The subnets in which to create ENIs for the network connector.
   *
   * Must contain between 1 and 16 subnets. All subnets must be in the same VPC.
   */
  readonly subnets: ec2.ISubnet[];

  /**
   * The security groups to attach to the ENIs.
   *
   * Must contain between 1 and 5 security groups. All must be in the same VPC as the subnets.
   */
  readonly securityGroups: ec2.ISecurityGroup[];

  /**
   * The network protocol for the connector.
   */
  readonly networkProtocol: NetworkProtocol;

  /**
   * The Lambda compute resource types that can use this connector.
   */
  readonly associatedComputeResourceTypes: ComputeType[];
}

/**
 * Configuration for a network connector.
 *
 * Use the static factory methods to create a configuration for the desired connector type.
 */
export class NetworkConnectorConfig {
  /**
   * Create a VPC egress configuration.
   */
  public static vpcEgress(config: VpcEgressConfig): NetworkConnectorConfig {
    return new NetworkConnectorConfig({ vpcEgressConfig: config });
  }

  /** @internal */
  public readonly _vpcEgressConfig?: VpcEgressConfig;

  private constructor(options: { vpcEgressConfig?: VpcEgressConfig }) {
    this._vpcEgressConfig = options.vpcEgressConfig;
  }
}

/**
 * Attributes for importing a NetworkConnector.
 */
export interface NetworkConnectorAttributes {
  /**
   * The ARN of the network connector.
   */
  readonly networkConnectorArn: string;
}

/**
 * Represents a Lambda Network Connector.
 */
export interface INetworkConnector extends IResource, INetworkConnectorRef {
  /**
   * The ARN of the network connector.
   * @attribute
   */
  readonly networkConnectorArn: string;
}

/**
 * Properties for creating a NetworkConnector.
 */
export interface NetworkConnectorProps {
  /**
   * A unique name for the network connector.
   *
   * Must be 1-64 characters, alphanumeric, hyphens, or underscores.
   *
   * @default - a CloudFormation-generated name
   */
  readonly networkConnectorName?: string;

  /**
   * The network configuration for the connector.
   *
   * Use `NetworkConnectorConfig.vpcEgress(...)` to create a VPC egress configuration.
   */
  readonly configuration: NetworkConnectorConfig;

  /**
   * The IAM role that Lambda assumes to manage ENIs in your VPC.
   *
   * The role must trust the `lambda.amazonaws.com` service principal.
   *
   * @default - a role is automatically created with the AWSLambdaNetworkConnectorOperatorPolicy managed policy
   */
  readonly operatorRole?: iam.IRole;
}

/**
 * Base class for NetworkConnector (shared by concrete and imported).
 */
abstract class NetworkConnectorBase extends Resource implements INetworkConnector {
  public abstract readonly networkConnectorArn: string;

  public get networkConnectorRef(): NetworkConnectorReference {
    return {
      networkConnectorArn: this.networkConnectorArn,
    };
  }
}

/**
 * A Lambda Network Connector.
 *
 * Network Connectors encapsulate networking configuration (subnets, security groups, protocol)
 * and AWS networking resources (ENIs) that can be associated with Lambda compute resources
 * (MicroVMs) to provide VPC connectivity.
 *
 * @resource AWS::Lambda::NetworkConnector
 */
@propertyInjectable
export class NetworkConnector extends NetworkConnectorBase {
  /**
   * Uniquely identifies this class for property injection.
   */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-lambda.NetworkConnector';

  /**
   * Import a network connector by ARN.
   */
  public static fromNetworkConnectorArn(
    scope: Construct,
    id: string,
    networkConnectorArn: string,
  ): INetworkConnector {
    return NetworkConnector.fromNetworkConnectorAttributes(scope, id, { networkConnectorArn });
  }

  /**
   * Import a network connector from its attributes.
   */
  public static fromNetworkConnectorAttributes(
    scope: Construct,
    id: string,
    attrs: NetworkConnectorAttributes,
  ): INetworkConnector {
    class Import extends NetworkConnectorBase {
      public readonly networkConnectorArn = attrs.networkConnectorArn;
    }
    return new Import(scope, id);
  }

  /**
   * The ARN of the network connector.
   * @attribute
   */
  public readonly networkConnectorArn: string;

  private readonly resource: CfnNetworkConnector;

  constructor(scope: Construct, id: string, props: NetworkConnectorProps) {
    super(scope, id, {
      physicalName: props.networkConnectorName,
    });

    addConstructMetadata(this, props);
    this.validateProps(props);

    const operatorRole = props.operatorRole ?? this.createOperatorRole();

    const vpcEgressConfig = props.configuration._vpcEgressConfig!;

    this.resource = new CfnNetworkConnector(this, 'Resource', {
      name: this.physicalName,
      configuration: {
        vpcEgressConfiguration: {
          subnetIds: vpcEgressConfig.subnets.map(s => s.subnetId),
          securityGroupIds: vpcEgressConfig.securityGroups.map(sg => sg.securityGroupId),
          networkProtocol: vpcEgressConfig.networkProtocol,
          associatedComputeResourceTypes: vpcEgressConfig.associatedComputeResourceTypes.map(c => c.toString()),
        },
      },
      operatorRole: operatorRole.roleArn,
    });

    this.networkConnectorArn = this.resource.attrArn;
  }

  private createOperatorRole(): iam.IRole {
    return new iam.Role(this, 'OperatorRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('AWSLambdaNetworkConnectorOperatorPolicy'),
      ],
    });
  }

  private validateProps(props: NetworkConnectorProps): void {
    const vpcEgressConfig = props.configuration._vpcEgressConfig!;

    // Validate name
    if (props.networkConnectorName !== undefined && !Token.isUnresolved(props.networkConnectorName)) {
      if (props.networkConnectorName.length > 64) {
        throw new ValidationError(
          lit`NetworkConnectorNameLength`,
          `networkConnectorName must be at most 64 characters, got ${props.networkConnectorName.length}`,
          this,
        );
      }
      if (!/^[a-zA-Z0-9_-]+$/.test(props.networkConnectorName)) {
        throw new ValidationError(
          lit`NetworkConnectorNamePattern`,
          'networkConnectorName must contain only alphanumeric characters, hyphens, and underscores',
          this,
        );
      }
    }

    // Validate subnets
    const subnetIds = vpcEgressConfig.subnets.map(s => s.subnetId);
    if (!Token.isUnresolved(subnetIds) && (vpcEgressConfig.subnets.length < 1 || vpcEgressConfig.subnets.length > 16)) {
      throw new ValidationError(
        lit`NetworkConnectorSubnetsCount`,
        `subnets must contain between 1 and 16 items, got ${vpcEgressConfig.subnets.length}`,
        this,
      );
    }

    // Validate security groups
    const sgIds = vpcEgressConfig.securityGroups.map(sg => sg.securityGroupId);
    if (!Token.isUnresolved(sgIds) && (vpcEgressConfig.securityGroups.length < 1 || vpcEgressConfig.securityGroups.length > 5)) {
      throw new ValidationError(
        lit`NetworkConnectorSecurityGroupsCount`,
        `securityGroups must contain between 1 and 5 items, got ${vpcEgressConfig.securityGroups.length}`,
        this,
      );
    }
  }
}
