import { Construct } from 'constructs';
import { Connections, IConnectable } from './connections';
import { CfnLaunchTemplate } from './ec2.generated';
import { InstanceType } from './instance-types';
import { IKeyPair } from './key-pair';
import {
  IMachineImage,
  MachineImageConfig,
  OperatingSystemType,
} from './machine-image';
import { IPlacementGroup } from './placement-group';
import { launchTemplateBlockDeviceMappings } from './private/ebs-util';
import { ISecurityGroup } from './security-group';
import { UserData } from './user-data';
import { BlockDevice } from './volume';
import { ISubnet } from './vpc';
import * as iam from '../../aws-iam';
import {
  Annotations,
  Duration,
  Expiration,
  Fn,
  IResource,
  Lazy,
  Resource,
  TagManager,
  TagType,
  Tags,
  Token,
  FeatureFlags,
  ValidationError,
} from '../../core';
import {
  addConstructMetadata,
  MethodMetadata,
} from '../../core/lib/metadata-resource';
import * as cxapi from '../../cx-api';

/**
 * Name tag constant
 */
const NAME_TAG: string = 'Name';

/**
 * Provides the options for specifying the CPU credit type for burstable EC2 instance types (T2, T3, T3a, etc).
 *
 * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/burstable-performance-instances-how-to.html
 */
// dev-note: This could be used in the Instance L2
export enum CpuCredits {
  /**
   * Standard bursting mode.
   * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/burstable-performance-instances-standard-mode.html
   */
  STANDARD = 'standard',

  /**
   * Unlimited bursting mode.
   * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/burstable-performance-instances-unlimited-mode.html
   */
  UNLIMITED = 'unlimited',
}

/**
 * Provides the options for specifying the instance initiated shutdown behavior.
 *
 * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/terminating-instances.html#Using_ChangingInstanceInitiatedShutdownBehavior
 */
// dev-note: This could be used in the Instance L2
export enum InstanceInitiatedShutdownBehavior {
  /**
   * The instance will stop when it initiates a shutdown.
   */
  STOP = 'stop',

  /**
   * The instance will be terminated when it initiates a shutdown.
   */
  TERMINATE = 'terminate',
}

/**
 * InterfaceType
 */
export enum InterfaceType {
  /**
   * efa
   *
   * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html
   */
  EFA = 'efa',

  /**
   * interface
   */
  INTERFACE = 'interface',
}

/**
 * A security group connection tracking specification that enables you to set the idle timeout for connection tracking on an Elastic network interface.
 *
 * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/security-group-connection-tracking.html#connection-tracking-timeouts
 */
export interface ConnectionTrackingSpecification extends CfnLaunchTemplate.ConnectionTrackingSpecificationProperty {}

/**
 * ENA Express uses AWS Scalable Reliable Datagram (SRD) technology to increase the maximum bandwidth used per stream and minimize tail latency of network traffic between EC2 instances.
 *
 * With ENA Express, you can communicate between two EC2 instances in the same subnet within the same account, or in different accounts. Both sending and receiving instances must have ENA Express enabled.
 *
 * To improve the reliability of network packet delivery, ENA Express reorders network packets on the receiving end by default. However, some UDP-based applications are designed to handle network packets that are out of order to reduce the overhead for packet delivery at the network layer. When ENA Express is enabled, you can specify whether UDP network traffic uses it.
 */
export interface EnaSrdSpecification
  extends CfnLaunchTemplate.EnaSrdSpecificationProperty { }

/**
 * Specifies an IPv4 prefix for a network interface.
 */
export interface Ipv4PrefixSpecification
  extends CfnLaunchTemplate.Ipv4PrefixSpecificationProperty { }

/**
 * Specifies an IPv6 address in an Amazon EC2 launch template.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-launchtemplate-networkinterface.html
 */
export interface Ipv6Add extends CfnLaunchTemplate.Ipv6AddProperty { }

/**
 * Specifies an IPv6 prefix for a network interface.
 */
export interface Ipv6PrefixSpecification
  extends CfnLaunchTemplate.Ipv6PrefixSpecificationProperty { }

/**
 * Specifies a secondary private IPv4 address for a network interface.
 */
export interface PrivateIpAdd extends CfnLaunchTemplate.PrivateIpAddProperty { }

/**
 * Specifies the parameters for a Launch Template network interface definition.
 */
export interface NetworkInterface {
  /**
   * Associates a Carrier IP address with eth0 for a new network interface.
   *
   * Use this option when you launch an instance in a Wavelength Zone and want to associate a Carrier IP address with the network interface. For more information about Carrier IP addresses, see Carrier IP addresses in the AWS Wavelength Developer Guide.
   *
   * @default No carrier IP address is assigned
   */
  readonly associateCarrierIpAddress?: boolean;

  /**
   * Associates a public IPv4 address with eth0 for a new network interface. Note that when multiple network interface cards are defined, this value must be `false` on all of them.
   *
   * @default No public IPv4 address is assigned
   */
  readonly associatePublicIpAddress?: boolean;

