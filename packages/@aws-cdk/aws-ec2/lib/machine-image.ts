import { Construct, Context, Stack, Token } from '@aws-cdk/cdk';

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
    const ami = Context.getSsmParameter(scope, this.imageParameterName(this.version));
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
    this.generation = (props && props.generation) || AmazonLinuxGeneration.AmazonLinux;
    this.edition = (props && props.edition) || AmazonLinuxEdition.Standard;
    this.virtualization = (props && props.virtualization) || AmazonLinuxVirt.HVM;
    this.storage = (props && props.storage) || AmazonLinuxStorage.GeneralPurpose;
  }

  /**
   * Return the image to use in the given context
   */
  public getImage(scope: Construct): MachineImage {
    const parts: Array<string|undefined> = [
      this.generation,
      'ami',
      this.edition !== AmazonLinuxEdition.Standard ? this.edition : undefined,
      this.virtualization,
      'x86_64', // No 32-bits images vended through this
      this.storage
    ].filter(x => x !== undefined); // Get rid of undefineds

    const parameterName = '/aws/service/ami-amazon-linux-latest/' + parts.join('-');
    const ami = Context.getSsmParameter(scope, parameterName);
    return new MachineImage(ami, new LinuxOS());
  }
}

/**
 * What generation of Amazon Linux to use
 */
export enum AmazonLinuxGeneration {
  /**
   * Amazon Linux
   */
  AmazonLinux = 'amzn',

  /**
   * Amazon Linux 2
   */
  AmazonLinux2 = 'amzn2',
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

