import type { Duration } from 'aws-cdk-lib';
import type { IRole } from 'aws-cdk-lib/aws-iam';
import type { CfnChannel } from 'aws-cdk-lib/aws-medialive';
import type { FileLocation } from './file-location';

/** Controls insertion of the Program Clock Reference (PCR) in an M3U8 container. */
export enum M3u8PcrControl {
  /** Insert PCR at the configured `pcrPeriod`. */
  CONFIGURED_PCR_PERIOD = 'CONFIGURED_PCR_PERIOD',
  /** Insert a PCR for every Packetized Elementary Stream (PES) header. */
  PCR_EVERY_PES_PACKET = 'PCR_EVERY_PES_PACKET',
}

/** SCTE-35 passthrough behavior for an M3U8 container. */
export enum M3u8Scte35Behavior {
  /** Do not pass SCTE-35 signals through. */
  NO_PASSTHROUGH = 'NO_PASSTHROUGH',
  /** Pass SCTE-35 signals from the input through to the output. */
  PASSTHROUGH = 'PASSTHROUGH',
}

/** Timed-metadata passthrough behavior for an M3U8 container. */
export enum M3u8TimedMetadataBehavior {
  /** Do not pass timed metadata through. */
  NO_PASSTHROUGH = 'NO_PASSTHROUGH',
  /** Pass timed metadata from the input through to the output. */
  PASSTHROUGH = 'PASSTHROUGH',
}

/** Nielsen ID3 passthrough behavior for an M3U8 container. */
export enum M3u8NielsenId3Behavior {
  /** Do not insert Nielsen ID3 tags. */
  NO_PASSTHROUGH = 'NO_PASSTHROUGH',
  /** Nielsen inaudible tones for media tracking will be detected in the input audio and an equivalent ID3 tag will be inserted in the output. */
  PASSTHROUGH = 'PASSTHROUGH',
}

/** KLV data passthrough behavior for an M3U8 container. */
export enum M3u8KlvBehavior {
  /** Do not pass KLV data through. */
  NONE = 'NONE',
  /** Pass KLV data from the input through to the output. */
  PASSTHROUGH = 'PASSTHROUGH',
}

/**
 * Properties for M3U8 container settings.
 *
 * PID properties accept a decimal or hexadecimal value (and, where noted, ranges or
 * comma-separated lists). Interval properties are `Duration` values rendered as milliseconds.
 */
export interface M3u8SettingsProps {
  /**
   * The number of audio frames to insert for each PES packet.
   * @default - service default
   */
  readonly audioFramesPerPes?: number;
  /**
   * The PID(s) of the elementary audio streams. Accepts ranges and comma separation.
   * @default - service default
   */
  readonly audioPids?: string;
  /**
   * KLV data passthrough behavior.
   * @default - service default
   */
  readonly klvBehavior?: M3u8KlvBehavior;
  /**
   * The PID(s) of the KLV data streams.
   * @default - service default
   */
  readonly klvDataPids?: string;
  /**
   * Nielsen ID3 passthrough behavior.
   * @default - service default
   */
  readonly nielsenId3Behavior?: M3u8NielsenId3Behavior;
  /**
   * The interval between instances of the PAT in the output. A value of 0 writes the PAT once
   * per segment file.
   * @default - service default
   */
  readonly patInterval?: Duration;
  /**
   * Controls insertion of the Program Clock Reference (PCR).
   * @default - service default
   */
  readonly pcrControl?: M3u8PcrControl;
  /**
   * The maximum interval between Program Clock References (PCRs).
   * @default - service default
   */
  readonly pcrPeriod?: Duration;
  /**
   * The PID of the Program Clock Reference (PCR). Defaults to the video PID.
   * @default - same as the video PID
   */
  readonly pcrPid?: string;
  /**
   * The interval between instances of the PMT in the output. A value of 0 writes the PMT once
   * per segment file.
   * @default - service default
   */
  readonly pmtInterval?: Duration;
  /**
   * The PID of the Program Map Table (PMT).
   * @default - service default
   */
  readonly pmtPid?: string;
  /**
   * The value of the program number field in the PMT.
   * @default - service default
   */
  readonly programNum?: number;
  /**
   * SCTE-35 passthrough behavior.
   * @default - service default
   */
  readonly scte35Behavior?: M3u8Scte35Behavior;
  /**
   * The PID of the SCTE-35 stream.
   * @default - service default
   */
  readonly scte35Pid?: string;
  /**
   * Timed-metadata passthrough behavior.
   * @default - service default
   */
  readonly timedMetadataBehavior?: M3u8TimedMetadataBehavior;
  /**
   * The PID of the timed-metadata stream. Valid values are 32 (0x20)..8182 (0x1ff6).
   * @default - service default
   */
  readonly timedMetadataPid?: string;
  /**
   * The value of the transport stream ID field in the PMT.
   * @default - service default
   */
  readonly transportStreamId?: number;
  /**
   * The PID of the elementary video stream.
   * @default - service default
   */
  readonly videoPid?: string;
}

