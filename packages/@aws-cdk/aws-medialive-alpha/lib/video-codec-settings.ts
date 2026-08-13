import type { Bitrate } from 'aws-cdk-lib';
import { Duration, Token, UnscopedValidationError } from 'aws-cdk-lib';
import type { CfnChannel } from 'aws-cdk-lib/aws-medialive';
import { lit } from 'aws-cdk-lib/core/lib/helpers-internal';
import type { Framerate } from './framerate';
import { PixelAspectRatio } from './shared';

/**
 * H.264 profile.
 */
export enum H264Profile {
  /** Baseline profile */
  BASELINE = 'BASELINE',
  /** Main profile */
  MAIN = 'MAIN',
  /** High profile */
  HIGH = 'HIGH',
  /** High 10-bit profile */
  HIGH_10BIT = 'HIGH_10BIT',
  /** High 4:2:2 profile */
  HIGH_422 = 'HIGH_422',
  /** High 4:2:2 10-bit profile */
  HIGH_422_10BIT = 'HIGH_422_10BIT',
}

/**
 * H.264 level.
 */
export enum H264Level {
  /** Level 1 */
  H264_LEVEL_1 = 'H264_LEVEL_1',
  /** Level 1.1 */
  H264_LEVEL_1_1 = 'H264_LEVEL_1_1',
  /** Level 1.2 */
  H264_LEVEL_1_2 = 'H264_LEVEL_1_2',
  /** Level 1.3 */
  H264_LEVEL_1_3 = 'H264_LEVEL_1_3',
  /** Level 2 */
  H264_LEVEL_2 = 'H264_LEVEL_2',
  /** Level 2.1 */
  H264_LEVEL_2_1 = 'H264_LEVEL_2_1',
  /** Level 2.2 */
  H264_LEVEL_2_2 = 'H264_LEVEL_2_2',
  /** Level 3 */
  H264_LEVEL_3 = 'H264_LEVEL_3',
  /** Level 3.1 */
  H264_LEVEL_3_1 = 'H264_LEVEL_3_1',
  /** Level 3.2 */
  H264_LEVEL_3_2 = 'H264_LEVEL_3_2',
  /** Level 4 */
  H264_LEVEL_4 = 'H264_LEVEL_4',
  /** Level 4.1 */
  H264_LEVEL_4_1 = 'H264_LEVEL_4_1',
  /** Level 4.2 */
  H264_LEVEL_4_2 = 'H264_LEVEL_4_2',
  /** Level 5 */
  H264_LEVEL_5 = 'H264_LEVEL_5',
  /** Level 5.1 */
  H264_LEVEL_5_1 = 'H264_LEVEL_5_1',
  /** Level 5.2 */
  H264_LEVEL_5_2 = 'H264_LEVEL_5_2',
  /** Auto-select the level based on the encode configuration */
  H264_LEVEL_AUTO = 'H264_LEVEL_AUTO',
}

/**
 * H.265 level.
 */
export enum H265Level {
  /** Level 1 */
  H265_LEVEL_1 = 'H265_LEVEL_1',
  /** Level 2 */
  H265_LEVEL_2 = 'H265_LEVEL_2',
  /** Level 2.1 */
  H265_LEVEL_2_1 = 'H265_LEVEL_2_1',
  /** Level 3 */
  H265_LEVEL_3 = 'H265_LEVEL_3',
  /** Level 3.1 */
  H265_LEVEL_3_1 = 'H265_LEVEL_3_1',
  /** Level 4 */
  H265_LEVEL_4 = 'H265_LEVEL_4',
  /** Level 4.1 */
  H265_LEVEL_4_1 = 'H265_LEVEL_4_1',
  /** Level 5 */
  H265_LEVEL_5 = 'H265_LEVEL_5',
  /** Level 5.1 */
  H265_LEVEL_5_1 = 'H265_LEVEL_5_1',
  /** Level 5.2 */
  H265_LEVEL_5_2 = 'H265_LEVEL_5_2',
  /** Level 6 */
  H265_LEVEL_6 = 'H265_LEVEL_6',
  /** Level 6.1 */
  H265_LEVEL_6_1 = 'H265_LEVEL_6_1',
  /** Level 6.2 */
  H265_LEVEL_6_2 = 'H265_LEVEL_6_2',
  /** Auto-select the level based on the encode configuration */
  H265_LEVEL_AUTO = 'H265_LEVEL_AUTO',
}

/**
 * AV1 level.
 */
export enum Av1Level {
  /** Level 2 */
  AV1_LEVEL_2 = 'AV1_LEVEL_2',
  /** Level 2.1 */
  AV1_LEVEL_2_1 = 'AV1_LEVEL_2_1',
  /** Level 3 */
  AV1_LEVEL_3 = 'AV1_LEVEL_3',
  /** Level 3.1 */
  AV1_LEVEL_3_1 = 'AV1_LEVEL_3_1',
  /** Level 4 */
  AV1_LEVEL_4 = 'AV1_LEVEL_4',
  /** Level 4.1 */
  AV1_LEVEL_4_1 = 'AV1_LEVEL_4_1',
  /** Level 5 */
  AV1_LEVEL_5 = 'AV1_LEVEL_5',
  /** Level 5.1 */
  AV1_LEVEL_5_1 = 'AV1_LEVEL_5_1',
  /** Level 5.2 */
  AV1_LEVEL_5_2 = 'AV1_LEVEL_5_2',
  /** Level 5.3 */
  AV1_LEVEL_5_3 = 'AV1_LEVEL_5_3',
  /** Level 6 */
  AV1_LEVEL_6 = 'AV1_LEVEL_6',
  /** Level 6.1 */
  AV1_LEVEL_6_1 = 'AV1_LEVEL_6_1',
  /** Level 6.2 */
  AV1_LEVEL_6_2 = 'AV1_LEVEL_6_2',
  /** Level 6.3 */
  AV1_LEVEL_6_3 = 'AV1_LEVEL_6_3',
  /** Auto-select the level based on the encode configuration */
  AV1_LEVEL_AUTO = 'AV1_LEVEL_AUTO',
}

/**
 * H.264 adaptive quantization strength.
 */
export enum H264AdaptiveQuantization {
  /** Auto */
  AUTO = 'AUTO',
  /** High */
  HIGH = 'HIGH',
  /** Higher */
  HIGHER = 'HIGHER',
  /** Low */
  LOW = 'LOW',
  /** Max */
  MAX = 'MAX',
  /** Medium */
  MEDIUM = 'MEDIUM',
  /** Off */
  OFF = 'OFF',
}

/**
 * GOP size (keyframe interval). Use the static factory methods to specify in frames or seconds.
 *
 * The value must be greater than zero. When expressed in frames it must be a whole number;
 * when expressed in seconds it may be fractional.
 */
export class GopSize {
  /** GOP size in seconds. May be fractional (e.g. `1.5`). */
  public static seconds(value: number): GopSize {
    return new GopSize(value, 'SECONDS');
  }
  /** GOP size in frames. Must be a whole number. */
  public static frames(value: number): GopSize {
    return new GopSize(value, 'FRAMES');
  }

  /** @internal */
  public readonly _value: number;
  /** @internal */
  public readonly _units: string;

  private constructor(value: number, units: string) {
    // MediaLive requires gopSize > 0 for both units. When the unit is FRAMES the value
    // must be a whole number (a fractional frame is meaningless); SECONDS may be
    // fractional. See the H264/H265/AV1/MPEG-2 gopSize docs ("must be greater than zero";
    // frames are converted to a frame count at runtime).
    if (!Token.isUnresolved(value)) {
      if (value <= 0) {
        throw new UnscopedValidationError(lit`GopSize`, `GOP size must be greater than zero, got ${JSON.stringify(value)}`);
      }
      if (units === 'FRAMES' && !Number.isInteger(value)) {
        throw new UnscopedValidationError(lit`GopSizeFrames`, `GOP size in frames must be a whole number, got ${JSON.stringify(value)}`);
      }
    }
    this._value = value;
    this._units = units;
  }
}

