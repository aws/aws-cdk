import { cloudformation } from './ecs.generated';

export class LinuxParameters {
  public initProcessEnabled?: boolean;

  public sharedMemorySize?: number;

  private readonly capAdd: Capability[] = [];

  private readonly capDrop: Capability[] = [];

  private readonly devices: Device[] = [];

  private readonly tmpfs: Tmpfs[] = [];

  /**
   * AddCapability only works with EC2 launch type
   */
  public addCapabilities(...cap: Capability[]) {
    this.capAdd.push(...cap);
  }

  public dropCapabilities(...cap: Capability[]) {
    this.capDrop.push(...cap);
  }

  public addDevices(...device: Device[]) {
    this.devices.push(...device);
  }

  public addTmpfs(...tmpfs: Tmpfs[]) {
    this.tmpfs.push(...tmpfs);
  }

  public renderLinuxParameters(): cloudformation.TaskDefinitionResource.LinuxParametersProperty {
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

export interface Device {
  containerPath?: string,
  hostPath: string,
  permissions?: DevicePermission[]
}

function renderDevice(device: Device): cloudformation.TaskDefinitionResource.DeviceProperty {
  return {
    containerPath: device.containerPath,
    hostPath: device.hostPath,
    permissions: device.permissions
  }
}

export interface Tmpfs {
  containerPath: string,
  size: number,
  mountOptions?: TmpfsMountOption[],
}

function renderTmpfs(tmpfs: Tmpfs): cloudformation.TaskDefinitionResource.TmpfsProperty {
  return {
    containerPath: tmpfs.containerPath,
    size: tmpfs.size,
    mountOptions: tmpfs.mountOptions
  }
}

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

export enum DevicePermission {
  Read = "read",
  Write = "write",
  Mknod = "mknod",
}

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
