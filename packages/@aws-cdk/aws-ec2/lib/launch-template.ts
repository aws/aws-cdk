import * as iam from '@aws-cdk/aws-iam';

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
} from '@aws-cdk/core';
import { Construct } from 'constructs';
import { Connections, IConnectable } from './connections';
import { CfnLaunchTemplate } from './ec2.generated';
import { InstanceType } from './instance-types';
import { IMachineImage, MachineImageConfig, OperatingSystemType } from './machine-image';
import { launchTemplateBlockDeviceMappings } from './private/ebs-util';
import { ISecurityGroup } from './security-group';
import { UserData } from './user-data';
import { BlockDevice } from './volume';

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
};

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
};

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
};

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
   * The role must be assumable by the service principal `ec2.amazonaws.com`:
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
   */
  readonly keyName?: string;

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
export class LaunchTemplate extends Resource implements ILaunchTemplate, iam.IGrantable, IConnectable {
  /**
   * Import an existing LaunchTemplate.
   */
  public static fromLaunchTemplateAttributes(scope: Construct, id: string, attrs: LaunchTemplateAttributes): ILaunchTemplate {
    const haveId = Boolean(attrs.launchTemplateId);
    const haveName = Boolean(attrs.launchTemplateName);
    if (haveId == haveName) {
      throw new Error('LaunchTemplate.fromLaunchTemplateAttributes() requires exactly one of launchTemplateId or launchTemplateName be provided.');
    }

    class Import extends Resource implements ILaunchTemplate {
      public readonly versionNumber = attrs.versionNumber ?? LaunchTemplateSpecialVersions.DEFAULT_VERSION;
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

    // Basic validation of the provided spot block duration
    const spotDuration = props?.spotOptions?.blockDuration?.toHours({ integral: true });
    if (spotDuration !== undefined && (spotDuration < 1 || spotDuration > 6)) {
      // See: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/spot-requests.html#fixed-duration-spot-instances
      Annotations.of(this).addError('Spot block duration must be exactly 1, 2, 3, 4, 5, or 6 hours.');
    }

    this.role = props.role;
    this._grantPrincipal = this.role;
    const iamProfile: iam.CfnInstanceProfile | undefined = this.role ? new iam.CfnInstanceProfile(this, 'Profile', {
      roles: [this.role!.roleName],
    }) : undefined;

    if (props.securityGroup) {
      this._connections = new Connections({ securityGroups: [props.securityGroup] });
    }
    const securityGroupsToken = Lazy.list({
      produce: () => {
        if (this._connections && this._connections.securityGroups.length > 0) {
          return this._connections.securityGroups.map(sg => sg.securityGroupId);
        }
        return undefined;
      },
    });

    if (props.userData) {
      this.userData = props.userData;
    }
    const userDataToken = Lazy.string({
      produce: () => {
        if (this.userData) {
          return Fn.base64(this.userData.render());
        }
        return undefined;
      },
    });

    const imageConfig: MachineImageConfig | undefined = props.machineImage?.getImage(this);
    if (imageConfig) {
      this.osType = imageConfig.osType;
    }

    let marketOptions: any = undefined;
    if (props?.spotOptions) {
      marketOptions = {
        marketType: 'spot',
        spotOptions: {
          blockDurationMinutes: spotDuration !== undefined ? spotDuration * 60 : undefined,
          instanceInterruptionBehavior: props.spotOptions.interruptionBehavior,
          maxPrice: props.spotOptions.maxPrice?.toString(),
          spotInstanceType: props.spotOptions.requestType,
          validUntil: props.spotOptions.validUntil?.date.toUTCString(),
        },
      };
      // Remove SpotOptions if there are none.
      if (Object.keys(marketOptions.spotOptions).filter(k => marketOptions.spotOptions[k]).length == 0) {
        marketOptions.spotOptions = undefined;
      }
    }

    this.tags = new TagManager(TagType.KEY_VALUE, 'AWS::EC2::LaunchTemplate');
    const tagsToken = Lazy.any({
      produce: () => {
        if (this.tags.hasTags()) {
          const renderedTags = this.tags.renderTags();
          const lowerCaseRenderedTags = renderedTags.map( (tag: { [key: string]: string}) => {
            return {
              key: tag.Key,
              value: tag.Value,
            };
          });
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

    const resource = new CfnLaunchTemplate(this, 'Resource', {
      launchTemplateName: props?.launchTemplateName,
      launchTemplateData: {
        blockDeviceMappings: props?.blockDevices !== undefined ? launchTemplateBlockDeviceMappings(this, props.blockDevices) : undefined,
        creditSpecification: props?.cpuCredits !== undefined ? {
          cpuCredits: props.cpuCredits,
        } : undefined,
        disableApiTermination: props?.disableApiTermination,
        ebsOptimized: props?.ebsOptimized,
        enclaveOptions: props?.nitroEnclaveEnabled !== undefined ? {
          enabled: props.nitroEnclaveEnabled,
        } : undefined,
        hibernationOptions: props?.hibernationConfigured !== undefined ? {
          configured: props.hibernationConfigured,
        } : undefined,
        iamInstanceProfile: iamProfile !== undefined ? {
          arn: iamProfile.getAtt('Arn').toString(),
        } : undefined,
        imageId: imageConfig?.imageId,
        instanceType: props?.instanceType?.toString(),
        instanceInitiatedShutdownBehavior: props?.instanceInitiatedShutdownBehavior,
        instanceMarketOptions: marketOptions,
        keyName: props?.keyName,
        monitoring: props?.detailedMonitoring !== undefined ? {
          enabled: props.detailedMonitoring,
        } : undefined,
        securityGroupIds: securityGroupsToken,
        tagSpecifications: tagsToken,
        userData: userDataToken,

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

        // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-launchtemplate-launchtemplatedata.html#cfn-ec2-launchtemplate-launchtemplatedata-metadataoptions
        // metadataOptions: undefined,

        // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-launchtemplate-launchtemplatedata.html#cfn-ec2-launchtemplate-launchtemplatedata-tagspecifications
        // Should be implemented via the Tagging aspect in CDK core. Complication will be that this tagging interface is very unique to LaunchTemplates.
        // tagSpecification: undefined

        // CDK has no abstraction for Network Interfaces yet.
        // networkInterfaces: undefined,

        // CDK has no abstraction for Placement yet.
        // placement: undefined,

      },
    });

    Tags.of(this).add(NAME_TAG, this.node.path);

    this.defaultVersionNumber = resource.attrDefaultVersionNumber;
    this.latestVersionNumber = resource.attrLatestVersionNumber;
    this.launchTemplateId = resource.ref;
    this.versionNumber = Token.asString(resource.getAtt('LatestVersionNumber'));
  }

  /**
   * Allows specifying security group connections for the instance.
   *
   * @note Only available if you provide a securityGroup when constructing the LaunchTemplate.
   */
  public get connections(): Connections {
    if (!this._connections) {
      throw new Error('LaunchTemplate can only be used as IConnectable if a securityGroup is provided when contructing it.');
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
      throw new Error('LaunchTemplate can only be used as IGrantable if a role is provided when constructing it.');
    }
    return this._grantPrincipal;
  }
}
