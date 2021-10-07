import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnInstance } from './lightsail.generated';

/**
 * The Blueprint for the instance.
 */
export class Blueprint {
  /**
   * windows_server_2019
   */
  public static readonly WINDOWS_SERVER_2019 = Blueprint.of('windows_server_2019');
  /**
   * windows_server_2016
   */
  public static readonly WINDOWS_SERVER_2016 = Blueprint.of('windows_server_2016');
  /**
   * windows_server_2012
   */
  public static readonly WINDOWS_SERVER_2012 = Blueprint.of('windows_server_2012');
  /**
   * windows_server_2016_sql_2016_express
   */
  public static readonly WINDOWS_SERVER_2016_SQL_2016_EXPRESS = Blueprint.of('windows_server_2016_sql_2016_express');
  /**
   * amazon_linux_2
   */
  public static readonly AMAZON_LINUX_2 = Blueprint.of('amazon_linux_2');
  /**
   * amazon_linux
   */
  public static readonly AMAZON_LINUX = Blueprint.of('amazon_linux');
  /**
   * ubuntu_20_04
   */
  public static readonly UBUNTU_20_04 = Blueprint.of('ubuntu_20_04');
  /**
   * ubuntu_18_04
   */
  public static readonly UBUNTU_18_04 = Blueprint.of('ubuntu_18_04');
  /**
   * ubuntu_16_04_2
   */
  public static readonly UBUNTU_16_04_2 = Blueprint.of('ubuntu_16_04_2');
  /**
   * debian_10
   */
  public static readonly DEBIAN_10 = Blueprint.of('debian_10');
  /**
   * debian_9_13
   */
  public static readonly DEBIAN_9_13 = Blueprint.of('debian_9_13');
  /**
   * debian_8_7
   */
  public static readonly DEBIAN_8_7 = Blueprint.of('debian_8_7');
  /**
   * freebsd_12
   */
  public static readonly FREEBSD_12 = Blueprint.of('freebsd_12');
  /**
   * opensuse_15_2
   */
  public static readonly OPENSUSE_15_2 = Blueprint.of('opensuse_15_2');
  /**
   * centos_8
   */
  public static readonly CENTOS_8 = Blueprint.of('centos_8');
  /**
   * centos_7_2009_01
   */
  public static readonly CENTOS_7_2009_01 = Blueprint.of('centos_7_2009_01');
  /**
   * wordpress
   */
  public static readonly WORDPRESS = Blueprint.of('wordpress');
  /**
   * wordpress_multisite
   */
  public static readonly WORDPRESS_MULTISITE = Blueprint.of('wordpress_multisite');
  /**
   * lamp_7
   */
  public static readonly LAMP_7 = Blueprint.of('lamp_7');
  /**
   * nodejs
   */
  public static readonly NODEJS = Blueprint.of('nodejs');
  /**
   * joomla
   */
  public static readonly JOOMLA = Blueprint.of('joomla');
  /**
   * magento
   */
  public static readonly MAGENTO = Blueprint.of('magento');
  /**
   * mean
   */
  public static readonly MEAN = Blueprint.of('mean');
  /**
   * drupal
   */
  public static readonly DRUPAL = Blueprint.of('drupal');
  /**
   * gitlab
   */
  public static readonly GITLAB = Blueprint.of('gitlab');
  /**
   * redmine
   */
  public static readonly REDMINE = Blueprint.of('redmine');
  /**
   * nginx
   */
  public static readonly NGINX = Blueprint.of('nginx');
  /**
   * ghost_bitnami
   */
  public static readonly GHOST_BITNAMI = Blueprint.of('ghost_bitnami');
  /**
   * django_bitnami
   */
  public static readonly DJANGO_BITNAMI = Blueprint.of('django_bitnami');
  /**
   * prestashop_bitnami
   */
  public static readonly PRESTASHOP_BITNAMI = Blueprint.of('prestashop_bitnami');
  /**
   * plesk_ubuntu_18_0_34
   */
  public static readonly PLESK_UBUNTU_18_0_34 = Blueprint.of('plesk_ubuntu_18_0_34');
  /**
   * cpanel_whm_linux
   */
  public static readonly CPANEL_WHM_LINUX = Blueprint.of('cpanel_whm_linux');

