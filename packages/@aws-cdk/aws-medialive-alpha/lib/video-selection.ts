import type { CfnChannel } from 'aws-cdk-lib/aws-medialive';

/**
 * Video color space.
 */
export enum VideoColorSpace {
  /** Follow the source color space */
  FOLLOW = 'FOLLOW',
  /** Rec. 601 */
  REC_601 = 'REC_601',
  /** Rec. 709 */
  REC_709 = 'REC_709',
  /** HDR10 */
  HDR10 = 'HDR10',
  /** HLG 2020 */
  HLG_2020 = 'HLG_2020',
}

/**
 * Controls how the `colorSpace` value is used when it is not `FOLLOW`.
 */
export enum VideoColorSpaceUsage {
  /**
   * Use the input's color space data when present; fall back to `colorSpace` only when the
   * input has none.
   */
  FALLBACK = 'FALLBACK',
  /** Always use `colorSpace`, ignoring any color space data in the input. */
  FORCE = 'FORCE',
}

/**
 * HDR10 color space metadata for the input video.
 */
export interface Hdr10Settings {
  /**
   * Maximum Content Light Level (MaxCLL) — the maximum light level, in nits, of any single
   * pixel in the stream.
   * @default - not set
   */
  readonly maxContentLightLevel?: number;
  /**
   * Maximum Frame Average Light Level (MaxFALL) — the maximum average light level, in nits,
   * of any single frame in the stream.
   * @default - not set
   */
  readonly maxFrameAverageLightLevel?: number;
}

/**
 * Selects the specific video to extract from the input — by PID or by program. Create with
 * the static factory methods; exactly one selection applies, enforced by the type.
 */
export abstract class VideoSelection {
  /** Extract the video with this PID. */
  public static byPid(pid: number): VideoSelection {
    return new VideoPidSelection(pid);
  }
  /**
   * Extract the video from this program within a multi-program transport stream. If the
   * program doesn't exist, MediaLive selects the first program in the stream.
   */
  public static byProgramId(programId: number): VideoSelection {
    return new VideoProgramIdSelection(programId);
  }

  /** @internal */
  public abstract _bind(): CfnChannel.VideoSelectorSettingsProperty;
}

/** @internal */
class VideoPidSelection extends VideoSelection {
  constructor(private readonly pid: number) { super(); }
  public _bind(): CfnChannel.VideoSelectorSettingsProperty {
    return { videoSelectorPid: { pid: this.pid } };
  }
}

/** @internal */
class VideoProgramIdSelection extends VideoSelection {
  constructor(private readonly programId: number) { super(); }
  public _bind(): CfnChannel.VideoSelectorSettingsProperty {
    return { videoSelectorProgramId: { programId: this.programId } };
  }
}

/**
 * Video selector settings for an input.
 */
export interface VideoSelectorSettings {
  /**
   * The color space of the input video.
   * @default - service default
   */
  readonly colorSpace?: VideoColorSpace;
  /**
   * How `colorSpace` is applied when it is not `FOLLOW`.
   * @default - MediaLive service default
   */
  readonly colorSpaceUsage?: VideoColorSpaceUsage;
  /**
   * HDR10 color space metadata for the input.
   * @default - none
   */
  readonly hdr10?: Hdr10Settings;
  /**
   * Selects the specific video to extract from the input (by PID or by program).
   * @default - MediaLive selects the video automatically
   */
  readonly selectBy?: VideoSelection;
}
