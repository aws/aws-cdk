import type { Bitrate, Duration } from 'aws-cdk-lib';
import type { CfnChannel } from 'aws-cdk-lib/aws-medialive';
import type { AudioSelector } from './audio-selector';
import type { CaptionSelector } from './caption-selector';
import type { IInput } from './input';
import type { VideoSelectorSettings } from './video-selection';

/**
 * The source end behavior for file-based inputs.
 */
export enum SourceEndBehavior {
  /** Continue with the last frame */
  CONTINUE = 'CONTINUE',
  /** Loop the input */
  LOOP = 'LOOP',
}

/**
 * Input filter mode.
 */
export enum InputFilter {
  /** Auto-detect filtering based on input type */
  AUTO = 'AUTO',
  /** Disable filtering */
  DISABLED = 'DISABLED',
  /** Force filtering regardless of input type */
  FORCED = 'FORCED',
}

/**
 * SMPTE-2038 data preference.
 */
export enum Smpte2038DataPreference {
  /** Extract from SMPTE-2038 if present */
  PREFER = 'PREFER',
  /** Never extract from SMPTE-2038 */
  IGNORE = 'IGNORE',
}

/**
 * Server validation mode for HTTPS inputs.
 */
export enum ServerValidation {
  /** Check cryptography and server name */
  CHECK_CRYPTOGRAPHY_AND_VALIDATE_NAME = 'CHECK_CRYPTOGRAPHY_AND_VALIDATE_NAME',
  /** Check cryptography only (useful for S3 bucket names with dots) */
  CHECK_CRYPTOGRAPHY_ONLY = 'CHECK_CRYPTOGRAPHY_ONLY',
}

/**
 * Network input settings for URL pull inputs.
 */
export interface NetworkInputSettings {
  /**
   * HTTPS server certificate validation mode.
   * @default - service default
   */
  readonly serverValidation?: ServerValidation;
  /**
   * HLS input settings (bandwidth selection, buffer segments, retries).
   * @default - no HLS input settings
   */
  readonly hlsInputSettings?: HlsInputSettings;
  /**
   * For a multicast input, filter to content from a specific source IP address
   * (source-specific multicast).
   * @default - no source IP filter
   */
  readonly multicastSourceIp?: string;
}

/** The source MediaLive ingests SCTE-35 messages from for an HLS input. */
export enum HlsScte35Source {
  /** Ingest SCTE-35 from the content segments (in the stream). */
  SEGMENTS = 'SEGMENTS',
  /** Ingest SCTE-35 from tags in the playlist (the HLS manifest). */
  MANIFEST = 'MANIFEST',
}

/**
 * HLS input settings for URL pull inputs.
 */
export interface HlsInputSettings {
  /**
   * The bandwidth to select from the HLS manifest. MediaLive chooses the rendition
   * whose manifest bandwidth most closely matches this value.
   * @default - highest bandwidth
   */
  readonly bandwidth?: Bitrate;
  /**
   * When specified, reading of the HLS input begins this many buffer segments from the end
   * (most recently written segment).
   * @default - the HLS input begins with the first segment specified in the m3u8
   */
  readonly bufferSegments?: number;
  /**
   * Number of consecutive read failures before the input is considered unavailable.
   * @default - service default
   */
  readonly retries?: number;
  /**
   * The interval between retry attempts.
   * @default - service default
   */
  readonly retryInterval?: Duration;
  /**
   * The source MediaLive ingests SCTE-35 messages from — the content segments or the manifest.
   * @default - service default
   */
  readonly scte35Source?: HlsScte35Source;
}

/**
 * Input preference when deciding which input to make active after a previously failed input
 * has recovered.
 */
export enum InputPreference {
  /** No preference — stay on the currently active input even after the other recovers. */
  EQUAL_INPUT_PREFERENCE = 'EQUAL_INPUT_PREFERENCE',
  /**
   * Prefer the primary input — switch back to it once it has been free of failover
   * conditions for the error-clear time.
   */
  PRIMARY_INPUT_PREFERRED = 'PRIMARY_INPUT_PREFERRED',
}