// =============================================================================
// Shared enums (used by multiple codecs)
// =============================================================================

/**
 * AFD signaling mode.
 */
export enum AfdSignaling {
  /** Auto — preserve input AFD value */
  AUTO = 'AUTO',
  /** Fixed — use the value from fixedAfd */
  FIXED = 'FIXED',
  /** None — do not write AFD */
  NONE = 'NONE',
}

/**
 * Color metadata inclusion.
 */
export enum ColorMetadata {
  /** Ignore — do not include color metadata */
  IGNORE = 'IGNORE',
  /** Insert — include color metadata */
  INSERT = 'INSERT',
}

/**
 * Scan type for the output video.
 */
export enum ScanType {
  /** Interlaced (top field first) */
  INTERLACED = 'INTERLACED',
  /** Progressive */
  PROGRESSIVE = 'PROGRESSIVE',
}

/**
 * Flicker adaptive quantization.
 */
export enum FlickerAq {
  /** Enabled */
  ENABLED = 'ENABLED',
  /** Disabled */
  DISABLED = 'DISABLED',
}

/**
 * GOP B-frame reference.
 */
export enum GopBReference {
  /** Enabled */
  ENABLED = 'ENABLED',
  /** Disabled */
  DISABLED = 'DISABLED',
}

/**
 * Lookahead rate control.
 */
export enum LookAheadRateControl {
  /** High — better quality, more latency and memory */
  HIGH = 'HIGH',
  /** Low — less latency and memory */
  LOW = 'LOW',
  /** Medium */
  MEDIUM = 'MEDIUM',
}

/**
 * Timecode insertion mode.
 *
 * @remarks This controls timecode insertion in the output elementary stream.
 * To preserve source timecodes, set `TimecodeSource.EMBEDDED` on the channel's `timecodeConfig`.
 */
export enum TimecodeInsertion {
  /** Disabled — do not include timecodes */
  DISABLED = 'DISABLED',
  /** PIC_TIMING_SEI — pass through picture timing SEI messages */
  PIC_TIMING_SEI = 'PIC_TIMING_SEI',
}

/**
 * Sub-GOP length mode.
 */
export enum SubgopLength {
  /** Dynamic — let MediaLive optimize B-frames per sub-GOP */
  DYNAMIC = 'DYNAMIC',
  /** Fixed — use gopNumBFrames in each sub-GOP */
  FIXED = 'FIXED',
}

// =============================================================================
// H.264-specific enums
// =============================================================================

/**
 * H.264 entropy encoding mode.
 */
export enum H264EntropyEncoding {
  /** CABAC (requires Main or High profile) */
  CABAC = 'CABAC',
  /** CAVLC */
  CAVLC = 'CAVLC',
}

/**
 * H.264 force field pictures.
 */
export enum H264ForceFieldPictures {
  /** Enabled — force coding on a field basis */
  ENABLED = 'ENABLED',
  /** Disabled — let encoder decide */
  DISABLED = 'DISABLED',
}

/**
 * H.264 syntax mode.
 */
export enum H264Syntax {
  /** Default */
  DEFAULT = 'DEFAULT',
  /** RP-2027 compliant */
  RP2027 = 'RP2027',
}

/**
 * H.264 quality level.
 */
export enum H264QualityLevel {
  /** Enhanced quality (may incur additional cost) */
  ENHANCED_QUALITY = 'ENHANCED_QUALITY',
  /** Standard quality */
  STANDARD_QUALITY = 'STANDARD_QUALITY',
}

// =============================================================================
// H.265-specific enums
// =============================================================================

/**
 * H.265 adaptive quantization.
 */
export enum H265AdaptiveQuantization {
  /** Auto */
  AUTO = 'AUTO',
  /** High */
  HIGH = 'HIGH',
  /** Higher */
  HIGHER = 'HIGHER',
  /** Low */
  LOW = 'LOW',
  /** Max */
  MAX = 'MAX',
  /** Medium */
  MEDIUM = 'MEDIUM',
  /** Off */
  OFF = 'OFF',
}

/**
 * H.265 alternative transfer function.
 */
export enum H265AlternativeTransferFunction {
  /** Insert */
  INSERT = 'INSERT',
  /** Omit */
  OMIT = 'OMIT',
}

/**
 * H.265 deblocking filter.
 */
export enum H265Deblocking {
  /** Disabled */
  DISABLED = 'DISABLED',
  /** Enabled */
  ENABLED = 'ENABLED',
}

/**
 * H.265 motion vector over picture boundaries.
 */
export enum H265MvOverPictureBoundaries {
  /** Disabled */
  DISABLED = 'DISABLED',
  /** Enabled */
  ENABLED = 'ENABLED',
}

/**
 * H.265 motion vector temporal predictor.
 */
export enum H265MvTemporalPredictor {
  /** Disabled */
  DISABLED = 'DISABLED',
  /** Enabled */
  ENABLED = 'ENABLED',
}

/**
 * H.265 tile padding.
 */
export enum H265TilePadding {
  /** None */
  NONE = 'NONE',
  /** Padded */
  PADDED = 'PADDED',
}

/**
 * H.265 treeblock size.
 */
export enum H265TreeblockSize {
  /** Auto */
  AUTO = 'AUTO',
  /** 32x32 */
  TREE_SIZE_32X32 = 'TREE_SIZE_32X32',
}

// =============================================================================
// AV1-specific enums
// =============================================================================

/**
 * AV1 bit depth.
 */
export enum Av1BitDepth {
  /** 8-bit */
  BIT_DEPTH_8 = 'DEPTH_8',
  /** 10-bit */
  BIT_DEPTH_10 = 'DEPTH_10',
}

/**
 * AV1 scene change detection.
 */
export enum Av1SceneChangeDetect {
  /** Disabled */
  DISABLED = 'DISABLED',
  /** Enabled */
  ENABLED = 'ENABLED',
}

/**
 * AV1 spatial adaptive quantization.
 */
export enum Av1SpatialAq {
  /** Disabled */
  DISABLED = 'DISABLED',
  /** Enabled */
  ENABLED = 'ENABLED',
}

/**
 * AV1 temporal adaptive quantization.
 */
export enum Av1TemporalAq {
  /** Disabled */
  DISABLED = 'DISABLED',
  /** Enabled */
  ENABLED = 'ENABLED',
}

/**
 * H.264 scene change detection.
 */
export enum H264SceneChangeDetect {
  /** Disabled */
  DISABLED = 'DISABLED',
  /** Enabled */
  ENABLED = 'ENABLED',
}

/**
 * H.264 spatial adaptive quantization.
 */
export enum H264SpatialAq {
  /** Disabled */
  DISABLED = 'DISABLED',
  /** Enabled */
  ENABLED = 'ENABLED',
}

/**
 * H.264 temporal adaptive quantization.
 */
export enum H264TemporalAq {
  /** Disabled */
  DISABLED = 'DISABLED',
  /** Enabled */
  ENABLED = 'ENABLED',
}

/**
 * H.265 scene change detection.
 */
export enum H265SceneChangeDetect {
  /** Disabled */
  DISABLED = 'DISABLED',
  /** Enabled */
  ENABLED = 'ENABLED',
}

/**
 * AV1 timecode insertion.
 */