  /**
   * A connection tracking specification for the network interface.
   *
   * @default Default connection tracking timeouts are used.
   * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/security-group-connection-tracking.html#connection-tracking-timeouts
   */
  readonly connectionTrackingSpecification?: ConnectionTrackingSpecification;

  /**
   * Indicates whether the network interface is deleted when the instance is terminated.
   *
   * @default The network interface is deleted when the instance is terminated.
   */
  readonly deleteOnTermination?: boolean;

  /**
   * A description for the network interface.
   *
   * @default An empty string.
   */
  readonly description?: string;

  /**
   * The device index for the network interface attachment.
   *
   * @default Index is `0`
   */
  readonly deviceIndex: number;

  /**
   * The ENA Express configuration for the network interface.
   *
   * @default EnaSrd is not enabled
   */
  readonly enaSrdSpecification?: EnaSrdSpecification;

  /**
   * One or more security groups to attach to the interface.
   *
   * @default No security groups are attached to the interface.
   */
  readonly groups?: ISecurityGroup[];

  /**
   * The type of network interface. To create an Elastic Fabric Adapter (EFA), specify `InterfaceType.efa`. For more information, see Elastic Fabric Adapter in the Amazon Elastic Compute Cloud User Guide.
   *
   * @default Interface type is `InterfaceType.INTERFACE`.
   */
  readonly interfaceType?: InterfaceType;

  /**
   * The number of IPv4 prefixes to be automatically assigned to the network interface. You cannot use this option if you use the Ipv4Prefix option.
   *
   * @default One prefix is assigned
   */
  readonly ipv4PrefixCount?: number;

  /**
   * One or more IPv4 prefixes to be assigned to the network interface. You cannot use this option if you use the Ipv4PrefixCount option.
   *
   * @default A single prefix is assigned via `ipv4PrefixCount`
   */
  readonly ipv4Prefixes?: Ipv4PrefixSpecification[];

  /**
   * The number of IPv6 addresses to assign to a network interface. Amazon EC2 automatically selects the IPv6 addresses from the subnet range. You can't use this option if specifying specific IPv6 addresses.
   *
   * @default No IPv6 addresses are assigned.
   */
  readonly ipv6AddressCount?: number;

  /**
   * One or more specific IPv6 addresses from the IPv6 CIDR block range of your subnet. You can't use this option if you're specifying a number of IPv6 addresses.
   *
   * @default No IPv6 addresses are assigned.
   */
  readonly ipv6Addresses?: Ipv6Add[];

  /**
   * The number of IPv6 prefixes to be automatically assigned to the network interface. You cannot use this option if you use the Ipv6Prefix option.
   *
   * @default No prefixes are assigned.
   */
  readonly ipv6PrefixCount?: number;

  /**
   * One or more IPv6 prefixes to be assigned to the network interface. You cannot use this option if you use the Ipv6PrefixCount option.
   *
   * @default No prefixes are assigned.
   */
  readonly ipv6Prefixes?: Ipv6PrefixSpecification[];

  /**
   * The index of the network card. Some instance types support multiple network cards. The primary network interface must be assigned to network card index 0. The default is network card index 0.
   *
   * @default First network interface card gets assigned index `0`.
   */
  readonly networkCardIndex?: number;

  /**
   * The primary IPv6 address of the network interface. When you enable an IPv6 GUA address to be a primary IPv6, the first IPv6 GUA will be made the primary IPv6 address until the instance is terminated or the network interface is detached. For more information about primary IPv6 addresses, see RunInstances.
   *
   * @default First IPv6 address is made primary.
   */
  readonly primaryIpv6?: boolean;

  /**
   * The primary private IPv4 address of the network interface.
   *
   * @default A random IP address is assigned from one of the subnets.
   */
  readonly privateIpAddress?: string;

  /**
   * One or more private IPv4 addresses.
   *
   * @default A random IP address is assigned from one of the subnets.
   */
  readonly privateIpAddresses?: PrivateIpAdd[];

  /**
   * The number of secondary private IPv4 addresses to assign to a network interface.
   *
   * @default No secondary addresses are assigned
   */
  readonly secondaryPrivateIpAddressCount?: number;

  /**
   * List of subnets to which to place the interface in
   *
   * @default No subnets are defined.
   */
  readonly subnet?: ISubnet;
}

function synthesizeNetworkInterfaces(
  networkInterfaces: NetworkInterface[],
): CfnLaunchTemplate.NetworkInterfaceProperty[] {
  return networkInterfaces.map((networkInterface) => {
    return {
      ...networkInterface,
      groups: Lazy.list({
        produce: () => {
          return networkInterface.groups
            ? networkInterface.groups.map((sg) => sg.securityGroupId)
            : undefined;
        },
      }),
      subnetId: Lazy.string({
        produce: () => {
          return networkInterface.subnet
            ? networkInterface.subnet.subnetId
            : undefined;
        },
      }),
    };
  });
}

/**
 * Interface for LaunchTemplate-like objects.
 */
