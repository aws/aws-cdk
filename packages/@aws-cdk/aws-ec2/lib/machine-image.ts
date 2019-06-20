import ssm = require('@aws-cdk/aws-ssm');
import { Construct, Stack, Token } from '@aws-cdk/cdk';
import { UserData } from './user-data';
import { WindowsVersion } from './windows-versions';

/**
 * Interface for classes that can select an appropriate machine image to use
 */
export interface IMachineImageSource {
  /**
   * Return the image to use in the given context
   */
  getImage(scope: Construct): MachineImage;
}

/**
 * Select the latest version of the indicated Windows version
 *
 * The AMI ID is selected using the values published to the SSM parameter store.
 *
 * https://aws.amazon.com/blogs/mt/query-for-the-latest-windows-ami-using-systems-manager-parameter-store/
 */
export class WindowsImage implements IMachineImageSource  {
  constructor(private readonly version: WindowsVersion) {
  }

  /**
   * Return the image to use in the given context
   */
  public getImage(scope: Construct): MachineImage {
    const parameterName = this.imageParameterName(this.version);
    const ami = ssm.StringParameter.valueForStringParameter(scope, parameterName);
    return new MachineImage(ami, OperatingSystem.windows());
  }

  /**
   * Construct the SSM parameter name for the given Windows image
   */
  private imageParameterName(version: WindowsVersion): string {
    return '/aws/service/ami-windows-latest/' + version;
  }
}

/**
 * Amazon Linux image properties
 */
export interface AmazonLinuxImageProps {
  /**
   * What generation of Amazon Linux to use
   *
   * @default AmazonLinux
   */
  readonly generation?: AmazonLinuxGeneration;

  /**
   * What edition of Amazon Linux to use
   *
   * @default Standard
   */
  readonly edition?: AmazonLinuxEdition;

  /**
   * Virtualization type
   *
   * @default HVM
   */
  readonly virtualization?: AmazonLinuxVirt;

  /**
   * What storage backed image to use
   *
   * @default GeneralPurpose
   */
  readonly storage?: AmazonLinuxStorage;
}

/**
 * Selects the latest version of Amazon Linux
 *
 * The AMI ID is selected using the values published to the SSM parameter store.
 */
export class AmazonLinuxImage implements IMachineImageSource {
  private readonly generation: AmazonLinuxGeneration;
  private readonly edition: AmazonLinuxEdition;
  private readonly virtualization: AmazonLinuxVirt;
  private readonly storage: AmazonLinuxStorage;

  constructor(props?: AmazonLinuxImageProps) {
    this.generation = (props && props.generation) || AmazonLinuxGeneration.AMAZON_LINUX;
    this.edition = (props && props.edition) || AmazonLinuxEdition.STANDARD;
    this.virtualization = (props && props.virtualization) || AmazonLinuxVirt.HVM;
    this.storage = (props && props.storage) || AmazonLinuxStorage.GENERAL_PURPOSE;
  }

  /**
   * Return the image to use in the given context
   */
  public getImage(scope: Construct): MachineImage {
    const parts: Array<string|undefined> = [
      this.generation,
      'ami',
      this.edition !== AmazonLinuxEdition.STANDARD ? this.edition : undefined,
      this.virtualization,
      'x86_64', // No 32-bits images vended through this
      this.storage
    ].filter(x => x !== undefined); // Get rid of undefineds

    const parameterName = '/aws/service/ami-amazon-linux-latest/' + parts.join('-');
    const ami = ssm.StringParameter.valueForStringParameter(scope, parameterName);
    return new MachineImage(ami, OperatingSystem.linux());
  }
}

/**
 * What generation of Amazon Linux to use
 */
export enum AmazonLinuxGeneration {
  /**
   * Amazon Linux
   */
  AMAZON_LINUX = 'amzn',

  /**
   * Amazon Linux 2
   */
  AMAZON_LINUX_2 = 'amzn2',
}

/**
 * Amazon Linux edition
 */
export enum AmazonLinuxEdition {
  /**
   * Standard edition
   */
  STANDARD = 'standard',

  /**
   * Minimal edition
   */
  MINIMAL = 'minimal'
}

/**
 * Virtualization type for Amazon Linux
 */
export enum AmazonLinuxVirt {
  /**
   * HVM virtualization (recommended)
   */
  HVM = 'hvm',

  /**
   * PV virtualization
   */
  PV = 'pv'
}

export enum AmazonLinuxStorage {
  /**
   * EBS-backed storage
   */
  EBS = 'ebs',

  /**
   * S3-backed storage
   */
  S3 = 'ebs',

  /**
   * General Purpose-based storage (recommended)
   */
  GENERAL_PURPOSE = 'gp2',
}

/**
 * Construct a Linux machine image from an AMI map
 *
 * Linux images IDs are not published to SSM parameter store yet, so you'll have to
 * manually specify an AMI map.
 */
export class GenericLinuxImage implements IMachineImageSource  {
  constructor(private readonly amiMap: {[region: string]: string}) {
  }

  public getImage(scope: Construct): MachineImage {
    const region = Stack.of(scope).region;
    if (Token.isUnresolved(region)) {
      throw new Error(`Unable to determine AMI from AMI map since stack is region-agnostic`);
    }

    const ami = region !== 'test-region' ? this.amiMap[region] : 'ami-12345';
    if (!ami) {
      throw new Error(`Unable to find AMI in AMI map: no AMI specified for region '${region}'`);
    }

    return new MachineImage(ami, OperatingSystem.linux());
  }
}

/**
 * Representation of a machine to be launched
 *
 * Combines an AMI ID with an OS.
 */
export class MachineImage {
  constructor(public readonly imageId: string, public readonly os: OperatingSystem) {
  }
}

/**
 * The OS type of a particular image
 */
export enum OperatingSystemType {
  LINUX,
  WINDOWS,
}

/**
 * Abstraction of OS features we need to be aware of
 */
export abstract class OperatingSystem {
  /**
   * OS features specialized for Windows
   */
  public static windows(): OperatingSystem {
    class WindowsOS extends OperatingSystem {
      public readonly type = OperatingSystemType.WINDOWS;
      public createDefaultUserData() {
        return UserData.forWindows();
      }
    }
    return new WindowsOS();
  }

  /**
   * OS features specialized for Linux
   */
  public static linux(): OperatingSystem {
    class LinuxOS extends OperatingSystem {
      public readonly type = OperatingSystemType.LINUX;
      public createDefaultUserData() {
        return UserData.forLinux();
      }
    }
    return new LinuxOS();
  }

  public abstract createDefaultUserData(): UserData;

  public abstract get type(): OperatingSystemType;
}