export enum Av1TimecodeInsertion {
  /** Disabled — do not insert timecodes */
  DISABLED = 'DISABLED',
  /**
   * Include timecodes as a metadata OBU (Open Bitstream Unit) of type
   * `METADATA_TYPE_TIMECODE`, based on the source specified in the channel's timecode config.
   */
  METADATA_OBU = 'METADATA_OBU',
}

// =============================================================================
// Timecode burn-in settings
// =============================================================================

/**
 * Font size for timecode burn-in.
 */
export enum TimecodeBurninFontSize {
  /** Extra small */
  EXTRA_SMALL_10 = 'EXTRA_SMALL_10',
  /** Large */
  LARGE_48 = 'LARGE_48',
  /** Medium */
  MEDIUM_32 = 'MEDIUM_32',
  /** Small */
  SMALL_16 = 'SMALL_16',
}

/**
 * Position for timecode burn-in overlay.
 */
export enum TimecodeBurninPosition {
  /** Bottom center */
  BOTTOM_CENTER = 'BOTTOM_CENTER',
  /** Bottom left */
  BOTTOM_LEFT = 'BOTTOM_LEFT',
  /** Bottom right */
  BOTTOM_RIGHT = 'BOTTOM_RIGHT',
  /** Middle center */
  MIDDLE_CENTER = 'MIDDLE_CENTER',
  /** Middle left */
  MIDDLE_LEFT = 'MIDDLE_LEFT',
  /** Middle right */
  MIDDLE_RIGHT = 'MIDDLE_RIGHT',
  /** Top center */
  TOP_CENTER = 'TOP_CENTER',
  /** Top left */
  TOP_LEFT = 'TOP_LEFT',
  /** Top right */
  TOP_RIGHT = 'TOP_RIGHT',
}

/**
 * Settings for burning a timecode overlay into the video output.
 */
export interface TimecodeBurninSettings {
  /**
   * The font size of the timecode overlay.
   * @default - service default
   */
  readonly fontSize?: TimecodeBurninFontSize;
  /**
   * The position of the timecode overlay on the video.
   * @default - service default
   */
  readonly position?: TimecodeBurninPosition;
  /**
   * A string prepended to the timecode (e.g. a channel name).
   * @default - no prefix
   */
  readonly prefix?: string;
}

// =============================================================================
// Rate control classes (per codec)
// =============================================================================

/** Properties for CBR rate control. */
export interface CbrRateControlProps {
  /** The constant bitrate. */
  readonly bitrate: Bitrate;
}

/** Properties for VBR rate control. */
export interface VbrRateControlProps {
  /** The average bitrate. */
  readonly bitrate: Bitrate;
  /** The maximum bitrate. */
  readonly maxBitrate: Bitrate;
}

/** Properties for QVBR rate control. */
export interface QvbrRateControlProps {
  /** The maximum bitrate. */
  readonly maxBitrate: Bitrate;
  /**
   * The QVBR quality level (1-10). Leave unset to let MediaLive infer the target quality from the
   * output resolution and max bitrate.
   * @default - MediaLive infers the quality level from the resolution and max bitrate
   */
  readonly qvbrQualityLevel?: number;
}

/**
 * H.264 rate control. Use the static factory methods to create.
 */
export class H264RateControl {
  /** Constant bitrate. */
  public static cbr(props: CbrRateControlProps): H264RateControl {
    return new H264RateControl('CBR', props.bitrate, undefined, undefined);
  }
  /** Variable bitrate. */
  public static vbr(props: VbrRateControlProps): H264RateControl {
    return new H264RateControl('VBR', props.bitrate, props.maxBitrate, undefined);
  }
  /** Quality-defined variable bitrate. */
  public static qvbr(props: QvbrRateControlProps): H264RateControl {
    return new H264RateControl('QVBR', undefined, props.maxBitrate, props.qvbrQualityLevel);
  }

  /** @internal */
  public readonly _mode: string;
  /** @internal */
  public readonly _bitrate: Bitrate | undefined;
  /** @internal */
  public readonly _maxBitrate: Bitrate | undefined;
  /** @internal */
  public readonly _qvbrQualityLevel: number | undefined;

  private constructor(mode: string, bitrate: Bitrate | undefined, maxBitrate: Bitrate | undefined, qvbrQualityLevel: number | undefined) {
    this._mode = mode;
    this._bitrate = bitrate;
    this._maxBitrate = maxBitrate;
    this._qvbrQualityLevel = qvbrQualityLevel;
  }
}

/**
 * H.265 rate control. Use the static factory methods to create.
 */
export class H265RateControl {
  /** Constant bitrate. */
  public static cbr(props: CbrRateControlProps): H265RateControl {
    return new H265RateControl('CBR', props.bitrate, undefined, undefined);
  }
  /** Variable bitrate. */
  public static vbr(props: VbrRateControlProps): H265RateControl {
    return new H265RateControl('VBR', props.bitrate, props.maxBitrate, undefined);
  }
  /** Quality-defined variable bitrate. */
  public static qvbr(props: QvbrRateControlProps): H265RateControl {
    return new H265RateControl('QVBR', undefined, props.maxBitrate, props.qvbrQualityLevel);
  }

  /** @internal */
  public readonly _mode: string;
  /** @internal */
  public readonly _bitrate: Bitrate | undefined;
  /** @internal */
  public readonly _maxBitrate: Bitrate | undefined;
  /** @internal */
  public readonly _qvbrQualityLevel: number | undefined;

  private constructor(mode: string, bitrate: Bitrate | undefined, maxBitrate: Bitrate | undefined, qvbrQualityLevel: number | undefined) {
    this._mode = mode;
    this._bitrate = bitrate;
    this._maxBitrate = maxBitrate;
    this._qvbrQualityLevel = qvbrQualityLevel;
  }
}

/**
 * AV1 rate control. AV1 supports QVBR and CBR.
 */
export class Av1RateControl {
  /** Quality-defined variable bitrate. */
  public static qvbr(props: QvbrRateControlProps): Av1RateControl {
    return new Av1RateControl('QVBR', undefined, props.maxBitrate, props.qvbrQualityLevel);
  }
  /** Constant bitrate. */
  public static cbr(props: CbrRateControlProps): Av1RateControl {
    return new Av1RateControl('CBR', props.bitrate, undefined, undefined);
  }

  /** @internal */
  public readonly _mode: string;
  /** @internal */
  public readonly _bitrate: Bitrate | undefined;
  /** @internal */
  public readonly _maxBitrate: Bitrate | undefined;
  /** @internal */
  public readonly _qvbrQualityLevel: number | undefined;

  private constructor(mode: string, bitrate: Bitrate | undefined, maxBitrate: Bitrate | undefined, qvbrQualityLevel: number | undefined) {
    this._mode = mode;
    this._bitrate = bitrate;
    this._maxBitrate = maxBitrate;
    this._qvbrQualityLevel = qvbrQualityLevel;
  }
}

// =============================================================================
// Color space settings classes
// =============================================================================

/**
 * Color space settings for H.264 video.
 */
export class H264ColorSpaceSettings {
  /** Pass through the source color space with no conversion. */
  public static passthrough(): H264ColorSpaceSettings {
    return new H264ColorSpaceSettings({ colorSpacePassthroughSettings: {} });
  }
  /** Convert to Rec.601 color space. */
  public static rec601(): H264ColorSpaceSettings {
    return new H264ColorSpaceSettings({ rec601Settings: {} });
  }
  /** Convert to Rec.709 color space. */
  public static rec709(): H264ColorSpaceSettings {
    return new H264ColorSpaceSettings({ rec709Settings: {} });
  }

  private readonly config: CfnChannel.H264ColorSpaceSettingsProperty;
  private constructor(config: CfnChannel.H264ColorSpaceSettingsProperty) { this.config = config; }

  /** @internal */
  public _bind(): CfnChannel.H264ColorSpaceSettingsProperty { return this.config; }
}