  public getImage(scope: Construct): MachineImage {
    let region = Stack.of(scope).region;
    if (Token.isUnresolved(region)) {
      region = Context.getDefaultRegion(scope);
    }

    const ami = region !== 'test-region' ? this.amiMap[region] : 'ami-12345';
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
  WindowsServer2008SP2English64BitSQL2008SP4Express = 'Windows_Server-2008-SP2-English-64Bit-SQL_2008_SP4_Express',
  WindowsServer2012R2RTMChineseSimplified64BitBase = 'Windows_Server-2012-R2_RTM-Chinese_Simplified-64Bit-Base',
  WindowsServer2012R2RTMChineseTraditional64BitBase = 'Windows_Server-2012-R2_RTM-Chinese_Traditional-64Bit-Base',
  WindowsServer2012R2RTMDutch64BitBase = 'Windows_Server-2012-R2_RTM-Dutch-64Bit-Base',
  WindowsServer2012R2RTMEnglish64BitSQL2014SP2Enterprise = 'Windows_Server-2012-R2_RTM-English-64Bit-SQL_2014_SP2_Enterprise',
  WindowsServer2012R2RTMHungarian64BitBase = 'Windows_Server-2012-R2_RTM-Hungarian-64Bit-Base',
  WindowsServer2012R2RTMJapanese64BitBase = 'Windows_Server-2012-R2_RTM-Japanese-64Bit-Base',
  WindowsServer2016EnglishCoreContainers = 'Windows_Server-2016-English-Core-Containers',
  WindowsServer2016EnglishCoreSQL2016SP1Web = 'Windows_Server-2016-English-Core-SQL_2016_SP1_Web',
  WindowsServer2016GermanFullBase = 'Windows_Server-2016-German-Full-Base',
  WindowsServer2003R2SP2LanguagePacks32BitBase = 'Windows_Server-2003-R2_SP2-Language_Packs-32Bit-Base',
  WindowsServer2008R2SP1English64BitSQL2008R2SP3Web = 'Windows_Server-2008-R2_SP1-English-64Bit-SQL_2008_R2_SP3_Web',
  WindowsServer2008R2SP1English64BitSQL2012SP4Express = 'Windows_Server-2008-R2_SP1-English-64Bit-SQL_2012_SP4_Express',
  WindowsServer2008R2SP1PortugueseBrazil64BitCore = 'Windows_Server-2008-R2_SP1-Portuguese_Brazil-64Bit-Core',
  WindowsServer2012R2RTMEnglish64BitSQL2016SP2Standard = 'Windows_Server-2012-R2_RTM-English-64Bit-SQL_2016_SP2_Standard',
  WindowsServer2012RTMEnglish64BitSQL2014SP2Express = 'Windows_Server-2012-RTM-English-64Bit-SQL_2014_SP2_Express',
  WindowsServer2012RTMItalian64BitBase = 'Windows_Server-2012-RTM-Italian-64Bit-Base',
  WindowsServer2016EnglishCoreSQL2016SP1Express = 'Windows_Server-2016-English-Core-SQL_2016_SP1_Express',
  WindowsServer2016EnglishDeepLearning = 'Windows_Server-2016-English-Deep-Learning',
  WindowsServer2019ItalianFullBase = 'Windows_Server-2019-Italian-Full-Base',
  WindowsServer2008R2SP1Korean64BitBase = 'Windows_Server-2008-R2_SP1-Korean-64Bit-Base',
  WindowsServer2012R2RTMEnglish64BitSQL2016SP1Express = 'Windows_Server-2012-R2_RTM-English-64Bit-SQL_2016_SP1_Express',
  WindowsServer2012R2RTMJapanese64BitSQL2016SP2Web = 'Windows_Server-2012-R2_RTM-Japanese-64Bit-SQL_2016_SP2_Web',
  WindowsServer2016JapaneseFullSQL2016SP2Web = 'Windows_Server-2016-Japanese-Full-SQL_2016_SP2_Web',
  WindowsServer2016KoreanFullBase = 'Windows_Server-2016-Korean-Full-Base',
  WindowsServer2016KoreanFullSQL2016SP2Standard = 'Windows_Server-2016-Korean-Full-SQL_2016_SP2_Standard',
  WindowsServer2016PortuguesePortugalFullBase = 'Windows_Server-2016-Portuguese_Portugal-Full-Base',
  WindowsServer2019EnglishFullSQL2017Web = 'Windows_Server-2019-English-Full-SQL_2017_Web',
  WindowsServer2019FrenchFullBase = 'Windows_Server-2019-French-Full-Base',
  WindowsServer2019KoreanFullBase = 'Windows_Server-2019-Korean-Full-Base',
  WindowsServer2008R2SP1ChineseHongKongSAR64BitBase = 'Windows_Server-2008-R2_SP1-Chinese_Hong_Kong_SAR-64Bit-Base',
  WindowsServer2008R2SP1ChinesePRC64BitBase = 'Windows_Server-2008-R2_SP1-Chinese_PRC-64Bit-Base',
  WindowsServer2012RTMFrench64BitBase = 'Windows_Server-2012-RTM-French-64Bit-Base',
  WindowsServer2016EnglishFullContainers = 'Windows_Server-2016-English-Full-Containers',
  WindowsServer2016EnglishFullSQL2016SP1Standard = 'Windows_Server-2016-English-Full-SQL_2016_SP1_Standard',
  WindowsServer2016RussianFullBase = 'Windows_Server-2016-Russian-Full-Base',
  WindowsServer2019ChineseSimplifiedFullBase = 'Windows_Server-2019-Chinese_Simplified-Full-Base',
  WindowsServer2019EnglishFullSQL2016SP2Standard = 'Windows_Server-2019-English-Full-SQL_2016_SP2_Standard',
  WindowsServer2019HungarianFullBase = 'Windows_Server-2019-Hungarian-Full-Base',
  WindowsServer2008R2SP1English64BitSQL2008R2SP3Express = 'Windows_Server-2008-R2_SP1-English-64Bit-SQL_2008_R2_SP3_Express',
  WindowsServer2008R2SP1LanguagePacks64BitBase = 'Windows_Server-2008-R2_SP1-Language_Packs-64Bit-Base',
  WindowsServer2008SP2English32BitBase = 'Windows_Server-2008-SP2-English-32Bit-Base',
  WindowsServer2012R2RTMEnglish64BitSQL2012SP4Enterprise = 'Windows_Server-2012-R2_RTM-English-64Bit-SQL_2012_SP4_Enterprise',
  WindowsServer2012RTMChineseTraditional64BitBase = 'Windows_Server-2012-RTM-Chinese_Traditional-64Bit-Base',
  WindowsServer2012RTMEnglish64BitSQL2008R2SP3Express = 'Windows_Server-2012-RTM-English-64Bit-SQL_2008_R2_SP3_Express',
  WindowsServer2012RTMEnglish64BitSQL2014SP2Standard = 'Windows_Server-2012-RTM-English-64Bit-SQL_2014_SP2_Standard',
  WindowsServer2012RTMJapanese64BitSQL2014SP2Express = 'Windows_Server-2012-RTM-Japanese-64Bit-SQL_2014_SP2_Express',
  WindowsServer2016PolishFullBase = 'Windows_Server-2016-Polish-Full-Base',
  WindowsServer2019EnglishFullSQL2016SP2Web = 'Windows_Server-2019-English-Full-SQL_2016_SP2_Web',
  WindowsServer2012R2RTMEnglish64BitSQL2014SP3Standard = 'Windows_Server-2012-R2_RTM-English-64Bit-SQL_2014_SP3_Standard',
  WindowsServer2012R2RTMEnglish64BitSQL2016SP2Express = 'Windows_Server-2012-R2_RTM-English-64Bit-SQL_2016_SP2_Express',
  WindowsServer2012R2RTMEnglishDeepLearning = 'Windows_Server-2012-R2_RTM-English-Deep-Learning',
  WindowsServer2012R2RTMGerman64BitBase = 'Windows_Server-2012-R2_RTM-German-64Bit-Base',
  WindowsServer2012R2RTMJapanese64BitSQL2016SP1Express = 'Windows_Server-2012-R2_RTM-Japanese-64Bit-SQL_2016_SP1_Express',
  WindowsServer2012R2RTMRussian64BitBase = 'Windows_Server-2012-R2_RTM-Russian-64Bit-Base',
  WindowsServer2012RTMChineseTraditionalHongKongSAR64BitBase = 'Windows_Server-2012-RTM-Chinese_Traditional_Hong_Kong_SAR-64Bit-Base',
  WindowsServer2012RTMHungarian64BitBase = 'Windows_Server-2012-RTM-Hungarian-64Bit-Base',
  WindowsServer2012RTMJapanese64BitSQL2014SP3Standard = 'Windows_Server-2012-RTM-Japanese-64Bit-SQL_2014_SP3_Standard',
  WindowsServer2019EnglishFullHyperV = 'Windows_Server-2019-English-Full-HyperV',
  WindowsServer2003R2SP2English64BitSQL2005SP4Express = 'Windows_Server-2003-R2_SP2-English-64Bit-SQL_2005_SP4_Express',
  WindowsServer2008R2SP1Japanese64BitSQL2012SP4Express = 'Windows_Server-2008-R2_SP1-Japanese-64Bit-SQL_2012_SP4_Express',
  WindowsServer2012RTMGerman64BitBase = 'Windows_Server-2012-RTM-German-64Bit-Base',
  WindowsServer2012RTMJapanese64BitSQL2008R2SP3Standard = 'Windows_Server-2012-RTM-Japanese-64Bit-SQL_2008_R2_SP3_Standard',
  WindowsServer2016EnglishFullSQL2016SP2Standard = 'Windows_Server-2016-English-Full-SQL_2016_SP2_Standard',
  WindowsServer2019EnglishFullSQL2017Express = 'Windows_Server-2019-English-Full-SQL_2017_Express',
  WindowsServer2019JapaneseFullBase = 'Windows_Server-2019-Japanese-Full-Base',
  WindowsServer2019RussianFullBase = 'Windows_Server-2019-Russian-Full-Base',
  WindowsServer2012R2RTMEnglish64BitSQL2014SP2Standard = 'Windows_Server-2012-R2_RTM-English-64Bit-SQL_2014_SP2_Standard',
  WindowsServer2012R2RTMItalian64BitBase = 'Windows_Server-2012-R2_RTM-Italian-64Bit-Base',
  WindowsServer2012RTMEnglish64BitBase = 'Windows_Server-2012-RTM-English-64Bit-Base',
  WindowsServer2012RTMEnglish64BitSQL2008R2SP3Standard = 'Windows_Server-2012-RTM-English-64Bit-SQL_2008_R2_SP3_Standard',
  WindowsServer2016EnglishFullHyperV = 'Windows_Server-2016-English-Full-HyperV',
  WindowsServer2016EnglishFullSQL2016SP2Enterprise = 'Windows_Server-2016-English-Full-SQL_2016_SP2_Enterprise',
  WindowsServer2019ChineseTraditionalFullBase = 'Windows_Server-2019-Chinese_Traditional-Full-Base',
  WindowsServer2019EnglishCoreBase = 'Windows_Server-2019-English-Core-Base',
  WindowsServer2019EnglishCoreContainersLatest = 'Windows_Server-2019-English-Core-ContainersLatest',
  WindowsServer2008SP2English64BitBase = 'Windows_Server-2008-SP2-English-64Bit-Base',
  WindowsServer2012R2RTMFrench64BitBase = 'Windows_Server-2012-R2_RTM-French-64Bit-Base',
  WindowsServer2012R2RTMPolish64BitBase = 'Windows_Server-2012-R2_RTM-Polish-64Bit-Base',
  WindowsServer2012RTMEnglish64BitSQL2012SP4Express = 'Windows_Server-2012-RTM-English-64Bit-SQL_2012_SP4_Express',
  WindowsServer2012RTMEnglish64BitSQL2014SP3Standard = 'Windows_Server-2012-RTM-English-64Bit-SQL_2014_SP3_Standard',
  WindowsServer2012RTMJapanese64BitSQL2012SP4Standard = 'Windows_Server-2012-RTM-Japanese-64Bit-SQL_2012_SP4_Standard',
  WindowsServer2016EnglishCoreContainersLatest = 'Windows_Server-2016-English-Core-ContainersLatest',
  WindowsServer2019EnglishFullSQL2016SP2Express = 'Windows_Server-2019-English-Full-SQL_2016_SP2_Express',
  WindowsServer2019TurkishFullBase = 'Windows_Server-2019-Turkish-Full-Base',
  WindowsServer2012R2RTMEnglish64BitSQL2014SP2Express = 'Windows_Server-2012-R2_RTM-English-64Bit-SQL_2014_SP2_Express',
  WindowsServer2012R2RTMEnglish64BitSQL2014SP3Web = 'Windows_Server-2012-R2_RTM-English-64Bit-SQL_2014_SP3_Web',
  WindowsServer2012R2RTMJapanese64BitSQL2016SP1Web = 'Windows_Server-2012-R2_RTM-Japanese-64Bit-SQL_2016_SP1_Web',
  WindowsServer2012R2RTMPortugueseBrazil64BitBase = 'Windows_Server-2012-R2_RTM-Portuguese_Brazil-64Bit-Base',
  WindowsServer2012R2RTMPortuguesePortugal64BitBase = 'Windows_Server-2012-R2_RTM-Portuguese_Portugal-64Bit-Base',
  WindowsServer2012R2RTMSwedish64BitBase = 'Windows_Server-2012-R2_RTM-Swedish-64Bit-Base',
  WindowsServer2016EnglishFullSQL2016SP1Express = 'Windows_Server-2016-English-Full-SQL_2016_SP1_Express',
  WindowsServer2016ItalianFullBase = 'Windows_Server-2016-Italian-Full-Base',
  WindowsServer2016SpanishFullBase = 'Windows_Server-2016-Spanish-Full-Base',
  WindowsServer2019EnglishFullSQL2017Standard = 'Windows_Server-2019-English-Full-SQL_2017_Standard',
  WindowsServer2003R2SP2LanguagePacks64BitSQL2005SP4Standard = 'Windows_Server-2003-R2_SP2-Language_Packs-64Bit-SQL_2005_SP4_Standard',
  WindowsServer2008R2SP1Japanese64BitSQL2008R2SP3Standard = 'Windows_Server-2008-R2_SP1-Japanese-64Bit-SQL_2008_R2_SP3_Standard',
  WindowsServer2012R2RTMJapanese64BitSQL2016SP1Standard = 'Windows_Server-2012-R2_RTM-Japanese-64Bit-SQL_2016_SP1_Standard',
  WindowsServer2012RTMEnglish64BitSQL2008R2SP3Web = 'Windows_Server-2012-RTM-English-64Bit-SQL_2008_R2_SP3_Web',
  WindowsServer2012RTMJapanese64BitSQL2014SP2Web = 'Windows_Server-2012-RTM-Japanese-64Bit-SQL_2014_SP2_Web',
  WindowsServer2016EnglishCoreSQL2016SP2Enterprise = 'Windows_Server-2016-English-Core-SQL_2016_SP2_Enterprise',
  WindowsServer2016PortugueseBrazilFullBase = 'Windows_Server-2016-Portuguese_Brazil-Full-Base',
  WindowsServer2019EnglishFullBase = 'Windows_Server-2019-English-Full-Base',
  WindowsServer2003R2SP2English32BitBase = 'Windows_Server-2003-R2_SP2-English-32Bit-Base',
  WindowsServer2012R2RTMCzech64BitBase = 'Windows_Server-2012-R2_RTM-Czech-64Bit-Base',
  WindowsServer2012R2RTMEnglish64BitSQL2016SP1Standard = 'Windows_Server-2012-R2_RTM-English-64Bit-SQL_2016_SP1_Standard',
  WindowsServer2012R2RTMJapanese64BitSQL2014SP2Express = 'Windows_Server-2012-R2_RTM-Japanese-64Bit-SQL_2014_SP2_Express',
  WindowsServer2012RTMEnglish64BitSQL2012SP4Standard = 'Windows_Server-2012-RTM-English-64Bit-SQL_2012_SP4_Standard',
  WindowsServer2016EnglishCoreSQL2016SP1Enterprise = 'Windows_Server-2016-English-Core-SQL_2016_SP1_Enterprise',
  WindowsServer2016JapaneseFullSQL2016SP1Web = 'Windows_Server-2016-Japanese-Full-SQL_2016_SP1_Web',
  WindowsServer2016SwedishFullBase = 'Windows_Server-2016-Swedish-Full-Base',
  WindowsServer2016TurkishFullBase = 'Windows_Server-2016-Turkish-Full-Base',
  WindowsServer2008R2SP1English64BitCoreSQL2012SP4Standard = 'Windows_Server-2008-R2_SP1-English-64Bit-Core_SQL_2012_SP4_Standard',
  WindowsServer2008R2SP1LanguagePacks64BitSQL2008R2SP3Standard = 'Windows_Server-2008-R2_SP1-Language_Packs-64Bit-SQL_2008_R2_SP3_Standard',
  WindowsServer2012RTMCzech64BitBase = 'Windows_Server-2012-RTM-Czech-64Bit-Base',
  WindowsServer2012RTMTurkish64BitBase = 'Windows_Server-2012-RTM-Turkish-64Bit-Base',
  WindowsServer2016DutchFullBase = 'Windows_Server-2016-Dutch-Full-Base',
  WindowsServer2016EnglishFullSQL2016SP2Express = 'Windows_Server-2016-English-Full-SQL_2016_SP2_Express',
  WindowsServer2016EnglishFullSQL2017Enterprise = 'Windows_Server-2016-English-Full-SQL_2017_Enterprise',
  WindowsServer2016HungarianFullBase = 'Windows_Server-2016-Hungarian-Full-Base',
  WindowsServer2016KoreanFullSQL2016SP1Standard = 'Windows_Server-2016-Korean-Full-SQL_2016_SP1_Standard',
  WindowsServer2019SpanishFullBase = 'Windows_Server-2019-Spanish-Full-Base',
  WindowsServer2003R2SP2English64BitBase = 'Windows_Server-2003-R2_SP2-English-64Bit-Base',
  WindowsServer2008R2SP1English64BitBase = 'Windows_Server-2008-R2_SP1-English-64Bit-Base',
  WindowsServer2008R2SP1LanguagePacks64BitSQL2008R2SP3Express = 'Windows_Server-2008-R2_SP1-Language_Packs-64Bit-SQL_2008_R2_SP3_Express',
  WindowsServer2008SP2PortugueseBrazil64BitBase = 'Windows_Server-2008-SP2-Portuguese_Brazil-64Bit-Base',
  WindowsServer2012R2RTMEnglish64BitSQL2016SP1Web = 'Windows_Server-2012-R2_RTM-English-64Bit-SQL_2016_SP1_Web',
  WindowsServer2012R2RTMJapanese64BitSQL2014SP3Express = 'Windows_Server-2012-R2_RTM-Japanese-64Bit-SQL_2014_SP3_Express',
  WindowsServer2012R2RTMJapanese64BitSQL2016SP2Enterprise = 'Windows_Server-2012-R2_RTM-Japanese-64Bit-SQL_2016_SP2_Enterprise',
  WindowsServer2012RTMJapanese64BitBase = 'Windows_Server-2012-RTM-Japanese-64Bit-Base',
  WindowsServer2019EnglishFullContainersLatest = 'Windows_Server-2019-English-Full-ContainersLatest',
  WindowsServer2019EnglishFullSQL2017Enterprise = 'Windows_Server-2019-English-Full-SQL_2017_Enterprise',
  WindowsServer1709EnglishCoreContainersLatest = 'Windows_Server-1709-English-Core-ContainersLatest',
  WindowsServer1803EnglishCoreBase = 'Windows_Server-1803-English-Core-Base',
  WindowsServer2008R2SP1English64BitSQL2012SP4Web = 'Windows_Server-2008-R2_SP1-English-64Bit-SQL_2012_SP4_Web',
  WindowsServer2008R2SP1Japanese64BitBase = 'Windows_Server-2008-R2_SP1-Japanese-64Bit-Base',
  WindowsServer2008SP2English64BitSQL2008SP4Standard = 'Windows_Server-2008-SP2-English-64Bit-SQL_2008_SP4_Standard',
  WindowsServer2012R2RTMEnglish64BitBase = 'Windows_Server-2012-R2_RTM-English-64Bit-Base',
  WindowsServer2012RTMPortugueseBrazil64BitBase = 'Windows_Server-2012-RTM-Portuguese_Brazil-64Bit-Base',
  WindowsServer2016EnglishFullSQL2016SP1Web = 'Windows_Server-2016-English-Full-SQL_2016_SP1_Web',
  WindowsServer2016EnglishP3 = 'Windows_Server-2016-English-P3',
  WindowsServer2016JapaneseFullSQL2016SP1Enterprise = 'Windows_Server-2016-Japanese-Full-SQL_2016_SP1_Enterprise',
  WindowsServer2003R2SP2LanguagePacks64BitBase = 'Windows_Server-2003-R2_SP2-Language_Packs-64Bit-Base',
  WindowsServer2012R2RTMChineseTraditionalHongKong64BitBase = 'Windows_Server-2012-R2_RTM-Chinese_Traditional_Hong_Kong-64Bit-Base',
  WindowsServer2012R2RTMEnglish64BitSQL2014SP3Express = 'Windows_Server-2012-R2_RTM-English-64Bit-SQL_2014_SP3_Express',
  WindowsServer2012R2RTMEnglish64BitSQL2016SP2Enterprise = 'Windows_Server-2012-R2_RTM-English-64Bit-SQL_2016_SP2_Enterprise',
  WindowsServer2012RTMChineseSimplified64BitBase = 'Windows_Server-2012-RTM-Chinese_Simplified-64Bit-Base',
  WindowsServer2012RTMEnglish64BitSQL2012SP4Web = 'Windows_Server-2012-RTM-English-64Bit-SQL_2012_SP4_Web',
  WindowsServer2012RTMJapanese64BitSQL2014SP3Web = 'Windows_Server-2012-RTM-Japanese-64Bit-SQL_2014_SP3_Web',
  WindowsServer2016JapaneseFullBase = 'Windows_Server-2016-Japanese-Full-Base',
  WindowsServer2016JapaneseFullSQL2016SP1Express = 'Windows_Server-2016-Japanese-Full-SQL_2016_SP1_Express',
  WindowsServer1803EnglishCoreContainersLatest = 'Windows_Server-1803-English-Core-ContainersLatest',
  WindowsServer2008R2SP1Japanese64BitSQL2012SP4Standard = 'Windows_Server-2008-R2_SP1-Japanese-64Bit-SQL_2012_SP4_Standard',
  WindowsServer2012R2RTMEnglish64BitCore = 'Windows_Server-2012-R2_RTM-English-64Bit-Core',
  WindowsServer2012R2RTMEnglish64BitSQL2014SP2Web = 'Windows_Server-2012-R2_RTM-English-64Bit-SQL_2014_SP2_Web',
  WindowsServer2012R2RTMEnglish64BitSQL2014SP3Enterprise = 'Windows_Server-2012-R2_RTM-English-64Bit-SQL_2014_SP3_Enterprise',
  WindowsServer2012R2RTMJapanese64BitSQL2016SP2Standard = 'Windows_Server-2012-R2_RTM-Japanese-64Bit-SQL_2016_SP2_Standard',
  WindowsServer2012RTMEnglish64BitSQL2014SP3Web = 'Windows_Server-2012-RTM-English-64Bit-SQL_2014_SP3_Web',
  WindowsServer2012RTMSwedish64BitBase = 'Windows_Server-2012-RTM-Swedish-64Bit-Base',
  WindowsServer2016ChineseSimplifiedFullBase = 'Windows_Server-2016-Chinese_Simplified-Full-Base',
  WindowsServer2019PolishFullBase = 'Windows_Server-2019-Polish-Full-Base',
  WindowsServer2008R2SP1Japanese64BitSQL2008R2SP3Web = 'Windows_Server-2008-R2_SP1-Japanese-64Bit-SQL_2008_R2_SP3_Web',
  WindowsServer2008R2SP1PortugueseBrazil64BitBase = 'Windows_Server-2008-R2_SP1-Portuguese_Brazil-64Bit-Base',
  WindowsServer2012R2RTMJapanese64BitSQL2016SP1Enterprise = 'Windows_Server-2012-R2_RTM-Japanese-64Bit-SQL_2016_SP1_Enterprise',
  WindowsServer2012R2RTMJapanese64BitSQL2016SP2Express = 'Windows_Server-2012-R2_RTM-Japanese-64Bit-SQL_2016_SP2_Express',
  WindowsServer2012RTMEnglish64BitSQL2014SP3Express = 'Windows_Server-2012-RTM-English-64Bit-SQL_2014_SP3_Express',
  WindowsServer2012RTMJapanese64BitSQL2014SP2Standard = 'Windows_Server-2012-RTM-Japanese-64Bit-SQL_2014_SP2_Standard',
  WindowsServer2016EnglishCoreBase = 'Windows_Server-2016-English-Core-Base',
  WindowsServer2016EnglishFullBase = 'Windows_Server-2016-English-Full-Base',
  WindowsServer2016EnglishFullSQL2017Web = 'Windows_Server-2016-English-Full-SQL_2017_Web',
  WindowsServer2019GermanFullBase = 'Windows_Server-2019-German-Full-Base',
  WindowsServer2003R2SP2English64BitSQL2005SP4Standard = 'Windows_Server-2003-R2_SP2-English-64Bit-SQL_2005_SP4_Standard',
  WindowsServer2008R2SP1English64BitSQL2012SP4Enterprise = 'Windows_Server-2008-R2_SP1-English-64Bit-SQL_2012_SP4_Enterprise',
  WindowsServer2008R2SP1Japanese64BitSQL2008R2SP3Express = 'Windows_Server-2008-R2_SP1-Japanese-64Bit-SQL_2008_R2_SP3_Express',
  WindowsServer2012R2RTMEnglish64BitSQL2016SP1Enterprise = 'Windows_Server-2012-R2_RTM-English-64Bit-SQL_2016_SP1_Enterprise',
  WindowsServer2012RTMEnglish64BitSQL2014SP2Web = 'Windows_Server-2012-RTM-English-64Bit-SQL_2014_SP2_Web',
  WindowsServer2012RTMJapanese64BitSQL2008R2SP3Express = 'Windows_Server-2012-RTM-Japanese-64Bit-SQL_2008_R2_SP3_Express',
  WindowsServer2016FrenchFullBase = 'Windows_Server-2016-French-Full-Base',
  WindowsServer2016JapaneseFullSQL2016SP2Enterprise = 'Windows_Server-2016-Japanese-Full-SQL_2016_SP2_Enterprise',
  WindowsServer2019CzechFullBase = 'Windows_Server-2019-Czech-Full-Base',
  WindowsServer1809EnglishCoreBase = 'Windows_Server-1809-English-Core-Base',
  WindowsServer1809EnglishCoreContainersLatest = 'Windows_Server-1809-English-Core-ContainersLatest',
  WindowsServer2003R2SP2LanguagePacks64BitSQL2005SP4Express = 'Windows_Server-2003-R2_SP2-Language_Packs-64Bit-SQL_2005_SP4_Express',
  WindowsServer2012R2RTMTurkish64BitBase = 'Windows_Server-2012-R2_RTM-Turkish-64Bit-Base',
  WindowsServer2012RTMJapanese64BitSQL2012SP4Web = 'Windows_Server-2012-RTM-Japanese-64Bit-SQL_2012_SP4_Web',
  WindowsServer2012RTMPolish64BitBase = 'Windows_Server-2012-RTM-Polish-64Bit-Base',
  WindowsServer2012RTMSpanish64BitBase = 'Windows_Server-2012-RTM-Spanish-64Bit-Base',
  WindowsServer2016EnglishFullSQL2016SP1Enterprise = 'Windows_Server-2016-English-Full-SQL_2016_SP1_Enterprise',
  WindowsServer2016JapaneseFullSQL2016SP2Express = 'Windows_Server-2016-Japanese-Full-SQL_2016_SP2_Express',
  WindowsServer2019EnglishFullSQL2016SP2Enterprise = 'Windows_Server-2019-English-Full-SQL_2016_SP2_Enterprise',
  WindowsServer1709EnglishCoreBase = 'Windows_Server-1709-English-Core-Base',
  WindowsServer2008R2SP1English64BitSQL2012RTMSP2Enterprise = 'Windows_Server-2008-R2_SP1-English-64Bit-SQL_2012_RTM_SP2_Enterprise',
  WindowsServer2008R2SP1English64BitSQL2012SP4Standard = 'Windows_Server-2008-R2_SP1-English-64Bit-SQL_2012_SP4_Standard',
  WindowsServer2008SP2PortugueseBrazil32BitBase = 'Windows_Server-2008-SP2-Portuguese_Brazil-32Bit-Base',
  WindowsServer2012R2RTMJapanese64BitSQL2014SP2Standard = 'Windows_Server-2012-R2_RTM-Japanese-64Bit-SQL_2014_SP2_Standard',
  WindowsServer2012RTMJapanese64BitSQL2012SP4Express = 'Windows_Server-2012-RTM-Japanese-64Bit-SQL_2012_SP4_Express',
  WindowsServer2012RTMPortuguesePortugal64BitBase = 'Windows_Server-2012-RTM-Portuguese_Portugal-64Bit-Base',
  WindowsServer2016CzechFullBase = 'Windows_Server-2016-Czech-Full-Base',
  WindowsServer2016JapaneseFullSQL2016SP1Standard = 'Windows_Server-2016-Japanese-Full-SQL_2016_SP1_Standard',
  WindowsServer2019DutchFullBase = 'Windows_Server-2019-Dutch-Full-Base',
  WindowsServer2008R2SP1English64BitCore = 'Windows_Server-2008-R2_SP1-English-64Bit-Core',
  WindowsServer2012R2RTMEnglish64BitSQL2016SP2Web = 'Windows_Server-2012-R2_RTM-English-64Bit-SQL_2016_SP2_Web',
  WindowsServer2012R2RTMKorean64BitBase = 'Windows_Server-2012-R2_RTM-Korean-64Bit-Base',
  WindowsServer2012RTMDutch64BitBase = 'Windows_Server-2012-RTM-Dutch-64Bit-Base',
  WindowsServer2016English64BitSQL2012SP4Enterprise = 'Windows_Server-2016-English-64Bit-SQL_2012_SP4_Enterprise',
  WindowsServer2016EnglishCoreSQL2016SP1Standard = 'Windows_Server-2016-English-Core-SQL_2016_SP1_Standard',
  WindowsServer2016EnglishCoreSQL2016SP2Express = 'Windows_Server-2016-English-Core-SQL_2016_SP2_Express',
  WindowsServer2016EnglishCoreSQL2016SP2Web = 'Windows_Server-2016-English-Core-SQL_2016_SP2_Web',
  WindowsServer2016EnglishFullSQL2017Standard = 'Windows_Server-2016-English-Full-SQL_2017_Standard',
  WindowsServer2019PortugueseBrazilFullBase = 'Windows_Server-2019-Portuguese_Brazil-Full-Base',
  WindowsServer2008R2SP1English64BitSQL2008R2SP3Standard = 'Windows_Server-2008-R2_SP1-English-64Bit-SQL_2008_R2_SP3_Standard',
  WindowsServer2008R2SP1English64BitSharePoint2010SP2Foundation = 'Windows_Server-2008-R2_SP1-English-64Bit-SharePoint_2010_SP2_Foundation',
  WindowsServer2012R2RTMEnglishP3 = 'Windows_Server-2012-R2_RTM-English-P3',
  WindowsServer2012R2RTMJapanese64BitSQL2014SP3Standard = 'Windows_Server-2012-R2_RTM-Japanese-64Bit-SQL_2014_SP3_Standard',
  WindowsServer2012R2RTMSpanish64BitBase = 'Windows_Server-2012-R2_RTM-Spanish-64Bit-Base',
  WindowsServer2012RTMJapanese64BitSQL2014SP3Express = 'Windows_Server-2012-RTM-Japanese-64Bit-SQL_2014_SP3_Express',
  WindowsServer2016EnglishCoreSQL2016SP2Standard = 'Windows_Server-2016-English-Core-SQL_2016_SP2_Standard',
  WindowsServer2016JapaneseFullSQL2016SP2Standard = 'Windows_Server-2016-Japanese-Full-SQL_2016_SP2_Standard',
  WindowsServer2019PortuguesePortugalFullBase = 'Windows_Server-2019-Portuguese_Portugal-Full-Base',
  WindowsServer2019SwedishFullBase = 'Windows_Server-2019-Swedish-Full-Base',
  WindowsServer2012R2RTMEnglish64BitHyperV = 'Windows_Server-2012-R2_RTM-English-64Bit-HyperV',
  WindowsServer2012RTMKorean64BitBase = 'Windows_Server-2012-RTM-Korean-64Bit-Base',
  WindowsServer2012RTMRussian64BitBase = 'Windows_Server-2012-RTM-Russian-64Bit-Base',
  WindowsServer2016ChineseTraditionalFullBase = 'Windows_Server-2016-Chinese_Traditional-Full-Base',
  WindowsServer2016EnglishFullSQL2016SP2Web = 'Windows_Server-2016-English-Full-SQL_2016_SP2_Web',
  WindowsServer2016EnglishFullSQL2017Express = 'Windows_Server-2016-English-Full-SQL_2017_Express',
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
