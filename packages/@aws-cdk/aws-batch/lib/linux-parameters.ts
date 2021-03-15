import * as cdk from '@aws-cdk/core';
import { Device, Tmpfs } from '@aws-cdk/aws-ecs';
import { Construct } from 'constructs';
import { CfnJobDefinition } from './batch.generated';

export interface LinuxParametersProps {
  /**
   * Specifies whether to run an init process inside the container that forwards signals and reaps processes.
   *
   * @default false
   */
  readonly initProcessEnabled?: boolean;

  /**
   * The value for the size (in MiB) of the /dev/shm volume.
   *
   * @default No shared memory.
   */
  readonly sharedMemorySize?: number;

  /**
   * The total amount (in MiB) of swap memory the container can use.
   *
   * @default No swappable memory.
   */
  readonly maxSwap?: number;

  /**
   * Only for EC2 type job definitions.
   *
   * The tuning value for the how aggressive the container will perform memory swaps.
   * A value of 0 will cause no swapping to occur unless necessary. A value of 100 will
   * cause pages to be swapped aggressively.
   *
   * If no value is provided, maxSwap will be ignored.
   *
   * @default 60
   */
  readonly swappiness?: number;
}

export class LinuxParameters extends Construct {
  /**
   * Wheter the init process is enabled
   */
  private readonly initProcessEnabled?: boolean;

  /**
   * The shared memory size. Not valid for Fargate launch type
   */
  private readonly sharedMemorySize?: number;

  /**
   * Device mounts
   */
  private readonly devices = new Array<Device>();

  /**
   * TmpFs mounts
   */
  private readonly tmpfs = new Array<Tmpfs>();

  /**
   * Total amount of swap space (in MiB) the container can use.
   */
  private readonly maxSwap?: number;

  /**
   * Swap behavior
   */
  private readonly swappiness?: number;

  /**
   * Constructs a new instance of the Batch LinuxParameters class.
   */
  constructor(scope: Construct, id: string, props: LinuxParametersProps = {}) {
    super(scope, id);

    this.initProcessEnabled = props.initProcessEnabled;
    this.sharedMemorySize = props.sharedMemorySize;
    this.maxSwap = props.maxSwap;
    this.swappiness = props.swappiness;
  }

  /**
   * Adds one or more host devices to a container.
   */
  public addDevices(...device: Device[]) {
    this.devices.push(...device);
  }

  /**
   * Specifies the container path, mount options, and size (in MiB) of the tmpfs mount for a container.
   *
   * Only works with EC2 launch type.
   */
  public addTmpfs(...tmpfs: Tmpfs[]) {
    this.tmpfs.push(...tmpfs);
  }

  /**
   * Renders the Linux parameters to a CloudFormation object.
   */
  public renderLinuxParameters(): CfnJobDefinition.LinuxParametersProperty {
    return {
      initProcessEnabled: this.initProcessEnabled,
      sharedMemorySize: this.sharedMemorySize,
      maxSwap: this.maxSwap,
      swappiness: this.swappiness,
      devices: cdk.Lazy.any({ produce: () => this.devices.map(renderDevice) }, { omitEmptyArray: true }),
      tmpfs: cdk.Lazy.any({ produce: () => this.tmpfs.map(renderTmpfs) }, { omitEmptyArray: true }),
    };
  }
}

function renderDevice(device: Device): CfnJobDefinition.DeviceProperty {
  return {
    containerPath: device.containerPath,
    hostPath: device.hostPath,
    permissions: device.permissions,
  };
}

function renderTmpfs(tmpfs: Tmpfs): CfnJobDefinition.TmpfsProperty {
  return {
    containerPath: tmpfs.containerPath,
    size: tmpfs.size,
    mountOptions: tmpfs.mountOptions,
  };
}