/**
 * Properties for an input-loss failover condition.
 */
export interface InputLossFailoverProps {
  /**
   * The amount of time with no input detected before failover occurs.
   * @default - MediaLive service default
   */
  readonly threshold?: Duration;
}

/**
 * Properties for an audio-silence failover condition.
 */
export interface AudioSilenceFailoverProps {
  /**
   * The audio selector (defined on the input attachment) that MediaLive monitors for
   * silence. Pass the same `AudioSelector` instance you put in the attachment's
   * `audioSelectors` — select your most important rendition.
   *
   * [disable-awslint:prefer-ref-interface]
   */
  readonly audioSelector: AudioSelector;
  /**
   * How long the audio must be silent (audio loss, or quieter than -50 dBFS) before
   * failover occurs.
   * @default - MediaLive service default
   */
  readonly threshold?: Duration;
}

/**
 * Properties for a video-black failover condition.
 */
export interface VideoBlackFailoverProps {
  /**
   * The fraction of white (0.0–1.0) below which a pixel is considered black. Every pixel in
   * a frame must be below this threshold for the frame to count as black. For example, 0.1
   * means 10% white (90% black).
   * @default - MediaLive service default
   */
  readonly blackDetectThreshold?: number;
  /**
   * How long the content must be black before failover occurs.
   * @default - MediaLive service default
   */
  readonly threshold?: Duration;
}

/**
 * A condition that, when met on the active input, triggers automatic input failover to the
 * secondary input. Create conditions with the static factory methods.
 */
export abstract class FailoverCondition {
  /** Fail over when no input is detected for the threshold period. */
  public static inputLoss(props: InputLossFailoverProps = {}): FailoverCondition {
    return new InputLossFailoverCondition(props);
  }
  /** Fail over when the monitored audio selector is silent for the threshold period. */
  public static audioSilence(props: AudioSilenceFailoverProps): FailoverCondition {
    return new AudioSilenceFailoverCondition(props);
  }
  /** Fail over when the content is black for the threshold period. */
  public static videoBlack(props: VideoBlackFailoverProps = {}): FailoverCondition {
    return new VideoBlackFailoverCondition(props);
  }

  /** @internal */
  public abstract _bind(): CfnChannel.FailoverConditionProperty;
}

/** @internal */
class InputLossFailoverCondition extends FailoverCondition {
  constructor(private readonly props: InputLossFailoverProps) { super(); }
  public _bind(): CfnChannel.FailoverConditionProperty {
    return {
      failoverConditionSettings: {
        inputLossSettings: { inputLossThresholdMsec: this.props.threshold?.toMilliseconds() },
      },
    };
  }
}

/** @internal */
class AudioSilenceFailoverCondition extends FailoverCondition {
  constructor(private readonly props: AudioSilenceFailoverProps) { super(); }
  public _bind(): CfnChannel.FailoverConditionProperty {
    return {
      failoverConditionSettings: {
        audioSilenceSettings: {
          audioSelectorName: this.props.audioSelector.name,
          audioSilenceThresholdMsec: this.props.threshold?.toMilliseconds(),
        },
      },
    };
  }
}

/** @internal */
class VideoBlackFailoverCondition extends FailoverCondition {
  constructor(private readonly props: VideoBlackFailoverProps) { super(); }
  public _bind(): CfnChannel.FailoverConditionProperty {
    return {
      failoverConditionSettings: {
        videoBlackSettings: {
          blackDetectThreshold: this.props.blackDetectThreshold,
          videoBlackThresholdMsec: this.props.threshold?.toMilliseconds(),
        },
      },
    };
  }
}