/**
 * Properties for HDR10 color space settings.
 */
export interface Hdr10SettingsProps {
  /**
   * Maximum Content Light Level — the maximum light level of any single pixel in nits.
   * @default - service default
   */
  readonly maxCll?: number;
  /**
   * Maximum Frame Average Light Level — the maximum average light level of any single frame in nits.
   * @default - service default
   */
  readonly maxFall?: number;
}

/**
 * Color space settings for H.265 video.
 */
export class H265ColorSpaceSettings {
  /** Pass through the source color space with no conversion. */
  public static passthrough(): H265ColorSpaceSettings {
    return new H265ColorSpaceSettings({ colorSpacePassthroughSettings: {} });
  }
  /** Dolby Vision 8.1 color space. */
  public static dolbyVision81(): H265ColorSpaceSettings {
    return new H265ColorSpaceSettings({ dolbyVision81Settings: {} });
  }
  /** HDR10 color space. */
  public static hdr10(props?: Hdr10SettingsProps): H265ColorSpaceSettings {
    return new H265ColorSpaceSettings({ hdr10Settings: props ?? {} });
  }
  /** HLG 2020 color space. */
  public static hlg2020(): H265ColorSpaceSettings {
    return new H265ColorSpaceSettings({ hlg2020Settings: {} });
  }
  /** Convert to Rec.601 color space. */
  public static rec601(): H265ColorSpaceSettings {
    return new H265ColorSpaceSettings({ rec601Settings: {} });
  }
  /** Convert to Rec.709 color space. */
  public static rec709(): H265ColorSpaceSettings {
    return new H265ColorSpaceSettings({ rec709Settings: {} });
  }

  private readonly config: CfnChannel.H265ColorSpaceSettingsProperty;
  private constructor(config: CfnChannel.H265ColorSpaceSettingsProperty) { this.config = config; }

  /** @internal */
  public _bind(): CfnChannel.H265ColorSpaceSettingsProperty { return this.config; }
}

/**
 * Color space settings for AV1 video.
 */
export class Av1ColorSpaceSettings {
  /** Pass through the source color space with no conversion. */
  public static passthrough(): Av1ColorSpaceSettings {
    return new Av1ColorSpaceSettings({ colorSpacePassthroughSettings: {} });
  }
  /** HDR10 color space. */
  public static hdr10(props?: Hdr10SettingsProps): Av1ColorSpaceSettings {
    return new Av1ColorSpaceSettings({ hdr10Settings: props ?? {} });
  }
  /** HLG 2020 color space. */
  public static hlg2020(): Av1ColorSpaceSettings {
    return new Av1ColorSpaceSettings({ hlg2020Settings: {} });
  }
  /** Convert to Rec.601 color space. */
  public static rec601(): Av1ColorSpaceSettings {
    return new Av1ColorSpaceSettings({ rec601Settings: {} });
  }
  /** Convert to Rec.709 color space. */
  public static rec709(): Av1ColorSpaceSettings {
    return new Av1ColorSpaceSettings({ rec709Settings: {} });
  }

  private readonly config: CfnChannel.Av1ColorSpaceSettingsProperty;
  private constructor(config: CfnChannel.Av1ColorSpaceSettingsProperty) { this.config = config; }

  /** @internal */
  public _bind(): CfnChannel.Av1ColorSpaceSettingsProperty { return this.config; }
}

// =============================================================================
// Filter settings classes
// =============================================================================

/**
 * Post-filter sharpening for temporal filter.
 */
export enum TemporalFilterPostFilterSharpening {
  /** Auto */
  AUTO = 'AUTO',
  /** Disabled */
  DISABLED = 'DISABLED',
  /** Enabled */
  ENABLED = 'ENABLED',
}

/**
 * Temporal filter strength.
 */
export enum TemporalFilterStrength {
  /** Auto */
  AUTO = 'AUTO',
  /** Strength 1 (recommended) */
  STRENGTH_1 = 'STRENGTH_1',
  /** Strength 2 (recommended) */
  STRENGTH_2 = 'STRENGTH_2',
  /** Strength 3 */
  STRENGTH_3 = 'STRENGTH_3',
  /** Strength 4 */
  STRENGTH_4 = 'STRENGTH_4',
  /** Strength 5 */
  STRENGTH_5 = 'STRENGTH_5',
  /** Strength 6 */
  STRENGTH_6 = 'STRENGTH_6',
  /** Strength 7 */
  STRENGTH_7 = 'STRENGTH_7',
  /** Strength 8 */
  STRENGTH_8 = 'STRENGTH_8',
  /** Strength 9 */
  STRENGTH_9 = 'STRENGTH_9',
  /** Strength 10 */
  STRENGTH_10 = 'STRENGTH_10',
  /** Strength 11 */
  STRENGTH_11 = 'STRENGTH_11',
  /** Strength 12 */
  STRENGTH_12 = 'STRENGTH_12',
  /** Strength 13 */
  STRENGTH_13 = 'STRENGTH_13',
  /** Strength 14 */
  STRENGTH_14 = 'STRENGTH_14',
  /** Strength 15 */
  STRENGTH_15 = 'STRENGTH_15',
  /** Strength 16 */
  STRENGTH_16 = 'STRENGTH_16',
}

/**
 * Post-filter sharpening for bandwidth reduction filter.
 */
export enum BandwidthReductionPostFilterSharpening {
  /** Disabled */
  DISABLED = 'DISABLED',
  /** Sharpening level 1 */
  SHARPENING_1 = 'SHARPENING_1',
  /** Sharpening level 2 */
  SHARPENING_2 = 'SHARPENING_2',
  /** Sharpening level 3 */
  SHARPENING_3 = 'SHARPENING_3',
}

/**
 * Bandwidth reduction filter strength.
 */
export enum BandwidthReductionStrength {
  /** Auto */
  AUTO = 'AUTO',
  /** Strength 1 */
  STRENGTH_1 = 'STRENGTH_1',
  /** Strength 2 */
  STRENGTH_2 = 'STRENGTH_2',
  /** Strength 3 */
  STRENGTH_3 = 'STRENGTH_3',
  /** Strength 4 */
  STRENGTH_4 = 'STRENGTH_4',
}

/**
 * Properties for a temporal filter.
 */
export interface TemporalFilterProps {
  /**
   * Post-filter sharpening control.
   *
   * @default - service default
   */
  readonly postFilterSharpening?: TemporalFilterPostFilterSharpening;
  /**
   * Filter strength. We recommend 1 or 2. Higher values may remove useful detail.
   *
   * @default - service default
   */
  readonly strength?: TemporalFilterStrength;
}

/**
 * Properties for a bandwidth reduction filter.
 */
export interface BandwidthReductionFilterProps {
  /**
   * Post-filter sharpening control.
   *
   * @default - service default
   */
  readonly postFilterSharpening?: BandwidthReductionPostFilterSharpening;
  /**
   * Bandwidth reduction strength.
   *
   * @default - service default
   */
  readonly strength?: BandwidthReductionStrength;
}

/**
 * Filter settings for H.264 video. Supports temporal filter and bandwidth reduction filter.
 */
export class H264FilterSettings {
  /** Apply a temporal filter. */
  public static temporalFilter(props?: TemporalFilterProps): H264FilterSettings {
    return new H264FilterSettings({
      temporalFilterSettings: props ? {
        postFilterSharpening: props.postFilterSharpening,
        strength: props.strength,
      } : {},
    });
  }
  /** Apply a bandwidth reduction filter. */
  public static bandwidthReductionFilter(props?: BandwidthReductionFilterProps): H264FilterSettings {
    return new H264FilterSettings({
      bandwidthReductionFilterSettings: props ? {
        postFilterSharpening: props.postFilterSharpening,
        strength: props.strength,
      } : {},
    });
  }