export interface ILaunchTemplate extends IResource {
  /**
   * The version number of this launch template to use
   *
   * @attribute
   */
  readonly versionNumber: string;

  /**
   * The identifier of the Launch Template
   *
   * Exactly one of `launchTemplateId` and `launchTemplateName` will be set.
   *
   * @attribute
   */
  readonly launchTemplateId?: string;

  /**
   * The name of the Launch Template
   *
   * Exactly one of `launchTemplateId` and `launchTemplateName` will be set.
   *
   * @attribute
   */
  readonly launchTemplateName?: string;
}

/**
 * Provides the options for the types of interruption for spot instances.
 */
// dev-note: This could be used in a SpotFleet L2 if one gets developed.
export enum SpotInstanceInterruption {
  /**
   * The instance will stop when interrupted.
   */
  STOP = 'stop',

  /**
   * The instance will be terminated when interrupted.
   */
  TERMINATE = 'terminate',

  /**
   * The instance will hibernate when interrupted.
   */
  HIBERNATE = 'hibernate',
}

/**
 * The Spot Instance request type.
 *
 * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/spot-requests.html
 */
export enum SpotRequestType {
  /**
   * A one-time Spot Instance request remains active until Amazon EC2 launches the Spot Instance,
   * the request expires, or you cancel the request. If the Spot price exceeds your maximum price
   * or capacity is not available, your Spot Instance is terminated and the Spot Instance request
   * is closed.
   */
  ONE_TIME = 'one-time',

  /**
   * A persistent Spot Instance request remains active until it expires or you cancel it, even if
   * the request is fulfilled. If the Spot price exceeds your maximum price or capacity is not available,
   * your Spot Instance is interrupted. After your instance is interrupted, when your maximum price exceeds
   * the Spot price or capacity becomes available again, the Spot Instance is started if stopped or resumed
   * if hibernated.
   */
  PERSISTENT = 'persistent',
}

/**
 * Interface for the Spot market instance options provided in a LaunchTemplate.
 */
export interface LaunchTemplateSpotOptions {
  /**
   * Spot Instances with a defined duration (also known as Spot blocks) are designed not to be interrupted and will run continuously for the duration you select.
   * You can use a duration of 1, 2, 3, 4, 5, or 6 hours.
   *
   * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/spot-requests.html#fixed-duration-spot-instances
   *
   * @default Requested spot instances do not have a pre-defined duration.
   */
  readonly blockDuration?: Duration;

  /**
   * The behavior when a Spot Instance is interrupted.
   *
   * @default Spot instances will terminate when interrupted.
   */
  readonly interruptionBehavior?: SpotInstanceInterruption;

  /**
   * Maximum hourly price you're willing to pay for each Spot instance. The value is given
   * in dollars. ex: 0.01 for 1 cent per hour, or 0.001 for one-tenth of a cent per hour.
   *
   * @default Maximum hourly price will default to the on-demand price for the instance type.
   */
  readonly maxPrice?: number;

  /**
   * The Spot Instance request type.
   *
   * If you are using Spot Instances with an Auto Scaling group, use one-time requests, as the
   * Amazon EC2 Auto Scaling service handles requesting new Spot Instances whenever the group is
   * below its desired capacity.
   *
   * @default One-time spot request.
   */
  readonly requestType?: SpotRequestType;

  /**
   * The end date of the request. For a one-time request, the request remains active until all instances
   * launch, the request is canceled, or this date is reached. If the request is persistent, it remains
   * active until it is canceled or this date and time is reached.
   *
   * @default The default end date is 7 days from the current date.
   */
  readonly validUntil?: Expiration;
}

/**
 * The state of token usage for your instance metadata requests.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-launchtemplate-launchtemplatedata-metadataoptions.html#cfn-ec2-launchtemplate-launchtemplatedata-metadataoptions-httptokens
 */
export enum LaunchTemplateHttpTokens {
  /**
   * If the state is optional, you can choose to retrieve instance metadata with or without a signed token header on your request.
   */
  OPTIONAL = 'optional',
  /**
   * If the state is required, you must send a signed token header with any instance metadata retrieval requests. In this state,
   * retrieving the IAM role credentials always returns the version 2.0 credentials; the version 1.0 credentials are not available.
   */
  REQUIRED = 'required',
}

/**
 * Properties of a LaunchTemplate.
 */
export interface LaunchTemplateProps {
  /**
   * Name for this launch template.
   *
   * @default Automatically generated name
   */
  readonly launchTemplateName?: string;

  /**
   * A description for the first version of the launch template.
   *
   * The version description must be maximum 255 characters long.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-launchtemplate.html#cfn-ec2-launchtemplate-versiondescription
   *
   * @default - No description
   */
  readonly versionDescription?: string;

  /**
   * Type of instance to launch.
   *
   * @default - This Launch Template does not specify a default Instance Type.
   */
  readonly instanceType?: InstanceType;

  /**
   * The AMI that will be used by instances.
   *
   * @default - This Launch Template does not specify a default AMI.
   */
  readonly machineImage?: IMachineImage;