/**
 * M3U8 container settings for a standard HLS output.
 *
 * Use `M3u8Settings.of()` to control the transport stream produced by a standard HLS output.
 * Omitting it uses MediaLive's service defaults.
 */
export class M3u8Settings {
  /** Create M3U8 container settings. */
  public static of(props: M3u8SettingsProps): M3u8Settings {
    return new M3u8Settings(props);
  }

  private constructor(private readonly props: M3u8SettingsProps) {}

  /** @internal */
  public _bind(): CfnChannel.M3u8SettingsProperty {
    const p = this.props;
    return {
      audioFramesPerPes: p.audioFramesPerPes,
      audioPids: p.audioPids,
      klvBehavior: p.klvBehavior,
      klvDataPids: p.klvDataPids,
      nielsenId3Behavior: p.nielsenId3Behavior,
      patInterval: p.patInterval?.toMilliseconds(),
      pcrControl: p.pcrControl,
      pcrPeriod: p.pcrPeriod?.toMilliseconds(),
      pcrPid: p.pcrPid,
      pmtInterval: p.pmtInterval?.toMilliseconds(),
      pmtPid: p.pmtPid,
      programNum: p.programNum,
      scte35Behavior: p.scte35Behavior,
      scte35Pid: p.scte35Pid,
      timedMetadataBehavior: p.timedMetadataBehavior,
      timedMetadataPid: p.timedMetadataPid,
      transportStreamId: p.transportStreamId,
      videoPid: p.videoPid,
    };
  }
}

/** The audio track type for an audio-only HLS output. */
export enum HlsAudioTrackType {
  /** A playable audio-only variant stream (EXT-X-STREAM-INF). */
  AUDIO_ONLY_VARIANT_STREAM = 'AUDIO_ONLY_VARIANT_STREAM',
  /** Alternate rendition, auto-select, default (DEFAULT=YES, AUTOSELECT=YES). */
  ALTERNATE_AUDIO_AUTO_SELECT_DEFAULT = 'ALTERNATE_AUDIO_AUTO_SELECT_DEFAULT',
  /** Alternate rendition, auto-select, not default (DEFAULT=NO, AUTOSELECT=YES). */
  ALTERNATE_AUDIO_AUTO_SELECT = 'ALTERNATE_AUDIO_AUTO_SELECT',
  /** Alternate rendition, not auto-select (DEFAULT=NO, AUTOSELECT=NO). */
  ALTERNATE_AUDIO_NOT_AUTO_SELECT = 'ALTERNATE_AUDIO_NOT_AUTO_SELECT',
}

/** The segment container type for an audio-only HLS output. */
export enum HlsAudioOnlySegmentType {
  /** AAC segments. */
  AAC = 'AAC',
  /** fMP4 segments. */
  FMP4 = 'FMP4',
}

/** Properties for standard (video) HLS settings. */
export interface StandardHlsSettingsProps {
  /**
   * The audio GROUP-IDs used with this video output stream, comma-separated.
   * @default - service default
   */
  readonly audioRenditionSets?: string;
  /**
   * The M3U8 container settings.
   * @default - service defaults
   */
  readonly m3u8Settings?: M3u8Settings;
}