  /**
   * custom blueprint id
   *
   * @param id the blueprint id
   */
  public static of(id: string) {
    return new Blueprint(id);
  }
  /**
   * @param id the blueprint id
   */
  private constructor(public readonly id: string) {}
}

/**
 * The Bundle for the instance.
 */
export class Bundle {
  /**
   * nano_2_0
   */
  public static readonly NANO_2_0 = Blueprint.of('nano_2_0');
  /**
   * micro_2_0
   */
  public static readonly MICRO_2_0 = Blueprint.of('micro_2_0');
  /**
   * small_2_0
   */
  public static readonly SMALL_2_0 = Blueprint.of('small_2_0');
  /**
   * medium_2_0
   */
  public static readonly MEDIUM_2_0 = Blueprint.of('medium_2_0');
  /**
   * large_2_0
   */
  public static readonly LARGE_2_0 = Blueprint.of('large_2_0');
  /**
   * xlarge_2_0
   */
  public static readonly XLARGE_2_0 = Blueprint.of('xlarge_2_0');
  /**
   * 2xlarge_2_0
   */
  public static readonly TWO_XLARGE_2_0 = Blueprint.of('2xlarge_2_0');
  /**
   * nano_win_2_0
   */
  public static readonly NANO_WIN_2_0 = Blueprint.of('nano_win_2_0');
  /**
   * micro_win_2_0
   */
  public static readonly MICRO_WIN_2_0 = Blueprint.of('micro_win_2_0');
  /**
   * small_win_2_0
   */
  public static readonly SMALL_WIN_2_0 = Blueprint.of('small_win_2_0');
  /**
   * medium_win_2_0
   */
  public static readonly MEDIUM_WIN_2_0 = Blueprint.of('medium_win_2_0');
  /**
   * large_win_2_0
   */
  public static readonly LARGE_WIN_2_0 = Blueprint.of('large_win_2_0');
  /**
   * xlarge_win_2_0
   */
  public static readonly XLARGE_WIN_2_0 = Blueprint.of('xlarge_win_2_0');
  /**
   * 2xlarge_win_2_0
   */
  public static readonly TWO_XLARGE_WIN_2_0 = Blueprint.of('2xlarge_win_2_0');

  /**
   * custom bundle id
   *
   * @param id the instance id
   */
  public static of(id: string) {
    return new Bundle(id);
  }
  /**
   * @param id the bundle id
   */
  private constructor(public readonly id: string) {}
}

/**
 * The properties of the instance.
 */
export interface InstanceProps extends cdk.ResourceProps {
  /**
   * The blueprint of the instance.
   *
   * @default AMAZON_LINUX_2
   */
  readonly blueprint?: Blueprint;
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
  readonly instanceUserData: string;
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
  readonly instanceKeyPairName: string;
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
      blueprintId: props.blueprint ? props.blueprint.id : Blueprint.AMAZON_LINUX_2.id,
      bundleId: props.bundle.id,
      instanceName: props.instanceName ?? id,
    });

    this.instanceName = resource.instanceName;
    this.instanceUserName = resource.attrUserName;
    this.instanceUserData = resource.attrUserData;
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
    this.instanceKeyPairName = resource.attrKeyPairName;
    this.instanceIsStaticIp = resource.attrIsStaticIp;
    this.instanceArn = resource.attrInstanceArn;
    this.instanceHardwareRamSizeInGb = resource.attrHardwareRamSizeInGb;
    this.instanceHardwareCpuCount = resource.attrHardwareCpuCount;
  }
}