  /**
   * The AMI that will be used by instances.
   *
   * @default - This Launch Template creates a UserData based on the type of provided
   * machineImage; no UserData is created if a machineImage is not provided
   */
  readonly userData?: UserData;

  /**
   * An IAM role to associate with the instance profile that is used by instances.
   *
   * The role must be assumable by the service principal `ec2.amazonaws.com`.
   * Note: You can provide an instanceProfile or a role, but not both.
   *
   * @example
   * const role = new iam.Role(this, 'MyRole', {
   *   assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com')
   * });
   *
   * @default - No new role is created.
   */
  readonly role?: iam.IRole;

  /**
   * Specifies how block devices are exposed to the instance. You can specify virtual devices and EBS volumes.
   *
   * Each instance that is launched has an associated root device volume,
   * either an Amazon EBS volume or an instance store volume.
   * You can use block device mappings to specify additional EBS volumes or
   * instance store volumes to attach to an instance when it is launched.
   *
   * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/block-device-mapping-concepts.html
   *
   * @default - Uses the block device mapping of the AMI
   */
  readonly blockDevices?: BlockDevice[];

  /**
   * CPU credit type for burstable EC2 instance types.
   *
   * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/burstable-performance-instances.html
   *
   * @default - No credit type is specified in the Launch Template.
   */
  readonly cpuCredits?: CpuCredits;

  /**
   * If you set this parameter to true, you cannot terminate the instances launched with this launch template
   * using the Amazon EC2 console, CLI, or API; otherwise, you can.
   *
   * @default - The API termination setting is not specified in the Launch Template.
   */
  readonly disableApiTermination?: boolean;

  /**
   * Indicates whether the instances are optimized for Amazon EBS I/O. This optimization provides dedicated throughput
   * to Amazon EBS and an optimized configuration stack to provide optimal Amazon EBS I/O performance. This optimization
   * isn't available with all instance types. Additional usage charges apply when using an EBS-optimized instance.
   *
   * @default - EBS optimization is not specified in the launch template.
   */
  readonly ebsOptimized?: boolean;

  /**
   * If this parameter is set to true, the instance is enabled for AWS Nitro Enclaves; otherwise, it is not enabled for AWS Nitro Enclaves.
   *
   * @default - Enablement of Nitro enclaves is not specified in the launch template; defaulting to false.
   */
  readonly nitroEnclaveEnabled?: boolean;

  /**
   * If you set this parameter to true, the instance is enabled for hibernation.
   *
   * @default - Hibernation configuration is not specified in the launch template; defaulting to false.
   */
  readonly hibernationConfigured?: boolean;

  /**
   * Indicates whether an instance stops or terminates when you initiate shutdown from the instance (using the operating system command for system shutdown).
   *
   * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/terminating-instances.html#Using_ChangingInstanceInitiatedShutdownBehavior
   *
   * @default - Shutdown behavior is not specified in the launch template; defaults to STOP.
   */
  readonly instanceInitiatedShutdownBehavior?: InstanceInitiatedShutdownBehavior;

  /**
   * If this property is defined, then the Launch Template's InstanceMarketOptions will be
   * set to use Spot instances, and the options for the Spot instances will be as defined.
   *
   * @default - Instance launched with this template will not be spot instances.
   */
  readonly spotOptions?: LaunchTemplateSpotOptions;

  /**
   * Name of SSH keypair to grant access to instance
   *
   * @default - No SSH access will be possible.
   * @deprecated - Use `keyPair` instead - https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ec2-readme.html#using-an-existing-ec2-key-pair
   */
  readonly keyName?: string;

  /**
   * The SSH keypair to grant access to the instance.
   *
   * @default - No SSH access will be possible.
   */
  readonly keyPair?: IKeyPair;

  /**
   * If set to true, then detailed monitoring will be enabled on instances created with this
   * launch template.
   *
   * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-cloudwatch-new.html
   *
   * @default False - Detailed monitoring is disabled.
   */
  readonly detailedMonitoring?: boolean;

  /**
   * Security group to assign to instances created with the launch template.
   *
   * @default No security group is assigned.
   */
  readonly securityGroup?: ISecurityGroup;

  /**
   * Whether IMDSv2 should be required on launched instances.
   *
   * @default - false
   */
  readonly requireImdsv2?: boolean;

  /**
   * Enables or disables the HTTP metadata endpoint on your instances.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-launchtemplate-launchtemplatedata-metadataoptions.html#cfn-ec2-launchtemplate-launchtemplatedata-metadataoptions-httpendpoint
   *
   * @default true
   */
  readonly httpEndpoint?: boolean;

  /**
   * Enables or disables the IPv6 endpoint for the instance metadata service.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-launchtemplate-launchtemplatedata-metadataoptions.html#cfn-ec2-launchtemplate-launchtemplatedata-metadataoptions-httpprotocolipv6
   *
   * @default true
   */
  readonly httpProtocolIpv6?: boolean;

