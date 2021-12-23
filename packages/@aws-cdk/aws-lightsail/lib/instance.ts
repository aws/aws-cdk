import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { LinuxOSBlueprint, WindowsOSBlueprint, LinuxAppBlueprint, BlueprintBase } from './blueprints';
import { Bundle } from './bundle';
import { CfnInstance } from './lightsail.generated';


/**
 * Represents the Platform.
 */
export interface IPlatform {
  /**
   * The blueprint fo the platform.
   */
  readonly blueprint: BlueprintBase;
}

/**
 * The properties for the LinuxApp.
 */
export interface LinuxAppProps {
  /**
   * the blueprint for the Linux App.
   */
  readonly blueprint: LinuxAppBlueprint;
}

/**
 * Represents the Linux Application with the blueprint property for the instance.
 */
export class LinuxApp implements IPlatform {
  /**
   * the blueprint for the Linux App.
   */
  public readonly blueprint: BlueprintBase;
  constructor(props: LinuxAppProps) {
    this.blueprint = props.blueprint;
  }
}

/**
 * The properties for the LinuxOS.
 */
export interface LinuxOSProps {
  /**
   * the blueprint for the Linux OS.
   */
  readonly blueprint: LinuxOSBlueprint;
}

/**
 * Represents the LinuxOS.
 */
export class LinuxOS implements IPlatform {
  /**
   * the blueprint for the Linux OS.
   */
  public readonly blueprint: BlueprintBase;
  constructor(props: LinuxOSProps) {
    this.blueprint = props.blueprint;
  }
}

/**
 * The properties for the WindowsOS.
 */
export interface WindowsOSProps {
  /**
   * the blueprint for the Windows OS.
   */
  readonly blueprint: WindowsOSBlueprint;
}

/**
 * Represents the WindowsOS.
 */
export class WindowsOS implements IPlatform {
  /**
   * the blueprint for the Windows OS.
   */
  public readonly blueprint: BlueprintBase;
  constructor(props: WindowsOSProps) {
    this.blueprint = props.blueprint;
  }
}

/**
 * Represents the Platform which could be LinuxOS, LinuxApp or WindowsOS.
 */
export class Platform {
  /**
   * get a LinuxApp.
   * @param props the LinuxApp properties
   * @returns LinuxApp
   */
  public static linuxApp(props: LinuxAppProps): LinuxApp {
    return new LinuxApp(props);
  }
  /**
   * get a LinuxOS
   * @param props the LinuxOS properties.
   * @returns LinuxOS
   */
  public static linuxOS(props: LinuxOSProps): LinuxOS {
    return new LinuxOS(props);
  }
  /**
   * get a WindowsOS
   * @param props the WindowsOS properties.
   * @returns WindowsOS
   */
  public static windowsOS(props: WindowsOSProps): WindowsOS {
    return new WindowsOS(props);
  }
}

/**
 * The properties of the instance.
 */
export interface InstanceProps extends cdk.ResourceProps {
  /**
   * Define the OS or App blueprint for this instance.
   */
  readonly image: IPlatform;
  /**
   * The bundle of the instance.
   */
  readonly bundle: Bundle;
  /**
   * The instance name.
   *
   * @default - construct id of the Instance
   */
  readonly instanceName?: string;
}

/**
 * The interface of the instance.
 */
export interface IInstance extends cdk.IResource {
  /**
   * The Name of the instance.
   *
   * @attribute
   */
  readonly instanceName: string;
}

/**
 * Represents the lightsail instance.
 */
