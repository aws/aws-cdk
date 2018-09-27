import { Construct, SSMParameterProvider, Stack } from '@aws-cdk/cdk';

/**
 * Interface for classes that can select an appropriate machine image to use
 */
export interface IMachineImageSource {
  /**
   * Return the image to use in the given context
   */
  getImage(parent: Construct): MachineImage;
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
  public getImage(parent: Construct): MachineImage {
    const ssmProvider = new SSMParameterProvider(parent);

    const parameterName = this.imageParameterName(this.version);
    const ami = ssmProvider.getString(parameterName);
    return new MachineImage(ami, new WindowsOS());
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
   * What edition of Amazon Linux to use
   *
   * @default Standard
   */
  edition?: AmazonLinuxEdition;

  /**
   * Virtualization type
   *
   * @default HVM
   */
  virtualization?: AmazonLinuxVirt;

  /**
   * What storage backed image to use
   *
   * @default GeneralPurpose
   */
  storage?: AmazonLinuxStorage;
}

/**
 * Selects the latest version of Amazon Linux
 *
 * The AMI ID is selected using the values published to the SSM parameter store.
 */
export class AmazonLinuxImage implements IMachineImageSource {
  private readonly edition?: AmazonLinuxEdition;

  private readonly virtualization?: AmazonLinuxVirt;

  private readonly storage?: AmazonLinuxStorage;

  constructor(props?: AmazonLinuxImageProps) {
    this.edition = (props && props.edition) || AmazonLinuxEdition.Standard;
    this.virtualization = (props && props.virtualization) || AmazonLinuxVirt.HVM;
    this.storage = (props && props.storage) || AmazonLinuxStorage.GeneralPurpose;
  }

  /**
   * Return the image to use in the given context
   */
  public getImage(parent: Construct): MachineImage {
    const parts: Array<string|undefined> = [
      'amzn-ami',
      this.edition !== AmazonLinuxEdition.Standard ? this.edition : undefined,
      this.virtualization,
      'x86_64', // No 32-bits images vended through this
      this.storage
    ].filter(x => x !== undefined); // Get rid of undefineds

    const parameterName = '/aws/service/ami-amazon-linux-latest/' + parts.join('-');

    const ssmProvider = new SSMParameterProvider(parent);
    const ami = ssmProvider.getString(parameterName);
    return new MachineImage(ami, new LinuxOS());
  }
}

/**
 * Amazon Linux edition
 */
export enum AmazonLinuxEdition {
  /**
   * Standard edition
   */
  Standard = 'standard',

  /**
   * Minimal edition
   */
  Minimal = 'minimal'
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
  GeneralPurpose = 'gp2',
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

  public getImage(parent: Construct): MachineImage {
    const stack = Stack.find(parent);
    const region = stack.requireRegion('AMI cannot be determined');
    const ami = this.amiMap[region];
    if (!ami) {
      throw new Error(`Unable to find AMI in AMI map: no AMI specified for region '${region}'`);
    }

    return new MachineImage(ami, new LinuxOS());
  }
}

/**
 * The Windows version to use for the WindowsImage
 */
export enum WindowsVersion {
  WindowsServer2016TurksihFullBase = 'Windows_Server-2016-Turkish-Full-Base',
  WindowsServer2016SwedishFullBase = 'Windows_Server-2016-Swedish-Full-Base',
  WindowsServer2016SpanishFullBase = 'Windows_Server-2016-Spanish-Full-Base',
  WindowsServer2016RussianFullBase = 'Windows_Server-2016-Russian-Full-Base',
  WindowsServer2016PortuguesePortugalFullBase = 'Windows_Server-2016-Portuguese_Portugal-Full-Base',
  WindowsServer2016PortugueseBrazilFullBase = 'Windows_Server-2016-Portuguese_Brazil-Full-Base',
  WindowsServer2016PolishFullBase = 'Windows_Server-2016-Polish-Full-Base',
  WindowsServer2016KoreanFullSQL2016Base = 'Windows_Server-2016-Korean-Full-SQL_2016_SP1_Standard',
  WindowsServer2016KoreanFullBase = 'Windows_Server-2016-Korean-Full-Base',
  WindowsServer2016JapaneseFullSQL2016Web = 'Windows_Server-2016-Japanese-Full-SQL_2016_SP1_Web',
  WindowsServer2016JapaneseFullSQL2016Standard = 'Windows_Server-2016-Japanese-Full-SQL_2016_SP1_Standard',
  WindowsServer2016JapaneseFullSQL2016Express = 'Windows_Server-2016-Japanese-Full-SQL_2016_SP1_Express',
  WindowsServer2016JapaneseFullSQL2016Enterprise = 'Windows_Server-2016-Japanese-Full-SQL_2016_SP1_Enterprise',
  WindowsServer2016JapaneseFullBase = 'Windows_Server-2016-Japanese-Full-Base',
  WindowsServer2016ItalianFullBase = 'Windows_Server-2016-Italian-Full-Base',
  WindowsServer2016HungarianFullBase = 'Windows_Server-2016-Hungarian-Full-Base',
  WindowsServer2016GermanFullBase = 'Windows_Server-2016-German-Full-Base',
  WindowsServer2016FrenchFullBase = 'Windows_Server-2016-French-Full-Base',
  WindowsServer2016EnglishNanoBase = 'Windows_Server-2016-English-Nano-Base',
  WindowsServer2016EnglishFullSQL2017Web = 'Windows_Server-2016-English-Full-SQL_2017_Web',
  WindowsServer2016EnglishFullSQL2017Standard = 'Windows_Server-2016-English-Full-SQL_2017_Standard',
  WindowsServer2016EnglishFullSQL2017Express = 'Windows_Server-2016-English-Full-SQL_2017_Express',
  WindowsServer2016EnglishFullSQL2017Enterprise = 'Windows_Server-2016-English-Full-SQL_2017_Enterprise',
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
  Linux,
  Windows,
}

/**
 * Abstraction of OS features we need to be aware of
 */
export abstract class OperatingSystem {
  public abstract createUserData(scripts: string[]): string;
  abstract get type(): OperatingSystemType;
}

/**
 * OS features specialized for Windows
 */
export class WindowsOS extends OperatingSystem {
  public createUserData(scripts: string[]): string {
    return `<powershell>${scripts.join('\n')}</powershell>`;
  }

  get type(): OperatingSystemType {
    return OperatingSystemType.Windows;
  }
}

/**
 * OS features specialized for Linux
 */
export class LinuxOS extends OperatingSystem {
  public createUserData(scripts: string[]): string {
    return '#!/bin/bash\n' + scripts.join('\n');
  }

  get type(): OperatingSystemType {
    return OperatingSystemType.Linux;
  }
}