  private readonly config: CfnChannel.H264FilterSettingsProperty;
  private constructor(config: CfnChannel.H264FilterSettingsProperty) { this.config = config; }

  /** @internal */
  public _bind(): CfnChannel.H264FilterSettingsProperty { return this.config; }
}

/**
 * Filter settings for H.265 video. Supports temporal filter and bandwidth reduction filter.
 */
export class H265FilterSettings {
  /** Apply a temporal filter. */
  public static temporalFilter(props?: TemporalFilterProps): H265FilterSettings {
    return new H265FilterSettings({
      temporalFilterSettings: props ? {
        postFilterSharpening: props.postFilterSharpening,
        strength: props.strength,
      } : {},
    });
  }
  /** Apply a bandwidth reduction filter. */
  public static bandwidthReductionFilter(props?: BandwidthReductionFilterProps): H265FilterSettings {
    return new H265FilterSettings({
      bandwidthReductionFilterSettings: props ? {
        postFilterSharpening: props.postFilterSharpening,
        strength: props.strength,
      } : {},
    });
  }

  private readonly config: CfnChannel.H265FilterSettingsProperty;
  private constructor(config: CfnChannel.H265FilterSettingsProperty) { this.config = config; }

  /** @internal */
  public _bind(): CfnChannel.H265FilterSettingsProperty { return this.config; }
}

// =============================================================================
// Codec settings props
// =============================================================================

/**
 * Properties for H.264 codec settings.
 */
export interface H264SettingsProps {
  /**
   * The rate control configuration.
   * @default - CBR with no bitrate (service default)
   */
  readonly rateControl?: H264RateControl;
  /**
   * The H.264 profile.
   * @default H264Profile.MAIN
   */
  readonly profile?: H264Profile;
  /**
   * The GOP size (keyframe interval).
   * @default GopSize.seconds(2)
   */
  readonly gopSize?: GopSize;
  /**
   * The number of B-frames between reference frames.
   * @default - service default
   */
  readonly gopNumBFrames?: number;
  /**
   * The adaptive quantization strength. `AUTO` lets MediaLive manage AQ and enables the
   * individual `spatialAq` / `temporalAq` / `flickerAq` controls; a fixed strength overrides them.
   * @default H264AdaptiveQuantization.AUTO
   */
  readonly adaptiveQuantization?: H264AdaptiveQuantization;
  /**
   * The video frame rate.
   * @default - follow source
   */
  readonly framerate?: Framerate;
  /**
   * The pixel aspect ratio (PAR) of the video.
   * @default - follow source (or square pixels when framerate is specified)
   */
  readonly pixelAspectRatio?: PixelAspectRatio;
  /**
   * Timecode burn-in settings to overlay timecode on the video.
   * @default - no timecode burn-in
   */
  readonly timecodeBurnin?: TimecodeBurninSettings;
  /**
   * AFD signaling mode. Controls whether AFD values are written into the output stream.
   * @default AfdSignaling.NONE
   */
  readonly afdSignaling?: AfdSignaling;
  /**
   * Percentage of the buffer that should initially be filled (HRD buffer model).
   * @default - service default
   */
  readonly bufFillPct?: number;
  /**
   * Size of the buffer (HRD buffer model) in bits/second.
   * @default - service default
   */
  readonly bufSize?: number;
  /**
   * Whether to include color space metadata in the output.
   * @default - service default
   */
  readonly colorMetadata?: ColorMetadata;
  /**
   * Color space settings for the video.
   *
   * @default - service default
   */
  readonly colorSpaceSettings?: H264ColorSpaceSettings;
  /**
   * The entropy encoding mode. CABAC requires Main or High profile.
   * @default - service default
   */
  readonly entropyEncoding?: H264EntropyEncoding;
  /**
   * Optional video filter settings.
   *
   * @default - service default
   */
  readonly filterSettings?: H264FilterSettings;
  /**
   * Four-bit AFD value to write on all frames. Only valid when afdSignaling is FIXED.
   *
   * Valid values: FIXED_0000, FIXED_0010, FIXED_0011, FIXED_0100, FIXED_1000,
   * FIXED_1001, FIXED_1010, FIXED_1011, FIXED_1100, FIXED_1101, FIXED_1110, FIXED_1111.
   *
   * @default - service default
   */
  readonly fixedAfd?: string;
  /**
   * If enabled, adjusts quantization within each frame to reduce flicker on I-frames.
   * @default FlickerAq.ENABLED
   */
  readonly flickerAq?: FlickerAq;
  /**
   * Controls whether coding is on a field basis or frame basis when scan type is interlaced.
   * @default - service default
   */
  readonly forceFieldPictures?: H264ForceFieldPictures;
  /**
   * If enabled, uses reference B frames for GOP structures that have B frames > 1.
   * @default - service default
   */
  readonly gopBReference?: GopBReference;
  /**
   * Frequency of closed GOPs. Set to 1 for streaming so decoders joining mid-stream get an IDR frame quickly.
   * @default - service default
   */
  readonly gopClosedCadence?: number;
  /**
   * The H.264 level.
   *
   * Valid values: H264_LEVEL_1, H264_LEVEL_1_1, H264_LEVEL_1_2, H264_LEVEL_1_3,
   * H264_LEVEL_2, H264_LEVEL_2_1, H264_LEVEL_2_2, H264_LEVEL_3, H264_LEVEL_3_1,
   * H264_LEVEL_3_2, H264_LEVEL_4, H264_LEVEL_4_1, H264_LEVEL_4_2, H264_LEVEL_5,
   * H264_LEVEL_5_1, H264_LEVEL_5_2, H264_LEVEL_AUTO.
   *
   * @default H264Level.H264_LEVEL_AUTO
   */
  readonly level?: H264Level;
  /**
   * Amount of lookahead. Low decreases latency/memory; high can produce better quality.
   * @default LookAheadRateControl.MEDIUM
   */
  readonly lookAheadRateControl?: LookAheadRateControl;
  /**
   * Only meaningful if sceneChangeDetect is enabled. Enforces separation between
   * repeated (cadence) I-frames and I-frames inserted by scene change detection.
   * @default - service default
   */
  readonly minIInterval?: number;
  /**
   * The number of reference frames to use. The encoder might use more if B-frames or interlaced encoding is used.
   * @default - service default
   */
  readonly numRefFrames?: number;
  /**
   * Sets the scan type of the output.
   * @default ScanType.PROGRESSIVE
   */
  readonly scanType?: ScanType;
  /**
   * Number of slices per picture. Must be <= macroblock rows (progressive) or half (interlaced).
   * @default - encoder chooses based on resolution
   */
  readonly slices?: number;
  /**
   * Softness. Selects a quantizer matrix; larger values reduce high-frequency content.
   * @default - service default
   */
  readonly softness?: number;
  /**
   * Produces a bitstream compliant with SMPTE RP-2027.
   * @default H264Syntax.DEFAULT
   */
  readonly syntax?: H264Syntax;
  /**
   * Determines how timecodes are inserted into the video elementary stream.
   * This controls insertion into the output elementary stream. The channel's `timecodeConfig` controls the
   * source of the timecode used for output.
   * @default - service default
   */
  readonly timecodeInsertion?: TimecodeInsertion;
  /**
   * Minimum QP value. Sets a floor on the quantization parameter.
   * @default - service default
   */
  readonly minQp?: number;
  /**
   * Minimum bitrate in bits/second.
   * @default - service default
   */
  readonly minBitrate?: number;
  /**
   * Quality level. ENHANCED_QUALITY produces slightly better video without increasing bitrate.
   * @default - service default
   */
  readonly qualityLevel?: H264QualityLevel;
  /**
   * Whether scene change detection inserts I-frames on scene changes.
   * @default H264SceneChangeDetect.ENABLED
   */
  readonly sceneChangeDetect?: H264SceneChangeDetect;
  /**
   * Whether spatial adaptive quantization adjusts quantization within each frame based on spatial variation.
   * @default H264SpatialAq.ENABLED
   */
  readonly spatialAq?: H264SpatialAq;
  /**
   * Whether temporal adaptive quantization adjusts quantization based on temporal variation between frames.
   * @default H264TemporalAq.ENABLED
   */
  readonly temporalAq?: H264TemporalAq;
  /**
   * Sub-GOP length mode.
   * @default - service default
   */
  readonly subgopLength?: SubgopLength;
}

