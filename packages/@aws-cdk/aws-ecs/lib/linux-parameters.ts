import cdk = require('@aws-cdk/cdk');
import { CfnTaskDefinition } from './ecs.generated';

/**
 * Properties for defining Linux Parameters
 */
export interface LinuxParametersProps {
  /**
   * Whether the init process is enabled
   *
   * @default false
   */
  readonly initProcessEnabled?: boolean;

  /**
   * The shared memory size
   *
   * @default No shared memory.
   */
  readonly sharedMemorySize?: number;
}

/**
 * Linux Parameters for an ECS container
 */
export class LinuxParameters extends cdk.Construct {
  /**
   * Whether the init process is enabled
   */
  private readonly initProcessEnabled?: boolean;

  /**
   * The shared memory size. Not valid for Fargate launch type
   */
  private readonly sharedMemorySize?: number;

  /**
   * Capabilities to be added
   */
  private readonly capAdd = new Array<Capability>();

  /**
   * Capabilities to be dropped
   */
  private readonly capDrop = new Array<Capability>();

  /**
   * Device mounts
   */
  private readonly devices = new Array<Device>();

  /**
   * TmpFs mounts
   */
  private readonly tmpfs = new Array<Tmpfs>();

  constructor(scope: cdk.Construct, id: string, props: LinuxParametersProps = {}) {
    super(scope, id);

    this.sharedMemorySize = props.sharedMemorySize;
    this.initProcessEnabled = props.initProcessEnabled;
  }

  /**
   * Add one or more capabilities
   *
   * Only works with EC2 launch type.
   */
  public addCapabilities(...cap: Capability[]) {
    this.capAdd.push(...cap);
  }

  /**
   * Drop one or more capabilities
   *
   * Only works with EC2 launch type.
   */
  public dropCapabilities(...cap: Capability[]) {
    this.capDrop.push(...cap);
  }

  /**
   * Add one or more devices
   */
  public addDevices(...device: Device[]) {
    this.devices.push(...device);
  }

  /**
   * Add one or more tmpfs mounts
   *
   * Only works with EC2 launch type.
   */
  public addTmpfs(...tmpfs: Tmpfs[]) {
    this.tmpfs.push(...tmpfs);
  }

  /**
   * Render the Linux parameters to a CloudFormation object
   */
  public renderLinuxParameters(): CfnTaskDefinition.LinuxParametersProperty {
    return {
      initProcessEnabled: this.initProcessEnabled,
      sharedMemorySize: this.sharedMemorySize,
      capabilities: {
        add: this.capAdd,
        drop: this.capDrop,
      },
      devices: this.devices.map(renderDevice),
      tmpfs: this.tmpfs.map(renderTmpfs)
    };
  }
}

/**
 * A host device
 */
export interface Device {
  /**
   * Path in the container
   *
   * @default Same path as the host
   */
  readonly containerPath?: string,

  /**
   * Path on the host
   */
  readonly hostPath: string,

  /**
   * Permissions
   *
   * @default Readonly
   */
  readonly permissions?: DevicePermission[]
}

function renderDevice(device: Device): CfnTaskDefinition.DeviceProperty {
  return {
    containerPath: device.containerPath,
    hostPath: device.hostPath,
    permissions: device.permissions
  };
}

/**
 * A tmpfs mount
 */
export interface Tmpfs {
  /**
   * Path in the container to mount
   */
  readonly containerPath: string,

  /**
   * Size of the volume
   */
  readonly size: number,

  /**
   * Mount options
   */
  readonly mountOptions?: TmpfsMountOption[],
}

function renderTmpfs(tmpfs: Tmpfs): CfnTaskDefinition.TmpfsProperty {
  return {
    containerPath: tmpfs.containerPath,
    size: tmpfs.size,
    mountOptions: tmpfs.mountOptions
  };
}

/**
 * A Linux capability
 */
export enum Capability {
  ALL = "ALL",
  AUDIT_CONTROL = "AUDIT_CONTROL",
  AUDIT_WRITE = "AUDIT_WRITE",
  BLOCK_SUSPEND = "BLOCK_SUSPEND",
  CHOWN = "CHOWN",
  DAC_OVERRIDE = "DAC_OVERRIDE",
  DAC_READ_SEARCH = "DAC_READ_SEARCH",
  FOWNER = "FOWNER",
  FSETID = "FSETID",
  IPC_LOCK = "IPC_LOCK",
  IPC_OWNER = "IPC_OWNER",
  KILL = "KILL",
  LEASE = "LEASE",
  LINUX_IMMUTABLE = "LINUX_IMMUTABLE",
  MAC_ADMIN = "MAC_ADMIN",
  MAC_OVERRIDE = "MAC_OVERRIDE",
  MKNOD = "MKNOD",
  NET_ADMIN = "NET_ADMIN",
  NET_BIND_SERVICE = "NET_BIND_SERVICE",
  NET_BROADCAST = "NET_BROADCAST",
  NET_RAW = "NET_RAW",
  SETFCAP = "SETFCAP",
  SETGID = "SETGID",
  SETPCAP = "SETPCAP",
  SETUID = "SETUID",
  SYS_ADMIN = "SYS_ADMIN",
  SYS_BOOT = "SYS_BOOT",
  SYS_CHROOT = "SYS_CHROOT",
  SYS_MODULE = "SYS_MODULE",
  SYS_NICE = "SYS_NICE",
  SYS_PACCT = "SYS_PACCT",
  SYS_PTRACE = "SYS_PTRACE",
  SYS_RAWIO = "SYS_RAWIO",
  SYS_RESOURCE = "SYS_RESOURCE",
  SYS_TIME = "SYS_TIME",
  SYS_TTY_CONFIG = "SYS_TTY_CONFIG",
  SYSLOG = "SYSLOG",
  WAKE_ALARM = "WAKE_ALARM"
}

/**
 * Permissions for device access
 */
export enum DevicePermission {
  /**
   * Read
   */
  READ = "read",

  /**
   * Write
   */
  WRITE = "write",

  /**
   * Make a node
   */
  MKNOD = "mknod",
}

/**
 * Options for a tmpfs mount
 */
export enum TmpfsMountOption {
  DEFAULTS = "defaults",
  RO = "ro",
  RW = "rw",
  SUID = "suid",
  NOSUID = "nosuid",
  DEV = "dev",
  NODEV = "nodev",
  EXEC = "exec",
  NOEXEC = "noexec",
  SYNC = "sync",
  ASYNC = "async",
  DIRSYNC = "dirsync",
  REMOUNT = "remount",
  MAND = "mand",
  NOMAND = "nomand",
  ATIME = "atime",
  NOATIME = "noatime",
  DIRATIME = "diratime",
  NODIRATIME = "nodiratime",
  BIND = "bind",
  RBIND = "rbind",
  UNBINDABLE = "unbindable",
  RUNBINDABLE = "runbindable",
  PRIVATE = "private",
  RPRIVATE = "rprivate",
  SHARED = "shared",
  RSHARED = "rshared",
  SLAVE = "slave",
  RSLAVE = "rslave",
  RELATIME = "relatime",
  NORELATIME = "norelatime",
  STRICTATIME = "strictatime",
  NOSTRICTATIME = "nostrictatime",
  MODE = "mode",
  UID = "uid",
  GID = "gid",
  NR_INODES = "nr_inodes",
  NR_BLOCKS = "nr_blocks",
  MPOL = "mpol"
}
