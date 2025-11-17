/**
 * Represents a platform for an EC2 Image Builder image
 */
export enum Platform {
  /**
   * Platform for Linux
   */
  LINUX = 'Linux',

  /**
   * Platform for Windows
   */
  WINDOWS = 'Windows',

  /**
   * Platform for macOS
   */
  MAC_OS = 'macOS',
}

/**
 * Represents an OS version for an EC2 Image Builder image
 */
export class OSVersion {
  /**
   * OS version for all Linux images
   */
  public static readonly LINUX = new OSVersion(Platform.LINUX);

  /**
   * OS version for all macOS images
   */
  public static readonly MAC_OS = new OSVersion(Platform.MAC_OS);

  /**
   * OS version for all Windows images
   */
  public static readonly WINDOWS = new OSVersion(Platform.WINDOWS);

  /**
   * OS version for all Amazon Linux images
   */
  public static readonly AMAZON_LINUX = new OSVersion(Platform.LINUX, 'Amazon Linux');

  /**
   * OS version for Amazon Linux 2
   */
  public static readonly AMAZON_LINUX_2 = new OSVersion(Platform.LINUX, 'Amazon Linux 2');

  /**
   * OS version for Amazon Linux 2023
   */
  public static readonly AMAZON_LINUX_2023 = new OSVersion(Platform.LINUX, 'Amazon Linux 2023');

  /**
   * OS version for macOS 14
   */
  public static readonly MAC_OS_14 = new OSVersion(Platform.MAC_OS, 'macOS 14');

  /**
   * OS version for macOS 15
   */
  public static readonly MAC_OS_15 = new OSVersion(Platform.MAC_OS, 'macOS 15');

  /**
   * OS version for all Red Hat Enterprise Linux images
   */
  public static readonly REDHAT_ENTERPRISE_LINUX = new OSVersion(Platform.LINUX, 'Red Hat Enterprise Linux');

  /**
   * OS version for Red Hat Enterprise Linux 8
   */
  public static readonly REDHAT_ENTERPRISE_LINUX_8 = new OSVersion(Platform.LINUX, 'Red Hat Enterprise Linux 8');

  /**
   * OS version for Red Hat Enterprise Linux 9
   */
  public static readonly REDHAT_ENTERPRISE_LINUX_9 = new OSVersion(Platform.LINUX, 'Red Hat Enterprise Linux 9');

  /**
   * OS version for Red Hat Enterprise Linux 10
   */
  public static readonly REDHAT_ENTERPRISE_LINUX_10 = new OSVersion(Platform.LINUX, 'Red Hat Enterprise Linux 10');

  /**
   * OS version for all SLES images
   */
  public static readonly SLES = new OSVersion(Platform.LINUX, 'SLES');

  /**
   * OS version for SLES 15
   */
  public static readonly SLES_15 = new OSVersion(Platform.LINUX, 'SLES 15');

  /**
   * OS version for all Ubuntu images
   */
  public static readonly UBUNTU = new OSVersion(Platform.LINUX, 'Ubuntu');

  /**
   * OS version for Ubuntu 22.04
   */
  public static readonly UBUNTU_22_04 = new OSVersion(Platform.LINUX, 'Ubuntu 22');

  /**
   * OS version for Ubuntu 24.04
   */
  public static readonly UBUNTU_24_04 = new OSVersion(Platform.LINUX, 'Ubuntu 24');

  /**
   * OS version for all Windows server images
   */
  public static readonly WINDOWS_SERVER = new OSVersion(Platform.WINDOWS, 'Microsoft Windows Server');

  /**
   * OS version for Windows Server 2016
   */
  public static readonly WINDOWS_SERVER_2016 = new OSVersion(Platform.WINDOWS, 'Microsoft Windows Server 2016');
  /**
   * OS version for Windows Server 2019
   */
  public static readonly WINDOWS_SERVER_2019 = new OSVersion(Platform.WINDOWS, 'Microsoft Windows Server 2019');
  /**
   * OS version for Windows Server 2022
   */
  public static readonly WINDOWS_SERVER_2022 = new OSVersion(Platform.WINDOWS, 'Microsoft Windows Server 2022');
  /**
   * OS version for Windows Server 2025
   */
  public static readonly WINDOWS_SERVER_2025 = new OSVersion(Platform.WINDOWS, 'Microsoft Windows Server 2025');

  /**
   * Constructs an OS version with a custom name
   *
   * @param platform The platform of the OS version
   * @param osVersion The custom OS version to use
   */
  public static custom(platform: Platform, osVersion?: string) {
    return new OSVersion(platform, osVersion);
  }

  /**
   * The Platform of the OS version
   */
  public readonly platform: Platform;

  /**
   * The OS version name
   */
  public readonly osVersion?: string;

  protected constructor(platform: Platform, osVersion?: string) {
    this.platform = platform;
    this.osVersion = osVersion;
  }
}