  /**
   * The desired HTTP PUT response hop limit for instance metadata requests. The larger the number, the further instance metadata requests can travel.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-launchtemplate-launchtemplatedata-metadataoptions.html#cfn-ec2-launchtemplate-launchtemplatedata-metadataoptions-httpputresponsehoplimit
   *
   * @default 1
   */
  readonly httpPutResponseHopLimit?: number;

  /**
   * The state of token usage for your instance metadata requests.  The default state is `optional` if not specified. However,
   * if requireImdsv2 is true, the state must be `required`.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-launchtemplate-launchtemplatedata-metadataoptions.html#cfn-ec2-launchtemplate-launchtemplatedata-metadataoptions-httptokens
   *
   * @default LaunchTemplateHttpTokens.OPTIONAL
   */
  readonly httpTokens?: LaunchTemplateHttpTokens;

  /**
   * Set to enabled to allow access to instance tags from the instance metadata. Set to disabled to turn off access to instance tags from the instance metadata.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-launchtemplate-launchtemplatedata-metadataoptions.html#cfn-ec2-launchtemplate-launchtemplatedata-metadataoptions-instancemetadatatags
   *
   * @default false
   */
  readonly instanceMetadataTags?: boolean;

  /**
   * Whether instances should have a public IP addresses associated with them.
   *
   * @default - Use subnet settings
   */
  readonly associatePublicIpAddress?: boolean;

  /**
   * The instance profile used to pass role information to EC2 instances.
   *
   * Note: You can provide an instanceProfile or a role, but not both.
   *
   * @default - No instance profile
   */
  readonly instanceProfile?: iam.IInstanceProfile;

  /**
   * The placement group that you want to launch the instance into.
   *
   * @default - no placement group will be used for this launch template.
   */
  readonly placementGroup?: IPlacementGroup;

  /**
   * Network interface definitions for the EC2 instances.
   *
   * Note: If defined, overrides settings `associatePublicIpAddress` and `securityGroup`.
   *
   * @default: A single network interface using `associatePublicIpAddress` and `securityGroup`is created
   */
  readonly networkInterfaces?: NetworkInterface[];
}

/**
 * A class that provides convenient access to special version tokens for LaunchTemplate
 * versions.
 */
export class LaunchTemplateSpecialVersions {
  /**
   * The special value that denotes that users of a Launch Template should
   * reference the LATEST version of the template.
   */
  public static readonly LATEST_VERSION: string = '$Latest';

  /**
   * The special value that denotes that users of a Launch Template should
   * reference the DEFAULT version of the template.
   */
  public static readonly DEFAULT_VERSION: string = '$Default';
}

/**
 * Attributes for an imported LaunchTemplate.
 */
export interface LaunchTemplateAttributes {
  /**
   * The version number of this launch template to use
   *
   * @default Version: "$Default"
   */
  readonly versionNumber?: string;

  /**
   * The identifier of the Launch Template
   *
   * Exactly one of `launchTemplateId` and `launchTemplateName` may be set.
   *
   * @default None
   */
  readonly launchTemplateId?: string;

  /**
   * The name of the Launch Template
   *
   * Exactly one of `launchTemplateId` and `launchTemplateName` may be set.
   *
   * @default None
   */
  readonly launchTemplateName?: string;
}

/**
 * This represents an EC2 LaunchTemplate.
 *
 * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-launch-templates.html
 */