/**
 * H.265 profile.
 */
export enum H265Profile {
  /** Main profile */
  MAIN = 'MAIN',
  /** Main 10-bit profile */
  MAIN_10BIT = 'MAIN_10BIT',
}

/**
 * H.265 tier.
 */
export enum H265Tier {
  /** Main tier */
  MAIN = 'MAIN',
  /** High tier */
  HIGH = 'HIGH',
}

/**
 * Properties for H.265 codec settings.
 */
export interface H265SettingsProps {
  /**
   * The rate control configuration.
   * @default - CBR with no bitrate (service default)
   */
  readonly rateControl?: H265RateControl;
  /**
   * The H.265 profile.
   * @default H265Profile.MAIN
   */
  readonly profile?: H265Profile;
  /**
   * The H.265 tier.
   * @default H265Tier.MAIN
   */
  readonly tier?: H265Tier;
  /**
   * The GOP size (keyframe interval).
   * @default GopSize.seconds(2)
   */
  readonly gopSize?: GopSize;
  /**
   * The video frame rate. Required for H.265.
   */
  readonly framerate: Framerate;
  /**
   * The pixel aspect ratio (PAR) of the video.
   * @default - square pixels
   */
  readonly pixelAspectRatio?: PixelAspectRatio;
  /**
   * Timecode burn-in settings to overlay timecode on the video.
   * @default - no timecode burn-in
   */
  readonly timecodeBurnin?: TimecodeBurninSettings;
  /**
   * Adaptive quantization strength. `AUTO` lets MediaLive manage AQ and enables the individual
   * `flickerAq` control; a fixed strength overrides it.
   * @default H265AdaptiveQuantization.AUTO
   */
  readonly adaptiveQuantization?: H265AdaptiveQuantization;
  /**
   * AFD signaling mode.
   * @default AfdSignaling.NONE
   */
  readonly afdSignaling?: AfdSignaling;
  /**
   * Whether to insert an Alternative Transfer Function SEI message for backwards compatibility with non-HDR decoders.
   * @default - service default
   */
  readonly alternativeTransferFunction?: H265AlternativeTransferFunction;
  /**
   * Size of buffer (HRD buffer model) in bits.
   * @default - service default
   */
  readonly bufSize?: number;
  /**
   * Whether to include color space metadata in the output.
   * @default - service default
   */
  readonly colorMetadata?: ColorMetadata;
  /**
   * Color space settings for the video.
   *
   * @default - service default
   */
  readonly colorSpaceSettings?: H265ColorSpaceSettings;
  /**
   * Deblocking filter control.
   * @default - service default
   */
  readonly deblocking?: H265Deblocking;
  /**
   * Optional video filter settings.
   *
   * @default - service default
   */
  readonly filterSettings?: H265FilterSettings;
  /**
   * Four-bit AFD value to write on all frames. Only valid when afdSignaling is FIXED.
   *
   * Valid values: FIXED_0000, FIXED_0010, FIXED_0011, FIXED_0100, FIXED_1000,
   * FIXED_1001, FIXED_1010, FIXED_1011, FIXED_1100, FIXED_1101, FIXED_1110, FIXED_1111.
   *
   * @default - service default
   */
  readonly fixedAfd?: string;
  /**
   * If enabled, adjusts quantization within each frame to reduce flicker on I-frames.
   * @default - service default
   */
  readonly flickerAq?: FlickerAq;
  /**
   * If enabled, uses reference B frames for GOP structures that have B frames > 1.
   * @default - service default
   */
  readonly gopBReference?: GopBReference;
  /**
   * Frequency of closed GOPs. Set to 1 for streaming so decoders joining mid-stream get an IDR frame quickly.
   * @default - service default
   */
  readonly gopClosedCadence?: number;
  /**
   * Number of B-frames between reference frames.
   * @default - service default
   */
  readonly gopNumBFrames?: number;
  /**
   * The H.265 level.
   *
   * Valid values: H265_LEVEL_1, H265_LEVEL_2, H265_LEVEL_2_1, H265_LEVEL_3,
   * H265_LEVEL_3_1, H265_LEVEL_4, H265_LEVEL_4_1, H265_LEVEL_5, H265_LEVEL_5_1,
   * H265_LEVEL_5_2, H265_LEVEL_6, H265_LEVEL_6_1, H265_LEVEL_6_2, H265_LEVEL_AUTO.
   *
   * @default - service default (auto)
   */
  readonly level?: H265Level;
  /**
   * Amount of lookahead. Low decreases latency/memory; high can produce better quality.
   * @default - service default
   */
  readonly lookAheadRateControl?: LookAheadRateControl;
  /**
   * Only meaningful if sceneChangeDetect is enabled. Enforces separation between
   * repeated (cadence) I-frames and I-frames inserted by scene change detection.
   * @default - service default
   */
  readonly minIInterval?: number;
  /**
   * Sets the scan type of the output.
   * @default ScanType.PROGRESSIVE
   */
  readonly scanType?: ScanType;
  /**
   * Number of slices per picture.
   * @default - encoder chooses based on resolution
   */
  readonly slices?: number;
  /**
   * Determines how timecodes are inserted into the video elementary stream.
   * This controls insertion into the output elementary stream. The channel's `timecodeConfig` controls the
   * source of the timecode used for output.
   * @default - service default
   */
  readonly timecodeInsertion?: TimecodeInsertion;
  /**
   * Minimum QP value.
   * @default - service default
   */
  readonly minQp?: number;
  /**
   * Minimum bitrate in bits/second.
   * @default - service default
   */
  readonly minBitrate?: number;
  /**
   * Whether motion vectors can cross picture boundaries.
   * @default - service default
   */
  readonly mvOverPictureBoundaries?: H265MvOverPictureBoundaries;
  /**
   * Whether to use temporal motion vector prediction.
   * @default - service default
   */
  readonly mvTemporalPredictor?: H265MvTemporalPredictor;
  /**
   * Sub-GOP length mode.
   * @default - service default
   */
  readonly subgopLength?: SubgopLength;
  /**
   * Tile height in pixels. Must be a multiple of the CTU size.
   * @default - service default
   */
  readonly tileHeight?: number;
  /**
   * Tile padding mode.
   * @default - service default
   */
  readonly tilePadding?: H265TilePadding;
  /**
   * Tile width in pixels. Must be a multiple of the CTU size.
   * @default - service default
   */
  readonly tileWidth?: number;
  /**
   * Treeblock size for the encoder.
   * @default - service default
   */
  readonly treeblockSize?: H265TreeblockSize;
  /**
   * Whether scene change detection inserts I-frames on scene changes.
   * @default H265SceneChangeDetect.ENABLED
   */
  readonly sceneChangeDetect?: H265SceneChangeDetect;
}

/**
 * Properties for AV1 codec settings.
 */
