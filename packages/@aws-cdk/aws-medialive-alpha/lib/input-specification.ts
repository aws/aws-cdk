import type { CfnChannel } from 'aws-cdk-lib/aws-medialive';

/**
 * The codec for the input specification.
 */
export enum InputCodec {
  /** AVC (H.264) */
  AVC = 'AVC',
  /** HEVC (H.265) */
  HEVC = 'HEVC',
  /** MPEG2 */
  MPEG2 = 'MPEG2',
}

/**
 * The maximum input bitrate for the input specification.
 */
export enum InputMaximumBitrate {
  /** Max 10 Mbps */
  MAX_10_MBPS = 'MAX_10_MBPS',
  /** Max 20 Mbps */
  MAX_20_MBPS = 'MAX_20_MBPS',
  /** Max 50 Mbps */
  MAX_50_MBPS = 'MAX_50_MBPS',
}

/**
 * The resolution for the input specification.
 */
export enum InputResolution {
  /** SD */
  SD = 'SD',
  /** HD */
  HD = 'HD',
  /** UHD */
  UHD = 'UHD',
}

/**
 * Maximum CDI input resolution.
 */
export enum CdiInputResolution {
  /** SD resolution */
  SD = 'SD',
  /** HD resolution */
  HD = 'HD',
  /** Full HD resolution */
  FHD = 'FHD',
  /** UHD resolution */
  UHD = 'UHD',
}

/**
 * Properties shared by all input specifications.
 */
export interface StandardInputSpecificationProps {
  /**
   * The codec of the input.
   * This should match the codec of your source content, not the output codec.
   * @default InputCodec.AVC
   */
  readonly codec?: InputCodec;
  /**
   * The maximum bitrate of the input.
   * @default InputMaximumBitrate.MAX_20_MBPS
   */
  readonly maximumBitrate?: InputMaximumBitrate;
  /**
   * The resolution of the input.
   * @default InputResolution.HD
   */
  readonly resolution?: InputResolution;
}

/**
 * Properties for a CDI input specification.
 */
export interface CdiInputSpecificationProps extends StandardInputSpecificationProps {
  /**
   * The maximum resolution of the most demanding CDI input.
   * @default CdiInputResolution.HD
   */
  readonly cdiResolution?: CdiInputResolution;
}

/**
 * The input specification for a channel.
 *
 * Use the static factory methods to select the input type — mirroring the console's
 * "Other" / "CDI" / "Elemental Link" choice.
 */
export abstract class InputSpecification {
  /** Standard inputs ("Other" in the console) — the most common case. */
  public static standard(props: StandardInputSpecificationProps = {}): InputSpecification {
    return new StandardInputSpecification(props);
  }

  /** CDI (uncompressed) inputs. Adds the maximum CDI input resolution. */
  public static cdi(props: CdiInputSpecificationProps = {}): InputSpecification {
    return new CdiInputSpecification(props);
  }

  /** Elemental Link inputs. No additional specification is required. */
  public static elementalLink(): InputSpecification {
    return new ElementalLinkInputSpecification();
  }

  /** @internal */
  public abstract _bindInputSpecification(): CfnChannel.InputSpecificationProperty | undefined;
  /** @internal */
  public abstract _bindCdiInputSpecification(): CfnChannel.CdiInputSpecificationProperty | undefined;
}

/** @internal */
function bindStandardSpec(props: StandardInputSpecificationProps): CfnChannel.InputSpecificationProperty {
  return {
    codec: props.codec ?? InputCodec.AVC,
    maximumBitrate: props.maximumBitrate ?? InputMaximumBitrate.MAX_20_MBPS,
    resolution: props.resolution ?? InputResolution.HD,
  };
}

/** @internal */
class StandardInputSpecification extends InputSpecification {
  constructor(private readonly props: StandardInputSpecificationProps) { super(); }
  public _bindInputSpecification(): CfnChannel.InputSpecificationProperty {
    return bindStandardSpec(this.props);
  }
  public _bindCdiInputSpecification(): undefined {
    return undefined;
  }
}

/** @internal */
class CdiInputSpecification extends InputSpecification {
  constructor(private readonly props: CdiInputSpecificationProps) { super(); }
  public _bindInputSpecification(): CfnChannel.InputSpecificationProperty {
    return bindStandardSpec(this.props);
  }
  public _bindCdiInputSpecification(): CfnChannel.CdiInputSpecificationProperty {
    return { resolution: this.props.cdiResolution ?? CdiInputResolution.HD };
  }
}

/** @internal */
class ElementalLinkInputSpecification extends InputSpecification {
  public _bindInputSpecification(): undefined {
    return undefined;
  }
  public _bindCdiInputSpecification(): undefined {
    return undefined;
  }
}