/**
 * Automatic input failover configuration for an input attachment. When the active (primary)
 * input meets any of the failover conditions, MediaLive switches to the secondary input
 * without restarting the channel. This is input-source redundancy, distinct from the
 * pipeline redundancy provided by `ChannelClass.STANDARD`.
 *
 * @see https://docs.aws.amazon.com/medialive/latest/ug/feature-automatic-input-failover.html
 */
export interface AutomaticInputFailover {
  /**
   * The secondary input to fail over to. Must be the same input class as the primary input.
   *
   * [disable-awslint:prefer-ref-interface]
   */
  readonly secondaryInput: IInput;
  /**
   * The conditions that trigger failover to the secondary input.
   * @default - a single input-loss condition with the MediaLive service default threshold
   */
  readonly failoverConditions?: FailoverCondition[];
  /**
   * Which input to prefer once a failed input has recovered.
   * @default InputPreference.EQUAL_INPUT_PREFERENCE
   */
  readonly inputPreference?: InputPreference;
  /**
   * How long a recovered input must remain free of failover conditions before it is
   * considered healthy. Particularly relevant with `InputPreference.PRIMARY_INPUT_PREFERRED`.
   * @default - MediaLive service default
   */
  readonly errorClearTime?: Duration;
}

/**
 * An input attachment definition for a channel.
 */
export interface InputAttachment {
  /**
   * The input to attach.
   *
   * [disable-awslint:prefer-ref-interface]
   */
  readonly input: IInput;
  /**
   * A name for this input attachment, used to reference it in schedule actions.
   * @default - auto-generated
   */
  readonly inputAttachmentName?: string;
  /**
   * The source end behavior for file-based inputs.
   * @default SourceEndBehavior.LOOP for MP4 and TS file inputs, SourceEndBehavior.CONTINUE for all others
   */
  readonly sourceEndBehavior?: SourceEndBehavior;
  /**
   * The input filter mode.
   * @default InputFilter.AUTO
   */
  readonly inputFilter?: InputFilter;
  /**
   * The filter strength (1-5). 1 is minimal, 5 is strongest.
   * @default 1
   */
  readonly filterStrength?: number;
  /**
   * Whether to enable the deblock filter.
   * @default false
   */
  readonly deblockFilter?: boolean;
  /**
   * Whether to enable the denoise filter.
   * @default false
   */
  readonly denoiseFilter?: boolean;
  /**
   * SMPTE-2038 ancillary data preference.
   * @default Smpte2038DataPreference.IGNORE
   */
  readonly smpte2038DataPreference?: Smpte2038DataPreference;
  /**
   * Audio selectors to extract specific audio tracks from the input.
   * @default - no audio selectors (uses default audio)
   */
  readonly audioSelectors?: AudioSelector[];
  /**
   * Caption selectors to extract specific caption tracks from the input.
   * @default - no caption selectors
   */
  readonly captionSelectors?: CaptionSelector[];
  /**
   * The SCTE-35 PID override for this input.
   * @default - auto-detect
   */
  readonly scte35Pid?: number;
  /**
   * Video selector settings for the input (color space, PID selection).
   * @default - no video selector (use default video)
   */
  readonly videoSelector?: VideoSelectorSettings;
  /**
   * Network input settings (for URL pull inputs — HLS buffer, server validation).
   * @default - no network input settings
   */
  readonly networkInputSettings?: NetworkInputSettings;
  /**
   * The logical interface names (MediaLive Anywhere) this input is wired to. Each name maps the
   * input to a network interface on the channel's nodes.
   * @default - no logical interface names
   */
  readonly logicalInterfaceNames?: string[];
  /**
   * Automatic input failover to a secondary input. When the active input meets any of the
   * failover conditions, MediaLive switches to the secondary input without restarting the
   * channel. This is input-source redundancy, distinct from the pipeline redundancy of
   * `ChannelClass.STANDARD`.
   * @default - no automatic input failover
   */
  readonly automaticInputFailover?: AutomaticInputFailover;
}