/** Properties for audio-only HLS settings. */
export interface AudioOnlyHlsSettingsProps {
  /**
   * The group that this audio rendition belongs to.
   * @default - service default
   */
  readonly audioGroupId?: string;
  /**
   * A .jpg or .png cover-art image embedded in each audio-only segment. Provide a `FileLocation`
   * referencing an S3 bucket (`FileLocation.fromBucket`, which auto-grants read access) or a URL
   * (`FileLocation.url`).
   * @default - no cover art
   */
  readonly audioOnlyImage?: FileLocation;
  /**
   * How the audio rendition is signaled in the HLS manifest.
   * @default - service default
   */
  readonly audioTrackType?: HlsAudioTrackType;
  /**
   * The segment container type.
   * @default - service default
   */
  readonly segmentType?: HlsAudioOnlySegmentType;
}

/** Properties for fMP4 HLS settings. */
export interface Fmp4HlsSettingsProps {
  /**
   * The audio GROUP-IDs used with this video output stream, comma-separated.
   * @default - service default
   */
  readonly audioRenditionSets?: string;
  /**
   * Nielsen ID3 passthrough behavior.
   * @default - service default
   */
  readonly nielsenId3Behavior?: M3u8NielsenId3Behavior;
  /**
   * Timed-metadata passthrough behavior.
   * @default - service default
   */
  readonly timedMetadataBehavior?: M3u8TimedMetadataBehavior;
}

/**
 * Per-output HLS settings. Select the variant that matches the output: a standard (video)
 * output, an audio-only rendition, an fMP4 output, or a frame-capture output.
 */
export abstract class HlsSettings {
  /** Settings for a standard (video) HLS output. */
  public static standard(props: StandardHlsSettingsProps = {}): HlsSettings {
    return new StandardHlsSettings(props);
  }
  /** Settings for an audio-only HLS rendition. */
  public static audioOnly(props: AudioOnlyHlsSettingsProps = {}): HlsSettings {
    return new AudioOnlyHlsSettings(props);
  }
  /** Settings for an fMP4 HLS output. */
  public static fmp4(props: Fmp4HlsSettingsProps = {}): HlsSettings {
    return new Fmp4HlsSettings(props);
  }
  /** Settings for a frame-capture output in an HLS output group. */
  public static frameCapture(): HlsSettings {
    return new FrameCaptureHlsSettings();
  }

  /** @internal */
  public abstract _bind(): CfnChannel.HlsSettingsProperty;

  /**
   * Grant the channel role read access to any external files these settings reference (e.g. an
   * audio-only cover-art image in S3). Default is a no-op; audio-only settings override it.
   * @internal
   */
  public _grantRead(_role: IRole): void {}
}

/** @internal */
class StandardHlsSettings extends HlsSettings {
  constructor(private readonly props: StandardHlsSettingsProps) { super(); }
  public _bind(): CfnChannel.HlsSettingsProperty {
    return {
      standardHlsSettings: {
        audioRenditionSets: this.props.audioRenditionSets,
        m3U8Settings: this.props.m3u8Settings?._bind() ?? {},
      },
    };
  }
}

/** @internal */
class AudioOnlyHlsSettings extends HlsSettings {
  constructor(private readonly props: AudioOnlyHlsSettingsProps) { super(); }
  public _bind(): CfnChannel.HlsSettingsProperty {
    return {
      audioOnlyHlsSettings: {
        audioGroupId: this.props.audioGroupId,
        audioOnlyImage: this.props.audioOnlyImage?._bind(),
        audioTrackType: this.props.audioTrackType,
        segmentType: this.props.segmentType,
      },
    };
  }
  public override _grantRead(role: IRole): void {
    this.props.audioOnlyImage?._grantRead(role);
  }
}

/** @internal */
class Fmp4HlsSettings extends HlsSettings {
  constructor(private readonly props: Fmp4HlsSettingsProps) { super(); }
  public _bind(): CfnChannel.HlsSettingsProperty {
    return {
      fmp4HlsSettings: {
        audioRenditionSets: this.props.audioRenditionSets,
        nielsenId3Behavior: this.props.nielsenId3Behavior,
        timedMetadataBehavior: this.props.timedMetadataBehavior,
      },
    };
  }
}

/** @internal */
class FrameCaptureHlsSettings extends HlsSettings {
  public _bind(): CfnChannel.HlsSettingsProperty {
    return { frameCaptureHlsSettings: {} };
  }
}