export class Instance extends cdk.Resource implements IInstance {
  /**
   * Import from instance name.
   */
  public static fromInstanceName(scope: Construct, id: string, instanceName: string): IInstance {
    class Import extends cdk.Resource {
      public instanceName = instanceName;
      public instanceArn = cdk.Stack.of(this).formatArn({
        resource: 'Instance',
        service: 'lightsail',
        resourceName: instanceName,
      })
    }
    return new Import(scope, id);
  }
  /**
   * The name of the instance.
   */
  readonly instanceName: string;
  /**
   * The user name for connecting to the instance (for example, ec2-user).
   *
   * @attribute
   */
  readonly instanceUserName: string;
  /**
   * A launch script that installs software on an instance, or configures an instance.
   *
   * @attribute
   */
  readonly instanceUserData?: string;
  /**
    * The support code of the instance.
    * Include this code in your email to support when you have questions about an instance or
    * another resource in Lightsail. This code helps our support team to look up your Lightsail information.
    * @attribute
    */
  readonly instanceSupportCode: string;
  /**
    * The state of the instance (for example, `running` or `pending`).
    *
    * @attribute
    */
  readonly instanceStateName: string;
  /**
    * The status code of the instance.
    *
    * @attribute
    */
  readonly instanceStateCode: number;
  /**
    * The name of the SSH key pair used by the instance.
    *
    * @attribute
    */
  readonly instanceSshKeyName: string;
  /**
    * The resource type of the instance (for example, `Instance`).
    *
    * @attribute
    */
  readonly instanceResourceType: string;
  /**
    * The public IP address of the instance.
    *
    * @attribute
    */
  readonly instancePublicIpAddress: string;
  /**
    * The private IP address of the instance.
    *
    * @attribute
    */
  readonly instancePrivateIpAddress: string;
  /**
    * The amount of allocated monthly data transfer (in GB) for an instance.
    *
    * @attribute
    */
  readonly instanceNetworkingMonthlyTransferGbPerMonthAllocated: string;
  /**
    * The AWS Region of the instance.
    *
    * @attribute
    */
  readonly instanceLocationRegionName: string;
  /**
    * The AWS Region and Availability Zone where the instance is located.
    *
    * @attribute
    */
  readonly instanceLocationAvailabilityZone: string;
  /**
    * The name of the SSH key pair used by the instance.
    *
    * @attribute
    */
  readonly instanceKeyPairName?: string;
  /**
    * Whether the instance has a static IP assigned to it.
    *
    * @attribute
    */
  readonly instanceIsStaticIp: cdk.IResolvable;
  /**
    * The Amazon Resource Name (ARN) of the instance (for example,
    * `arn:aws:lightsail:us-east-2:123456789101:Instance/244ad76f-8aad-4741-809f-12345EXAMPLE`).
    *
    * @attribute
    */
  readonly instanceArn: string;
  /**
    * The amount of RAM in GB on the instance (for example, `1.0`).
    *
    * @attribute
    */
  readonly instanceHardwareRamSizeInGb: number;
  /**
    * The number of vCPUs the instance has.
    *
    * @attribute
    */
  readonly instanceHardwareCpuCount: number;
  constructor(scope: Construct, id: string, props: InstanceProps) {
    super(scope, id, props);

    const resource = new CfnInstance(this, 'Resource', {
      blueprintId: props.image.blueprint.id,
      bundleId: props.bundle.id,
      instanceName: props.instanceName ?? id,
    });

    this.instanceName = resource.instanceName;
    this.instanceUserName = resource.attrUserName;
    this.instanceUserData = resource.userData;
    this.instanceSupportCode = resource.attrSupportCode;
    this.instanceStateName = resource.attrStateName;
    this.instanceStateCode = resource.attrStateCode;
    this.instanceSshKeyName = resource.attrSshKeyName;
    this.instanceResourceType = resource.attrResourceType;
    this.instancePublicIpAddress = resource.attrPublicIpAddress;
    this.instancePrivateIpAddress = resource.attrPrivateIpAddress;
    this.instanceNetworkingMonthlyTransferGbPerMonthAllocated = resource.attrNetworkingMonthlyTransferGbPerMonthAllocated;
    this.instanceLocationRegionName = resource.attrLocationRegionName;
    this.instanceLocationAvailabilityZone = resource.attrLocationAvailabilityZone;
    this.instanceKeyPairName = resource.keyPairName;
    this.instanceIsStaticIp = resource.attrIsStaticIp;
    this.instanceArn = resource.attrInstanceArn;
    this.instanceHardwareRamSizeInGb = resource.attrHardwareRamSizeInGb;
    this.instanceHardwareCpuCount = resource.attrHardwareCpuCount;
  }
}
