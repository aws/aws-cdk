import { CfnServiceNetwork } from 'aws-cdk-lib/aws-vpclattice';
import { Stack, ArnFormat } from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import { IService } from './service';
import { ServiceNetworkBase, IServiceNetwork } from './service-network-base';

/**
 * Authentication types for VPC Lattice service networks
 */
export enum ServiceNetworkAuthType {
  /**
   * No authentication
   */
  NONE = 'NONE',

  /**
   * AWS IAM authentication
   */
  AWS_IAM = 'AWS_IAM',
}

/**
 * Properties for creating a VPC Lattice service network
 */
export interface ServiceNetworkProps {
  /**
   * The name of the service network
   */
  readonly serviceNetworkName: string;

  /**
   * The authentication type for the service network
   *
   * @default ServiceNetworkAuthType.NONE
   */
  readonly authType?: ServiceNetworkAuthType;

  /**
   * Whether to enable sharing of the service network
   *
   * @default false
   */
  readonly enableSharing?: boolean;

  /**
   * Tags for the service network
   *
   * @default - No tags
   */
  readonly tags?: string;

  /**
   * Services to associate with the service network
   *
   * @default - No services
   */
  readonly services?: IService[];
}

/**
 * Attributes for importing an existing VPC Lattice service network
 */
export interface ServiceNetworkAttributes {
  /**
   * The ARN of the service network
   */
  readonly serviceNetworkArn: string;

  // TODO: restore ID? Constructing the ARN from the ID will need accountId, region, etc
  // readonly serviceNetworkId?: string;
}

/**
 * A VPC Lattice service network
 */
export class ServiceNetwork extends ServiceNetworkBase {
  /**
   * Import an existing VPC Lattice service network from its ARN
   *
   * @param scope The parent construct
   * @param id The construct ID
   * @param serviceNetworkArn The ARN of the service network
   * @returns A service network construct
   */
  public static fromServiceNetworkArn(scope: Construct, id: string, serviceNetworkArn: string): IServiceNetwork {
    return ServiceNetwork.fromServiceNetworkAttributes(scope, id, { serviceNetworkArn: serviceNetworkArn });
  }

  /**
   * Import an existing VPC Lattice service network from its attributes
   *
   * @param scope The parent construct
   * @param id The construct ID
   * @param attrs The service network attributes
   * @returns A service network construct
   */
  public static fromServiceNetworkAttributes(scope: Construct, id: string, attrs: ServiceNetworkAttributes): IServiceNetwork {
    class UnownedServiceNetworkReference extends ServiceNetworkBase {
      public readonly serviceNetworkArn: string = attrs.serviceNetworkArn;
      // Extract the serviceNetworkId from the ARN, which has the format `arn:aws:vpc-lattice:<region>:<account>:servicenetwork/<service-network-id>`
      public readonly serviceNetworkId: string = Stack.of(scope).splitArn(attrs.serviceNetworkArn, ArnFormat.SLASH_RESOURCE_NAME).resourceName!;
    }
    return new UnownedServiceNetworkReference(scope, id);
  }

  /**
   * The ARN of the service network
   * @attribute
   * @returns a token representing the service network ARN
   */
  public readonly serviceNetworkArn: string;

  /**
   * The ID of the service network
   * @attribute
   * @returns a token representing the service network ID
   */
  public readonly serviceNetworkId: string;

  /**
   * Creates a new VPC Lattice service network
   *
   * @param scope The parent construct
   * @param id The construct ID
   * @param props The service network properties
   */
  constructor(scope: Construct, id: string, props: ServiceNetworkProps) {
    super(scope, id);

    // TODO: validation?

    // TODO: tags

    const resource = new CfnServiceNetwork(this, id, {
      authType: props.authType,
      name: props.serviceNetworkName,
      sharingConfig: {
        enabled: props.enableSharing ?? false,
      },
    });

    this.serviceNetworkArn = resource.attrArn;
    this.serviceNetworkId = resource.attrId;

    // TODO: enforce at least one service? A service network without services is just...a network
    if (props.services) {
      this.associateServices(props.services);
    }
  }
}
