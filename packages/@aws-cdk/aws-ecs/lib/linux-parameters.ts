import { CfnTaskDefinition } from './ecs.generated';

/**
 * Linux parameter setup in a container
 */
export class LinuxParameters {
  /**
   * Whether the init process is enabled
   */
  public initProcessEnabled?: boolean;

  /**
   * The shared memory size
   */
  public sharedMemorySize?: number;

  /**
   * Capabilities to be added
   */
  private readonly capAdd: Capability[] = [];

  /**
   * Capabilities to be dropped
   */
  private readonly capDrop: Capability[] = [];

  /**
   * Device mounts
   */
  private readonly devices: Device[] = [];

  /**
   * TMPFS mounts
   */
  private readonly tmpfs: Tmpfs[] = [];

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
  All = "ALL",
  AuditControl = "AUDIT_CONTROL",
  AuditWrite = "AUDIT_WRITE",
  BlockSuspend = "BLOCK_SUSPEND",
  Chown = "CHOWN",
  DacOverride = "DAC_OVERRIDE",
  DacReadSearch = "DAC_READ_SEARCH",
  Fowner = "FOWNER",
  Fsetid = "FSETID",
  IpcLock = "IPC_LOCK",
  IpcOwner = "IPC_OWNER",
  Kill = "KILL",
  Lease = "LEASE",
  LinuxImmutable = "LINUX_IMMUTABLE",
  MacAdmin = "MAC_ADMIN",
  MacOverride = "MAC_OVERRIDE",
  Mknod = "MKNOD",
  NetAdmin = "NET_ADMIN",
  NetBindService = "NET_BIND_SERVICE",
  NetBroadcast = "NET_BROADCAST",
  NetRaw = "NET_RAW",
  Setfcap = "SETFCAP",
  Setgid = "SETGID",
  Setpcap = "SETPCAP",
  Setuid = "SETUID",
  SysAdmin = "SYS_ADMIN",
  SysBoot = "SYS_BOOT",
  SysChroot = "SYS_CHROOT",
  SysModule = "SYS_MODULE",
  SysNice = "SYS_NICE",
  SysPacct = "SYS_PACCT",
  SysPtrace = "SYS_PTRACE",
  SysRawio = "SYS_RAWIO",
  SysResource = "SYS_RESOURCE",
  SysTime = "SYS_TIME",
  SysTtyConfig = "SYS_TTY_CONFIG",
  Syslog = "SYSLOG",
  WakeAlarm = "WAKE_ALARM"
}

/**
 * Permissions for device access
 */
export enum DevicePermission {
  /**
   * Read
   */
  Read = "read",

  /**
   * Write
   */
  Write = "write",

  /**
   * Make a node
   */
  Mknod = "mknod",
}

/**
 * Options for a tmpfs mount
 */
export enum TmpfsMountOption {
  Defaults = "defaults",
  Ro = "ro",
  Rw = "rw",
  Suid = "suid",
  Nosuid = "nosuid",
  Dev = "dev",
  Nodev = "nodev",
  Exec = "exec",
  Noexec = "noexec",
  Sync = "sync",
  Async = "async",
  Dirsync = "dirsync",
  Remount = "remount",
  Mand = "mand",
  Nomand = "nomand",
  Atime = "atime",
  Noatime = "noatime",
  Diratime = "diratime",
  Nodiratime = "nodiratime",
  Bind = "bind",
  Rbind = "rbind",
  Unbindable = "unbindable",
  Runbindable = "runbindable",
  Private = "private",
  Rprivate = "rprivate",
  Shared = "shared",
  Rshared = "rshared",
  Slave = "slave",
  Rslave = "rslave",
  Relatime = "relatime",
  Norelatime = "norelatime",
  Strictatime = "strictatime",
  Nostrictatime = "nostrictatime",
  Mode = "mode",
  Uid = "uid",
  Gid = "gid",
  NrInodes = "nr_inodes",
  NrBlocks = "nr_blocks",
  Mpol = "mpol"
}