export class LaunchTemplate
  extends Resource
  implements ILaunchTemplate, iam.IGrantable, IConnectable {
  /**
   * Import an existing LaunchTemplate.
   */
  public static fromLaunchTemplateAttributes(
    scope: Construct,
    id: string,
    attrs: LaunchTemplateAttributes,
  ): ILaunchTemplate {
    const haveId = Boolean(attrs.launchTemplateId);
    const haveName = Boolean(attrs.launchTemplateName);
    if (haveId == haveName) {
      throw new ValidationError(
        'LaunchTemplate.fromLaunchTemplateAttributes() requires exactly one of launchTemplateId or launchTemplateName be provided.',
        scope,
      );
    }

    class Import extends Resource implements ILaunchTemplate {
      public readonly versionNumber =
        attrs.versionNumber ?? LaunchTemplateSpecialVersions.DEFAULT_VERSION;
      public readonly launchTemplateId? = attrs.launchTemplateId;
      public readonly launchTemplateName? = attrs.launchTemplateName;
    }
    return new Import(scope, id);
  }

  // ============================================
  //   Members for ILaunchTemplate interface

  public readonly versionNumber: string;
  public readonly launchTemplateId?: string;
  public readonly launchTemplateName?: string;

  // =============================================
  //   Data members

  /**
   * The default version for the launch template.
   *
   * @attribute
   */
  public readonly defaultVersionNumber: string;

  /**
   * The latest version of the launch template.
   *
   * @attribute
   */
  public readonly latestVersionNumber: string;

  /**
   * The type of OS the instance is running.
   *
   * @attribute
   */
  public readonly osType?: OperatingSystemType;

  /**
   * The AMI ID of the image to use
   *
   * @attribute
   */
  public readonly imageId?: string;

  /**
   * IAM Role assumed by instances that are launched from this template.
   *
   * @attribute
   */
  public readonly role?: iam.IRole;

  /**
   * UserData executed by instances that are launched from this template.
   *
   * @attribute
   */
  public readonly userData?: UserData;

  /**
   * Type of instance to launch.
   *
   * @attribute
   */
  public readonly instanceType?: InstanceType;

  // =============================================
  //   Private/protected data members

  /**
   * Principal to grant permissions to.
   * @internal
   */
  protected readonly _grantPrincipal?: iam.IPrincipal;

  /**
   * Allows specifying security group connections for the instance.
   * @internal
   */
  protected readonly _connections?: Connections;

  /**
   * TagManager for tagging support.
   */
  protected readonly tags: TagManager;

  // =============================================

  constructor(scope: Construct, id: string, props: LaunchTemplateProps = {}) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    // Basic validation of the provided spot block duration
    const spotDuration = props?.spotOptions?.blockDuration?.toHours({
      integral: true,
    });
    if (spotDuration !== undefined && (spotDuration < 1 || spotDuration > 6)) {
      // See: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/spot-requests.html#fixed-duration-spot-instances
      Annotations.of(this).addError(
        'Spot block duration must be exactly 1, 2, 3, 4, 5, or 6 hours.',
      );
    }

    // Basic validation of the provided httpPutResponseHopLimit
    if (
      props.httpPutResponseHopLimit !== undefined &&
      (props.httpPutResponseHopLimit < 1 || props.httpPutResponseHopLimit > 64)
    ) {
      // See: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-launchtemplate-launchtemplatedata-metadataoptions.html#cfn-ec2-launchtemplate-launchtemplatedata-metadataoptions-httpputresponsehoplimit
      Annotations.of(this).addError(
        'HttpPutResponseHopLimit must between 1 and 64',
      );
    }

    // Basic validation of the provided network interface cards
    if (props.networkInterfaces && props.networkInterfaces.length > 1) {
      if (
        !props.networkInterfaces.every((nic) => !nic.associatePublicIpAddress)
      ) {
        Annotations.of(this).addError(
          'associatePublicIpAddress must be `false` or `undefined` when defining multiple network interfaces',
        );
      }
    }

    // Basic validation of the provided network interface cards
    if (props.networkInterfaces && props.networkInterfaces.length > 1) {
      if (!props.networkInterfaces.every((nic) => !nic.associatePublicIpAddress)) {
        Annotations.of(this).addError('associatePublicIpAddress must be `false` or `undefined` when defining multiple network interfaces');
      }
    }

    if (props.instanceProfile && props.role) {
      throw new ValidationError(
        'You cannot provide both an instanceProfile and a role',
        this,
      );
    }

    if (props.keyName && props.keyPair) {
      throw new ValidationError(
        "Cannot specify both of 'keyName' and 'keyPair'; prefer 'keyPair'",
        this,
      );
    }

    // use provided instance profile or create one if a role was provided
    let iamProfileArn: string | undefined = undefined;
    if (props.instanceProfile) {
      this.role = props.instanceProfile.role;
      iamProfileArn = props.instanceProfile.instanceProfileArn;
    } else if (props.role) {
      this.role = props.role;
      const iamProfile = new iam.CfnInstanceProfile(this, 'Profile', {
        roles: [this.role.roleName],
      });
      iamProfileArn = iamProfile.attrArn;
    }

    this._grantPrincipal = this.role;

    if (props.securityGroup) {
      this._connections = new Connections({
        securityGroups: [props.securityGroup],
      });
    }
    const securityGroupsToken = Lazy.list({
      produce: () => {
        if (this._connections && this._connections.securityGroups.length > 0) {
          return this._connections.securityGroups.map(
            (sg) => sg.securityGroupId,
          );
        }
        return undefined;
      },
    });

    const imageConfig: MachineImageConfig | undefined =
      props.machineImage?.getImage(this);
    if (imageConfig) {
      this.osType = imageConfig.osType;
      this.imageId = imageConfig.imageId;
    }

    if (
      this.osType &&
      props.keyPair &&
      !props.keyPair._isOsCompatible(this.osType)
    ) {
      throw new ValidationError(
        `${props.keyPair.type} keys are not compatible with the chosen AMI`,
        this,
      );
    }

    if (
      FeatureFlags.of(this).isEnabled(
        cxapi.EC2_LAUNCH_TEMPLATE_DEFAULT_USER_DATA,
      ) ||
      FeatureFlags.of(this).isEnabled(
        cxapi.AUTOSCALING_GENERATE_LAUNCH_TEMPLATE,
      )
    ) {
      // priority: prop.userData -> userData from machineImage -> undefined
      this.userData = props.userData ?? imageConfig?.userData;
    } else {
      if (props.userData) {
        this.userData = props.userData;
      }
    }
    const userDataToken = Lazy.string({
      produce: () => {
        if (this.userData) {
          return Fn.base64(this.userData.render());
        }
        return undefined;
      },
    });

    this.instanceType = props.instanceType;

    let marketOptions: any = undefined;
    if (props?.spotOptions) {
      marketOptions = {
        marketType: 'spot',
        spotOptions: {
          blockDurationMinutes:
            spotDuration !== undefined ? spotDuration * 60 : undefined,
          instanceInterruptionBehavior: props.spotOptions.interruptionBehavior,
          maxPrice: props.spotOptions.maxPrice?.toString(),
          spotInstanceType: props.spotOptions.requestType,
          validUntil: props.spotOptions.validUntil?.date.toUTCString(),
        },
      };
      // Remove SpotOptions if there are none.
      if (
        Object.keys(marketOptions.spotOptions).filter(
          (k) => marketOptions.spotOptions[k],
        ).length == 0
      ) {
        marketOptions.spotOptions = undefined;
      }
    }

    this.tags = new TagManager(TagType.KEY_VALUE, 'AWS::EC2::LaunchTemplate');

    const tagsToken = Lazy.any({
      produce: () => {
        if (this.tags.hasTags()) {
          const renderedTags = this.tags.renderTags();
          const lowerCaseRenderedTags = renderedTags.map(
            (tag: { [key: string]: string }) => {
              return {
                key: tag.Key,
                value: tag.Value,
              };
            },
          );
          return [
            {
              resourceType: 'instance',
              tags: lowerCaseRenderedTags,
            },
            {
              resourceType: 'volume',
              tags: lowerCaseRenderedTags,
            },
          ];
        }
        return undefined;
      },
    });

    const ltTagsToken = Lazy.any({
      produce: () => {
        if (this.tags.hasTags()) {
          const renderedTags = this.tags.renderTags();
          const lowerCaseRenderedTags = renderedTags.map(
            (tag: { [key: string]: string }) => {
              return {
                key: tag.Key,
                value: tag.Value,
              };
            },
          );
          return [
            {
              resourceType: 'launch-template',
              tags: lowerCaseRenderedTags,
            },
          ];
        }
        return undefined;
      },
    });

    let networkInterfaces: NetworkInterface[] | undefined;
    if (props.networkInterfaces) {
      networkInterfaces = props.networkInterfaces;
    } else {
      networkInterfaces =
        props.associatePublicIpAddress !== undefined

          ? [
            {
              deviceIndex: 0,
              associatePublicIpAddress: props.associatePublicIpAddress,
              groups: props.securityGroup ? [props.securityGroup] : undefined,
            },
          ]
          : undefined;
    }

    if (
      props.versionDescription &&
      !Token.isUnresolved(props.versionDescription) &&
      props.versionDescription.length > 255
    ) {
      throw new ValidationError(
        `versionDescription must be less than or equal to 255 characters, got ${props.versionDescription.length}`,
        this,
      );
    }

    if (
      props.versionDescription &&
      !Token.isUnresolved(props.versionDescription) &&
      props.versionDescription.length > 255
    ) {
      throw new ValidationError(
        `versionDescription must be less than or equal to 255 characters, got ${props.versionDescription.length}`,
        this,
      );
    }

    if (props.versionDescription && !Token.isUnresolved(props.versionDescription) && props.versionDescription.length > 255) {
      throw new ValidationError(`versionDescription must be less than or equal to 255 characters, got ${props.versionDescription.length}`, this);
    }

    const resource = new CfnLaunchTemplate(this, 'Resource', {
      launchTemplateName: props?.launchTemplateName,
      versionDescription: props?.versionDescription,
      launchTemplateData: {
        blockDeviceMappings:
          props?.blockDevices !== undefined
            ? launchTemplateBlockDeviceMappings(this, props.blockDevices)
            : undefined,
        creditSpecification:
          props?.cpuCredits !== undefined
            ? {
              cpuCredits: props.cpuCredits,
            }
            : undefined,
        disableApiTermination: props?.disableApiTermination,
        ebsOptimized: props?.ebsOptimized,
        enclaveOptions:
          props?.nitroEnclaveEnabled !== undefined
            ? {
              enabled: props.nitroEnclaveEnabled,
            }
            : undefined,
        hibernationOptions:
          props?.hibernationConfigured !== undefined
            ? {
              configured: props.hibernationConfigured,
            }
            : undefined,
        iamInstanceProfile:
          iamProfileArn !== undefined ? { arn: iamProfileArn } : undefined,
        imageId: imageConfig?.imageId,
        instanceType: props?.instanceType?.toString(),
        instanceInitiatedShutdownBehavior:
          props?.instanceInitiatedShutdownBehavior,
        instanceMarketOptions: marketOptions,
        keyName: props.keyPair?.keyPairName ?? props?.keyName,
        monitoring:
          props?.detailedMonitoring !== undefined
            ? {
              enabled: props.detailedMonitoring,
            }
            : undefined,
        securityGroupIds: networkInterfaces ? undefined : securityGroupsToken,
        tagSpecifications: tagsToken,
        userData: userDataToken,
        metadataOptions: this.renderMetadataOptions(props),
        networkInterfaces: networkInterfaces
          ? synthesizeNetworkInterfaces(networkInterfaces)
          : undefined,
        placement: props.placementGroup
          ? {
            groupName: props.placementGroup.placementGroupName,
          }
          : undefined,

        // Fields not yet implemented:
        // ==========================
        // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-launchtemplate-launchtemplatedata-capacityreservationspecification.html
        // Will require creating an L2 for AWS::EC2::CapacityReservation
        // capacityReservationSpecification: undefined,

        // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-launchtemplate-launchtemplatedata-cpuoptions.html
        // cpuOptions: undefined,

        // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-launchtemplate-elasticgpuspecification.html
        // elasticGpuSpecifications: undefined,

        // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-launchtemplate-launchtemplatedata.html#cfn-ec2-launchtemplate-launchtemplatedata-elasticinferenceaccelerators
        // elasticInferenceAccelerators: undefined,

        // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-launchtemplate-launchtemplatedata.html#cfn-ec2-launchtemplate-launchtemplatedata-kernelid
        // kernelId: undefined,
        // ramDiskId: undefined,

        // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-launchtemplate-launchtemplatedata.html#cfn-ec2-launchtemplate-launchtemplatedata-licensespecifications
        // Also not implemented in Instance L2
        // licenseSpecifications: undefined,

        // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-launchtemplate-launchtemplatedata.html#cfn-ec2-launchtemplate-launchtemplatedata-tagspecifications
        // Should be implemented via the Tagging aspect in CDK core. Complication will be that this tagging interface is very unique to LaunchTemplates.
        // tagSpecification: undefined

        // CDK only has placement groups, not placement.
        // Specifiying options other than placementGroup is not supported yet.
        // placement: undefined,
      },
      tagSpecifications: ltTagsToken,
    });

    if (this.role) {
      resource.node.addDependency(this.role);
    } else if (props.instanceProfile?.role) {
      resource.node.addDependency(props.instanceProfile.role);
    }

    Tags.of(this).add(NAME_TAG, this.node.path);

    this.defaultVersionNumber = resource.attrDefaultVersionNumber;
    this.latestVersionNumber = resource.attrLatestVersionNumber;
    this.launchTemplateId = resource.ref;
    this.versionNumber = Token.asString(resource.getAtt('LatestVersionNumber'));
  }

  private renderMetadataOptions(props: LaunchTemplateProps) {
    let requireMetadataOptions = false;
    // if requireImdsv2 is true, httpTokens must be required.
    if (
      props.requireImdsv2 === true &&
      props.httpTokens === LaunchTemplateHttpTokens.OPTIONAL
    ) {
      Annotations.of(this).addError(
        'httpTokens must be required when requireImdsv2 is true',
      );
    }
    if (
      props.httpEndpoint !== undefined ||
      props.httpProtocolIpv6 !== undefined ||
      props.httpPutResponseHopLimit !== undefined ||
      props.httpTokens !== undefined ||
      props.instanceMetadataTags !== undefined ||
      props.requireImdsv2 === true
    ) {
      requireMetadataOptions = true;
    }
    if (requireMetadataOptions) {
      return {
        httpEndpoint:
          props.httpEndpoint === true
            ? 'enabled'
            : props.httpEndpoint === false
              ? 'disabled'
              : undefined,
        httpProtocolIpv6:
          props.httpProtocolIpv6 === true
            ? 'enabled'
            : props.httpProtocolIpv6 === false
              ? 'disabled'
              : undefined,
        httpPutResponseHopLimit: props.httpPutResponseHopLimit,
        httpTokens:
          props.requireImdsv2 === true
            ? LaunchTemplateHttpTokens.REQUIRED
            : props.httpTokens,
        instanceMetadataTags:
          props.instanceMetadataTags === true
            ? 'enabled'
            : props.instanceMetadataTags === false
              ? 'disabled'
              : undefined,
      };
    } else {
      return undefined;
    }
  }

  /**
   * Add the security group to the instance.
   *
   * @param securityGroup: The security group to add
   */
  @MethodMetadata()
  public addSecurityGroup(securityGroup: ISecurityGroup): void {
    if (!this._connections) {
      throw new ValidationError(

        'LaunchTemplate can only be added a securityGroup if another securityGroup is initialized in the constructor.',
        this,
      );
    }
    this._connections.addSecurityGroup(securityGroup);
  }

  /**
   * Allows specifying security group connections for the instance.
   *
   * @note Only available if you provide a securityGroup when constructing the LaunchTemplate.
   */
  public get connections(): Connections {
    if (!this._connections) {
      throw new ValidationError(

        'LaunchTemplate can only be used as IConnectable if a securityGroup is provided when constructing it.',
        this,
      );
    }
    return this._connections;
  }

  /**
   * Principal to grant permissions to.
   *
   * @note Only available if you provide a role when constructing the LaunchTemplate.
   */
  public get grantPrincipal(): iam.IPrincipal {
    if (!this._grantPrincipal) {
      throw new ValidationError(

        'LaunchTemplate can only be used as IGrantable if a role is provided when constructing it.',
        this,
      );
    }
    return this._grantPrincipal;
  }
}
