import * as iam from '@aws-cdk/aws-iam';

import { Construct, Lazy, Resource, Token } from '@aws-cdk/core';
import { CfnLaunchTemplate } from './ec2.generated';
import { InstanceType } from './instance-types';
import { IMachineImage } from './machine-image';
import { launchTemplateBlockDeviceMappings } from './private/ebs-util';
import { UserData } from './user-data';
import { BlockDevice } from './volume';

export interface ILaunchTemplate {
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

export interface LaunchTemplateProps {
  /**
   * Name for this launch template
   *
   * @default Automatically generated name
   */
  readonly launchTemplateName?: string;

  /**
   * Type of instance to launch
   *
   * @default - This Launch Template does not specify a default Instance Type.
   */
  readonly instanceType?: InstanceType;

  /**
   * AMI to launch
   *
   * @default - This Launch Template does not specify a default AMI.
   */
  readonly machineImage?: IMachineImage;

  /**
   * Specific UserData to use
   *
   * @default - This Launch Template does not specify UserData to use.
   */
  readonly userData?: UserData;

  /**
   * An IAM role to associate with the instance profile.
   *
   * The role must be assumable by the service principal `ec2.amazonaws.com`:
   *
   * @example
   * const role = new iam.Role(this, 'MyRole', {
   *   assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com')
   * });
   *
   * @default - This Launch Template does not contain an instance role.
   */
  readonly role?: iam.IRole;

  /**
   * Name of SSH keypair to grant access to instance
   *
   * @default - No SSH access will be possible.
   */
  readonly keyName?: string;

  /**
   * The market (purchasing) option for the instances.
   */
  readonly instanceMarketOptions?: string; // TODO: create type

  /**
   * The metadata options for the instance.
   * Instance metadata is data about your instance that you can use to configure or manage the running instance.
   * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-metadata.html
   */
  readonly metadataOptions?: string; // TODO: create type

  /**
   * Instance's Capacity Reservation targeting option.
   * @default - `open`, the instance will run in any open capacity reservation that has matching attributes
   */
  readonly capacityReservationSpecification?: string; // TODO: create type

  /**
   * The placement for the instance.
   */
  readonly placement?: string; // TODO: create type

  /**
   * The tags to apply to the resources during launch. You can only tag instances and volumes on launch.
   * The specified tags are applied to all instances or volumes that are created during launch.
   */
  readonly tagSpecifications?: string; // TODO: create type?

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
}

export class LaunchTemplate extends Resource implements ILaunchTemplate {

  public static fromLaunchTemplateId(id: string, version: string): ILaunchTemplate {
    class Import implements ILaunchTemplate {
      public readonly versionNumber = version;
      public readonly launchTemplateId = id;
    }
    return new Import();
  }

  public static fromLaunchTemplateName(name: string, version: string): ILaunchTemplate {
    class Import implements ILaunchTemplate {
      public readonly versionNumber = version;
      public readonly launchTemplateName = name;
    }
    return new Import();
  }

  public readonly versionNumber: string;
  public readonly launchTemplateId: string;

  constructor(scope: Construct, id: string, props: LaunchTemplateProps) {
    super(scope, id);
    const resource = new CfnLaunchTemplate(this, 'Resource', {
      launchTemplateName: props.launchTemplateName,
      launchTemplateData: {
        keyName: props.keyName,
        instanceType: props.instanceType?.toString(),
        imageId: props.machineImage?.getImage(this).imageId,
        // FIXME: Or UserData from the machineimage, and also what about the userdata from the
        // Instance itself?
        userData: Lazy.stringValue({ produce: () => props.userData?.render() }),
        iamInstanceProfile: props.role ? { arn: props.role.roleArn } : undefined,
        blockDeviceMappings: launchTemplateBlockDeviceMappings(this, props.blockDevices),
      },
    });

    this.launchTemplateId = resource.ref;
    this.versionNumber = Token.asString(resource.getAtt('LatestVersionNumber'));
  }
}