export interface Av1SettingsProps {
  /**
   * The rate control configuration.
   * @default - service default
   */
  readonly rateControl?: Av1RateControl;
  /**
   * The GOP size (keyframe interval).
   * @default GopSize.seconds(2)
   */
  readonly gopSize?: GopSize;
  /**
   * The video frame rate.
   * @default - follow source
   */
  readonly framerate?: Framerate;
  /**
   * Timecode burn-in settings to overlay timecode on the video.
   * @default - no timecode burn-in
   */
  readonly timecodeBurnin?: TimecodeBurninSettings;
  /**
   * AFD signaling mode.
   * @default AfdSignaling.NONE
   */
  readonly afdSignaling?: AfdSignaling;
  /**
   * Bit depth for the AV1 encode.
   * @default - service default
   */
  readonly bitDepth?: Av1BitDepth;
  /**
   * Size of buffer (HRD buffer model) in bits.
   * @default - service default
   */
  readonly bufSize?: number;
  /**
   * Color space settings for the video.
   *
   * @default - service default
   */
  readonly colorSpaceSettings?: Av1ColorSpaceSettings;
  /**
   * Four-bit AFD value to write on all frames. Only valid when afdSignaling is FIXED.
   *
   * Valid values: FIXED_0000, FIXED_0010, FIXED_0011, FIXED_0100, FIXED_1000,
   * FIXED_1001, FIXED_1010, FIXED_1011, FIXED_1100, FIXED_1101, FIXED_1110, FIXED_1111.
   *
   * @default - service default
   */
  readonly fixedAfd?: string;
  /**
   * The AV1 level.
   *
   * Valid values: AV1_LEVEL_2, AV1_LEVEL_2_1, AV1_LEVEL_3, AV1_LEVEL_3_1,
   * AV1_LEVEL_4, AV1_LEVEL_4_1, AV1_LEVEL_5, AV1_LEVEL_5_1, AV1_LEVEL_5_2,
   * AV1_LEVEL_5_3, AV1_LEVEL_6, AV1_LEVEL_6_1, AV1_LEVEL_6_2, AV1_LEVEL_6_3,
   * AV1_LEVEL_AUTO.
   *
   * @default Av1Level.AV1_LEVEL_AUTO
   */
  readonly level?: Av1Level;
  /**
   * Amount of lookahead. Low decreases latency/memory; high can produce better quality.
   * @default LookAheadRateControl.HIGH
   */
  readonly lookAheadRateControl?: LookAheadRateControl;
  /**
   * Minimum bitrate in bits/second.
   * @default - service default
   */
  readonly minBitrate?: number;
  /**
   * Only meaningful if sceneChangeDetect is enabled. Enforces separation between
   * repeated (cadence) I-frames and I-frames inserted by scene change detection.
   * @default - service default
   */
  readonly minIInterval?: number;
  /**
   * The pixel aspect ratio (PAR) of the video.
   * @default - service default
   */
  readonly pixelAspectRatio?: PixelAspectRatio;
  /**
   * Scene change detection.
   * @default Av1SceneChangeDetect.ENABLED
   */
  readonly sceneChangeDetect?: Av1SceneChangeDetect;
  /**
   * Spatial adaptive quantization.
   * @default Av1SpatialAq.ENABLED
   */
  readonly spatialAq?: Av1SpatialAq;
  /**
   * Temporal adaptive quantization.
   * @default Av1TemporalAq.ENABLED
   */
  readonly temporalAq?: Av1TemporalAq;
  /**
   * Timecode insertion mode.
   * @default - service default
   */
  readonly timecodeInsertion?: Av1TimecodeInsertion;
}

/**
 * Properties for frame capture codec settings.
 */
export interface FrameCaptureSettingsProps {
  /**
   * The interval between frame captures.
   * @default Duration.seconds(10)
   */
  readonly captureInterval?: Duration;
  /**
   * Timecode burn-in settings to overlay timecode on the video.
   * @default - no timecode burn-in
   */
  readonly timecodeBurnin?: TimecodeBurninSettings;
}

// =============================================================================
// VideoCodecSettings (abstract + subclasses)
// =============================================================================

/**
 * The type of video codec.
 */
export enum VideoCodecType {
  /** H.264 (AVC) */
  H264 = 'H264',
  /** H.265 (HEVC) */
  H265 = 'H265',
  /** AV1 */
  AV1 = 'AV1',
  /** Frame Capture (JPEG) */
  FRAME_CAPTURE = 'FRAME_CAPTURE',
}

/**
 * Video codec settings. Use the static factory methods to create.
 */
export abstract class VideoCodecSettings {
  /** Create H.264 (AVC) codec settings. */
  public static h264(props?: H264SettingsProps): VideoCodecSettings {
    return new H264VideoCodecSettings(props ?? {});
  }
  /** Create H.265 (HEVC) codec settings. Framerate is required for H.265. */
  public static h265(props: H265SettingsProps): VideoCodecSettings {
    return new H265VideoCodecSettings(props);
  }
  /** Create AV1 codec settings. */
  public static av1(props?: Av1SettingsProps): VideoCodecSettings {
    return new Av1VideoCodecSettings(props ?? {});
  }
  /** Create frame capture codec settings. */
  public static frameCapture(props?: FrameCaptureSettingsProps): VideoCodecSettings {
    return new FrameCaptureVideoCodecSettings(props ?? {});
  }

  /** @internal */
  public abstract readonly _codecType: VideoCodecType;
  /** @internal */
  public abstract _bind(): CfnChannel.VideoCodecSettingsProperty;
  /** @internal */
  public abstract _hasExplicitFramerate(): boolean;
}

/** @internal */
class H264VideoCodecSettings extends VideoCodecSettings {
  public readonly _codecType = VideoCodecType.H264;
  constructor(private readonly props: H264SettingsProps) { super(); }

  public _hasExplicitFramerate(): boolean {
    return this.props.framerate != null;
  }

  public _bind(): CfnChannel.VideoCodecSettingsProperty {
    const p = this.props;
    const rc = p.rateControl;
    return {
      h264Settings: {
        bitrate: rc?._bitrate?.toBps(),
        maxBitrate: rc?._maxBitrate?.toBps(),
        rateControlMode: rc?._mode,
        qvbrQualityLevel: rc?._qvbrQualityLevel,
        profile: p.profile ?? H264Profile.MAIN,
        gopSize: p.gopSize?._value ?? 2,
        gopSizeUnits: p.gopSize?._units ?? 'SECONDS',
        gopNumBFrames: p.gopNumBFrames,
        adaptiveQuantization: p.adaptiveQuantization ?? H264AdaptiveQuantization.AUTO,
        framerateControl: p.framerate ? 'SPECIFIED' : 'INITIALIZE_FROM_SOURCE',
        framerateNumerator: p.framerate?._numerator(),
        framerateDenominator: p.framerate?._denominator(),
        parControl: (p.pixelAspectRatio || p.framerate) ? 'SPECIFIED' : 'INITIALIZE_FROM_SOURCE',
        parNumerator: p.pixelAspectRatio?._numerator() ?? (p.framerate ? PixelAspectRatio.SQUARE._numerator() : undefined),
        parDenominator: p.pixelAspectRatio?._denominator() ?? (p.framerate ? PixelAspectRatio.SQUARE._denominator() : undefined),
        sceneChangeDetect: p.sceneChangeDetect ?? H264SceneChangeDetect.ENABLED,
        spatialAq: p.spatialAq ?? H264SpatialAq.ENABLED,
        temporalAq: p.temporalAq ?? H264TemporalAq.ENABLED,
        timecodeBurninSettings: p.timecodeBurnin ? {
          fontSize: p.timecodeBurnin.fontSize,
          position: p.timecodeBurnin.position,
          prefix: p.timecodeBurnin.prefix,
        } : undefined,
        afdSignaling: p.afdSignaling ?? AfdSignaling.NONE,
        bufFillPct: p.bufFillPct,
        bufSize: p.bufSize,
        colorMetadata: p.colorMetadata,
        colorSpaceSettings: p.colorSpaceSettings?._bind(),
        entropyEncoding: p.entropyEncoding,
        filterSettings: p.filterSettings?._bind(),
        fixedAfd: p.fixedAfd,
        flickerAq: p.flickerAq ?? FlickerAq.ENABLED,
        forceFieldPictures: p.forceFieldPictures,
        gopBReference: p.gopBReference,
        gopClosedCadence: p.gopClosedCadence,
        level: p.level ?? H264Level.H264_LEVEL_AUTO,
        lookAheadRateControl: p.lookAheadRateControl ?? LookAheadRateControl.MEDIUM,
        minIInterval: p.minIInterval,
        numRefFrames: p.numRefFrames,
        scanType: p.scanType ?? ScanType.PROGRESSIVE,
        slices: p.slices,
        softness: p.softness,
        syntax: p.syntax ?? H264Syntax.DEFAULT,
        timecodeInsertion: p.timecodeInsertion,
        minQp: p.minQp,
        minBitrate: p.minBitrate,
        qualityLevel: p.qualityLevel,
        subgopLength: p.subgopLength,
      },
    };
  }
}

