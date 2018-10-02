import { cloudformation } from './ecs.generated';

export class LinuxParameters {
  public initProcessEnabled?: boolean;

  public sharedMemorySize?: number;

  private readonly addCapabilities: Capability[] = [];

  private readonly dropCapabilities: Capability[] = [];

  // private readonly devices: Device[] = [];

  // private readonly tmpfs: Tmpfs[] = [];

  /**
   * AddCapability only works with EC2 launch type
   */
  public addCapability(...cap: Capability[]) {
    this.addCapabilities.push(...cap);
  }

  public dropCapability(...cap: Capability[]) {
    this.dropCapabilities.push(...cap);
  }

  public toLinuxParametersJson(): cloudformation.TaskDefinitionResource.LinuxParametersProperty {
    return {
      initProcessEnabled: this.initProcessEnabled,
      sharedMemorySize: this.sharedMemorySize,
      capabilities: {
        add: this.addCapabilities,
        drop: this.dropCapabilities,
      }
    };
  }
}

// export interface Device {
// }

// export interface Tmpfs {
// }

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