/** @internal */
class H265VideoCodecSettings extends VideoCodecSettings {
  public readonly _codecType = VideoCodecType.H265;
  constructor(private readonly props: H265SettingsProps) { super(); }

  public _hasExplicitFramerate(): boolean {
    return this.props.framerate != null;
  }

  public _bind(): CfnChannel.VideoCodecSettingsProperty {
    const p = this.props;
    const rc = p.rateControl;
    return {
      h265Settings: {
        bitrate: rc?._bitrate?.toBps(),
        maxBitrate: rc?._maxBitrate?.toBps(),
        rateControlMode: rc?._mode,
        qvbrQualityLevel: rc?._qvbrQualityLevel,
        profile: p.profile ?? H265Profile.MAIN,
        tier: p.tier ?? H265Tier.MAIN,
        level: p.level,
        gopSize: p.gopSize?._value ?? 2,
        gopSizeUnits: p.gopSize?._units ?? 'SECONDS',
        framerateNumerator: p.framerate._numerator(),
        framerateDenominator: p.framerate._denominator(),
        parNumerator: p.pixelAspectRatio?._numerator() ?? PixelAspectRatio.SQUARE._numerator(),
        parDenominator: p.pixelAspectRatio?._denominator() ?? PixelAspectRatio.SQUARE._denominator(),
        sceneChangeDetect: p.sceneChangeDetect ?? H265SceneChangeDetect.ENABLED,
        timecodeBurninSettings: p.timecodeBurnin ? {
          fontSize: p.timecodeBurnin.fontSize,
          position: p.timecodeBurnin.position,
          prefix: p.timecodeBurnin.prefix,
        } : undefined,
        adaptiveQuantization: p.adaptiveQuantization ?? H265AdaptiveQuantization.AUTO,
        afdSignaling: p.afdSignaling ?? AfdSignaling.NONE,
        alternativeTransferFunction: p.alternativeTransferFunction,
        bufSize: p.bufSize,
        colorMetadata: p.colorMetadata,
        colorSpaceSettings: p.colorSpaceSettings?._bind(),
        deblocking: p.deblocking,
        filterSettings: p.filterSettings?._bind(),
        fixedAfd: p.fixedAfd,
        flickerAq: p.flickerAq,
        gopBReference: p.gopBReference,
        gopClosedCadence: p.gopClosedCadence,
        gopNumBFrames: p.gopNumBFrames,
        lookAheadRateControl: p.lookAheadRateControl,
        minIInterval: p.minIInterval,
        scanType: p.scanType ?? ScanType.PROGRESSIVE,
        slices: p.slices,
        timecodeInsertion: p.timecodeInsertion,
        minQp: p.minQp,
        minBitrate: p.minBitrate,
        mvOverPictureBoundaries: p.mvOverPictureBoundaries,
        mvTemporalPredictor: p.mvTemporalPredictor,
        subgopLength: p.subgopLength,
        tileHeight: p.tileHeight,
        tilePadding: p.tilePadding,
        tileWidth: p.tileWidth,
        treeblockSize: p.treeblockSize,
      },
    };
  }
}

/** @internal */
class Av1VideoCodecSettings extends VideoCodecSettings {
  public readonly _codecType = VideoCodecType.AV1;
  constructor(private readonly props: Av1SettingsProps) { super(); }

  public _hasExplicitFramerate(): boolean {
    return this.props.framerate != null;
  }

  public _bind(): CfnChannel.VideoCodecSettingsProperty {
    const p = this.props;
    const rc = p.rateControl;
    return {
      av1Settings: {
        bitrate: rc?._bitrate?.toBps(),
        maxBitrate: rc?._maxBitrate?.toBps(),
        rateControlMode: rc?._mode,
        qvbrQualityLevel: rc?._qvbrQualityLevel,
        gopSize: p.gopSize?._value ?? 2,
        gopSizeUnits: p.gopSize?._units ?? 'SECONDS',
        framerateNumerator: p.framerate?._numerator(),
        framerateDenominator: p.framerate?._denominator(),
        timecodeBurninSettings: p.timecodeBurnin ? {
          fontSize: p.timecodeBurnin.fontSize,
          position: p.timecodeBurnin.position,
          prefix: p.timecodeBurnin.prefix,
        } : undefined,
        afdSignaling: p.afdSignaling ?? AfdSignaling.NONE,
        bitDepth: p.bitDepth,
        bufSize: p.bufSize,
        colorSpaceSettings: p.colorSpaceSettings?._bind(),
        fixedAfd: p.fixedAfd,
        level: p.level ?? Av1Level.AV1_LEVEL_AUTO,
        minBitrate: p.minBitrate,
        minIInterval: p.minIInterval,
        parNumerator: p.pixelAspectRatio?._numerator(),
        parDenominator: p.pixelAspectRatio?._denominator(),
        sceneChangeDetect: p.sceneChangeDetect ?? Av1SceneChangeDetect.ENABLED,
        spatialAq: p.spatialAq ?? Av1SpatialAq.ENABLED,
        temporalAq: p.temporalAq ?? Av1TemporalAq.ENABLED,
        lookAheadRateControl: p.lookAheadRateControl ?? LookAheadRateControl.HIGH,
        timecodeInsertion: p.timecodeInsertion,
      },
    };
  }
}

/** @internal */
class FrameCaptureVideoCodecSettings extends VideoCodecSettings {
  public readonly _codecType = VideoCodecType.FRAME_CAPTURE;
  constructor(private readonly props: FrameCaptureSettingsProps) { super(); }

  public _hasExplicitFramerate(): boolean { return true; }

  public _bind(): CfnChannel.VideoCodecSettingsProperty {
    const p = this.props;
    // Use SECONDS for whole-second intervals (the common case, and the historical default) and
    // MILLISECONDS for sub-second intervals, so the full Duration range is expressible.
    const intervalMs = (p.captureInterval ?? Duration.seconds(10)).toMilliseconds();
    const wholeSeconds = intervalMs % 1000 === 0;
    return {
      frameCaptureSettings: {
        captureInterval: wholeSeconds ? intervalMs / 1000 : intervalMs,
        captureIntervalUnits: wholeSeconds ? 'SECONDS' : 'MILLISECONDS',
        timecodeBurninSettings: p.timecodeBurnin ? {
          fontSize: p.timecodeBurnin.fontSize,
          position: p.timecodeBurnin.position,
          prefix: p.timecodeBurnin.prefix,
        } : undefined,
      },
    };
  }
}

