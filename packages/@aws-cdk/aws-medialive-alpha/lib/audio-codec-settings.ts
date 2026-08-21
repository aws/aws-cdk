import type { Bitrate } from 'aws-cdk-lib';
import type { CfnChannel } from 'aws-cdk-lib/aws-medialive';

/**
 * Audio sample rate for AAC, MP2, and WAV codecs.
 *
 * Use one of the standard presets or `AudioSampleRate.of(hz)` for a custom value.
 */
export class AudioSampleRate {
  /** 8,000 Hz */
  public static readonly HZ_8000 = new AudioSampleRate(8000);
  /** 12,000 Hz */
  public static readonly HZ_12000 = new AudioSampleRate(12000);
  /** 16,000 Hz */
  public static readonly HZ_16000 = new AudioSampleRate(16000);
  /** 22,050 Hz */
  public static readonly HZ_22050 = new AudioSampleRate(22050);
  /** 24,000 Hz */
  public static readonly HZ_24000 = new AudioSampleRate(24000);
  /** 32,000 Hz */
  public static readonly HZ_32000 = new AudioSampleRate(32000);
  /** 44,100 Hz */
  public static readonly HZ_44100 = new AudioSampleRate(44100);
  /** 48,000 Hz */
  public static readonly HZ_48000 = new AudioSampleRate(48000);
  /** 88,200 Hz */
  public static readonly HZ_88200 = new AudioSampleRate(88200);
  /** 96,000 Hz */
  public static readonly HZ_96000 = new AudioSampleRate(96000);

  /**
   * A custom sample rate in Hz.
   * @param hz the sample rate in Hz
   */
  public static of(hz: number): AudioSampleRate {
    return new AudioSampleRate(hz);
  }

  private constructor(private readonly hz: number) {}

  /** @internal */
  public _toHz(): number {
    return this.hz;
  }
}

/**
 * Audio bit depth for WAV codec.
 *
 * Use one of the standard presets or `AudioBitDepth.of(bits)` for a custom value.
 */
export class AudioBitDepth {
  /** 16-bit */
  public static readonly DEPTH_16 = new AudioBitDepth(16);
  /** 24-bit */
  public static readonly DEPTH_24 = new AudioBitDepth(24);

  /**
   * A custom bit depth.
   * @param bits the bit depth
   */
  public static of(bits: number): AudioBitDepth {
    return new AudioBitDepth(bits);
  }

  private constructor(private readonly bits: number) {}

  /** @internal */
  public _toBits(): number {
    return this.bits;
  }
}

/**
 * The type of audio codec.
 */
export enum AudioCodecType {
  /** AAC */
  AAC = 'AAC',
  /** Dolby Digital (AC3) */
  AC3 = 'AC3',
  /** Dolby Digital Plus (EAC3) */
  EAC3 = 'EAC3',
  /** Dolby Digital Plus with Atmos (EAC3 Atmos) */
  EAC3_ATMOS = 'EAC3_ATMOS',
  /** MPEG-1 Layer II (MP2) */
  MP2 = 'MP2',
  /** WAV */
  WAV = 'WAV',
  /** Passthrough (no transcoding) */
  PASSTHROUGH = 'PASSTHROUGH',
}

/**
 * AAC profile.
 */
export enum AacProfile {
  /** HEV1 */
  HEV1 = 'HEV1',
  /** HEV2 */
  HEV2 = 'HEV2',
  /** LC (Low Complexity) */
  LC = 'LC',
}

/**
 * AAC coding mode.
 */
export enum AacCodingMode {
  /** Ad receiver mix — receives stereo audio description + control track per ETSI TS 101 154 Annex E. */
  AD_RECEIVER_MIX = 'AD_RECEIVER_MIX',
  /** 1.0 (mono) */
  CODING_MODE_1_0 = 'CODING_MODE_1_0',
  /** 1+1 (dual mono) */
  CODING_MODE_1_1 = 'CODING_MODE_1_1',
  /** 2.0 (stereo) */
  CODING_MODE_2_0 = 'CODING_MODE_2_0',
  /** 5.1 surround */
  CODING_MODE_5_1 = 'CODING_MODE_5_1',
}

/**
 * AAC rate control mode.
 */
export enum AacRateControlMode {
  /** Constant bitrate */
  CBR = 'CBR',
  /** Variable bitrate */
  VBR = 'VBR',
}

/**
 * AAC raw format.
 */
export enum AacRawFormat {
  /** LATM/LOAS */
  LATM_LOAS = 'LATM_LOAS',
  /** None */
  NONE = 'NONE',
}

/**
 * AAC specification.
 */
export enum AacSpec {
  /** MPEG-2 AAC */
  MPEG2 = 'MPEG2',
  /** MPEG-4 AAC */
  MPEG4 = 'MPEG4',
}

/**
 * AAC input type.
 */
export enum AacInputType {
  /** Broadcaster mixed AD */
  BROADCASTER_MIXED_AD = 'BROADCASTER_MIXED_AD',
  /** Normal */
  NORMAL = 'NORMAL',
}

/**
 * AAC VBR quality level.
 */
export enum AacVbrQuality {
  /** High */
  HIGH = 'HIGH',
  /** Low */
  LOW = 'LOW',
  /** Medium high */
  MEDIUM_HIGH = 'MEDIUM_HIGH',
  /** Medium low */
  MEDIUM_LOW = 'MEDIUM_LOW',
}

// =============================================================================
// AC3 enums
// =============================================================================

/**
 * AC3 attenuation control.
 */
export enum Ac3AttenuationControl {
  /** Apply 3 dB attenuation to surround channels */
  ATTENUATE_3_DB = 'ATTENUATE_3_DB',
  /** No attenuation */
  NONE = 'NONE',
}

/**
 * AC3 bitstream mode.
 */
export enum Ac3BitstreamMode {
  /** Commentary */
  COMMENTARY = 'COMMENTARY',
  /** Complete main */
  COMPLETE_MAIN = 'COMPLETE_MAIN',
  /** Dialogue */
  DIALOGUE = 'DIALOGUE',
  /** Emergency */
  EMERGENCY = 'EMERGENCY',
  /** Hearing impaired */
  HEARING_IMPAIRED = 'HEARING_IMPAIRED',
  /** Music and effects */
  MUSIC_AND_EFFECTS = 'MUSIC_AND_EFFECTS',
  /** Visually impaired */
  VISUALLY_IMPAIRED = 'VISUALLY_IMPAIRED',
  /** Voice over */
  VOICE_OVER = 'VOICE_OVER',
}

/**
 * AC3 coding mode.
 */
export enum Ac3CodingMode {
  /** 1.0 (mono) */
  CODING_MODE_1_0 = 'CODING_MODE_1_0',
  /** 1+1 (dual mono) */
  CODING_MODE_1_1 = 'CODING_MODE_1_1',
  /** 2.0 (stereo) */
  CODING_MODE_2_0 = 'CODING_MODE_2_0',
  /** 3/2 (5.0 surround) */
  CODING_MODE_3_2_LFE = 'CODING_MODE_3_2_LFE',
}

/**
 * AC3 DRC profile.
 */
export enum Ac3DrcProfile {
  /** Film standard */
  FILM_STANDARD = 'FILM_STANDARD',
  /** None */
  NONE = 'NONE',
}

/**
 * AC3 LFE filter.
 */
export enum Ac3LfeFilter {
  /** Disabled */
  DISABLED = 'DISABLED',
  /** Enabled */
  ENABLED = 'ENABLED',
}

/**
 * AC3 metadata control.
 */
export enum Ac3MetadataControl {
  /** Follow input */
  FOLLOW_INPUT = 'FOLLOW_INPUT',
  /** Use configured */
  USE_CONFIGURED = 'USE_CONFIGURED',
}

// =============================================================================
// EAC3 enums
// =============================================================================

/**
 * EAC3 attenuation control.
 */
export enum Eac3AttenuationControl {
  /** Apply 3 dB attenuation to surround channels */
  ATTENUATE_3_DB = 'ATTENUATE_3_DB',
  /** No attenuation */
  NONE = 'NONE',
}

/**
 * EAC3 bitstream mode.
 */
export enum Eac3BitstreamMode {
  /** Commentary */
  COMMENTARY = 'COMMENTARY',
  /** Complete main */
  COMPLETE_MAIN = 'COMPLETE_MAIN',
  /** Emergency */
  EMERGENCY = 'EMERGENCY',
  /** Hearing impaired */
  HEARING_IMPAIRED = 'HEARING_IMPAIRED',
  /** Visually impaired */
  VISUALLY_IMPAIRED = 'VISUALLY_IMPAIRED',
}

/**
 * EAC3 coding mode.
 */
export enum Eac3CodingMode {
  /** 1.0 (mono) */
  CODING_MODE_1_0 = 'CODING_MODE_1_0',
  /** 2.0 (stereo) */
  CODING_MODE_2_0 = 'CODING_MODE_2_0',
  /** 3/2 (5.0 surround) */
  CODING_MODE_3_2 = 'CODING_MODE_3_2',
}

/**
 * EAC3 DC filter.
 */
export enum Eac3DcFilter {
  /** Disabled */
  DISABLED = 'DISABLED',
  /** Enabled */
  ENABLED = 'ENABLED',
}

/**
 * EAC3 DRC line mode profile.
 */
export enum Eac3DrcLine {
  /** Film light */
  FILM_LIGHT = 'FILM_LIGHT',
  /** Film standard */
  FILM_STANDARD = 'FILM_STANDARD',
  /** Music light */
  MUSIC_LIGHT = 'MUSIC_LIGHT',
  /** Music standard */
  MUSIC_STANDARD = 'MUSIC_STANDARD',
  /** None */
  NONE = 'NONE',
  /** Speech */
  SPEECH = 'SPEECH',
}

/**
 * EAC3 DRC RF mode profile.
 */
export enum Eac3DrcRf {
  /** Film light */
  FILM_LIGHT = 'FILM_LIGHT',
  /** Film standard */
  FILM_STANDARD = 'FILM_STANDARD',
  /** Music light */
  MUSIC_LIGHT = 'MUSIC_LIGHT',
  /** Music standard */
  MUSIC_STANDARD = 'MUSIC_STANDARD',
  /** None */
  NONE = 'NONE',
  /** Speech */
  SPEECH = 'SPEECH',
}

/**
 * EAC3 LFE control.
 */
export enum Eac3LfeControl {
  /** LFE */
  LFE = 'LFE',
  /** No LFE */
  NO_LFE = 'NO_LFE',
}

/**
 * EAC3 LFE filter.
 */
export enum Eac3LfeFilter {
  /** Disabled */
  DISABLED = 'DISABLED',
  /** Enabled */
  ENABLED = 'ENABLED',
}

/**
 * EAC3 metadata control.
 */
export enum Eac3MetadataControl {
  /** Follow input */
  FOLLOW_INPUT = 'FOLLOW_INPUT',
  /** Use configured */
  USE_CONFIGURED = 'USE_CONFIGURED',
}

/**
 * EAC3 passthrough control.
 */
export enum Eac3PassthroughControl {
  /** No passthrough */
  NO_PASSTHROUGH = 'NO_PASSTHROUGH',
  /** When possible */
  WHEN_POSSIBLE = 'WHEN_POSSIBLE',
}

/**
 * EAC3 phase control.
 */
export enum Eac3PhaseControl {
  /** No shift */
  NO_SHIFT = 'NO_SHIFT',
  /** Shift 90 degrees */
  SHIFT_90_DEGREES = 'SHIFT_90_DEGREES',
}

/**
 * EAC3 stereo downmix preference.
 */
export enum Eac3StereoDownmix {
  /** DPL2 */
  DPL2 = 'DPL2',
  /** Lo/Ro */
  LO_RO = 'LO_RO',
  /** Lt/Rt */
  LT_RT = 'LT_RT',
  /** Not indicated */
  NOT_INDICATED = 'NOT_INDICATED',
}

/**
 * EAC3 surround ex mode.
 */
export enum Eac3SurroundExMode {
  /** Disabled */
  DISABLED = 'DISABLED',
  /** Enabled */
  ENABLED = 'ENABLED',
  /** Not indicated */
  NOT_INDICATED = 'NOT_INDICATED',
}

/**
 * EAC3 surround mode.
 */
export enum Eac3SurroundMode {
  /** Disabled */
  DISABLED = 'DISABLED',
  /** Enabled */
  ENABLED = 'ENABLED',
  /** Not indicated */
  NOT_INDICATED = 'NOT_INDICATED',
}

// =============================================================================
// EAC3 Atmos enums
// =============================================================================

/**
 * EAC3 Atmos coding mode.
 */
export enum Eac3AtmosCodingMode {
  /** 5.1.4 surround */
  CODING_MODE_5_1_4 = 'CODING_MODE_5_1_4',
  /** 7.1.4 surround */
  CODING_MODE_7_1_4 = 'CODING_MODE_7_1_4',
  /** 9.1.6 surround */
  CODING_MODE_9_1_6 = 'CODING_MODE_9_1_6',
}

/**
 * EAC3 Atmos DRC line mode profile.
 */
export enum Eac3AtmosDrcLine {
  /** Film light */
  FILM_LIGHT = 'FILM_LIGHT',
  /** Film standard */
  FILM_STANDARD = 'FILM_STANDARD',
  /** Music light */
  MUSIC_LIGHT = 'MUSIC_LIGHT',
  /** Music standard */
  MUSIC_STANDARD = 'MUSIC_STANDARD',
  /** None */
  NONE = 'NONE',
  /** Speech */
  SPEECH = 'SPEECH',
}

/**
 * EAC3 Atmos DRC RF mode profile.
 */
export enum Eac3AtmosDrcRf {
  /** Film light */
  FILM_LIGHT = 'FILM_LIGHT',
  /** Film standard */
  FILM_STANDARD = 'FILM_STANDARD',
  /** Music light */
  MUSIC_LIGHT = 'MUSIC_LIGHT',
  /** Music standard */
  MUSIC_STANDARD = 'MUSIC_STANDARD',
  /** None */
  NONE = 'NONE',
  /** Speech */
  SPEECH = 'SPEECH',
}

// =============================================================================
// MP2 enums
// =============================================================================

/**
 * MP2 coding mode.
 */
export enum Mp2CodingMode {
  /** 1.0 (mono) */
  CODING_MODE_1_0 = 'CODING_MODE_1_0',
  /** 2.0 (stereo) */
  CODING_MODE_2_0 = 'CODING_MODE_2_0',
}

// =============================================================================
// WAV enums
// =============================================================================

/**
 * WAV coding mode.
 */
export enum WavCodingMode {
  /** 1.0 (mono) */
  CODING_MODE_1_0 = 'CODING_MODE_1_0',
  /** 2.0 (stereo) */
  CODING_MODE_2_0 = 'CODING_MODE_2_0',
  /** 4.0 */
  CODING_MODE_4_0 = 'CODING_MODE_4_0',
  /** 8.0 */
  CODING_MODE_8_0 = 'CODING_MODE_8_0',
}

// =============================================================================
// Props interfaces
// =============================================================================

/**
 * Properties for AAC codec settings.
 */
export interface AacSettingsProps {
  /**
   * The average bitrate.
   * @default Bitrate.kbps(192)
   */
  readonly bitrate?: Bitrate;
  /**
   * The AAC profile.
   * @default AacProfile.LC
   */
  readonly profile?: AacProfile;
  /**
   * The coding mode (mono, stereo, 5.1).
   * @default AacCodingMode.CODING_MODE_2_0
   */
  readonly codingMode?: AacCodingMode;
  /**
   * The rate control mode.
   * @default AacRateControlMode.CBR
   */
  readonly rateControlMode?: AacRateControlMode;
  /**
   * The sample rate.
   * @default AudioSampleRate.HZ_48000
   */
  readonly sampleRate?: AudioSampleRate;
  /**
   * Set to broadcasterMixedAd when the input contains pre-mixed main audio + AD (narration) as a stereo pair.
   * @default AacInputType.NORMAL
   */
  readonly inputType?: AacInputType;
  /**
   * Sets the LATM/LOAS AAC output for raw containers.
   * @default AacRawFormat.NONE
   */
  readonly rawFormat?: AacRawFormat;
  /**
   * Uses MPEG-2 AAC audio instead of MPEG-4 AAC audio for raw or MPEG-2 Transport Stream containers.
   * @default AacSpec.MPEG4
   */
  readonly spec?: AacSpec;
  /**
   * The VBR quality level. Used only if rateControlMode is VBR.
   * @default - service default
   */
  readonly vbrQuality?: AacVbrQuality;
}

/**
 * Properties for AC3 codec settings.
 */
export interface Ac3SettingsProps {
  /**
   * The average bitrate.
   * @default - service default
   */
  readonly bitrate?: Bitrate;
  /**
   * The Dolby Digital coding mode.
   * @default Ac3CodingMode.CODING_MODE_2_0
   */
  readonly codingMode?: Ac3CodingMode;
  /**
   * The dialogue normalization level (1–31).
   * @default - service default
   */
  readonly dialNorm?: number;
  /**
   * Applies a 3 dB attenuation to the surround channels. Used only for the 3/2 coding mode.
   * @default - service default
   */
  readonly attenuationControl?: Ac3AttenuationControl;
  /**
   * Specifies the bitstream mode (bsmod) for the emitted AC-3 stream.
   * @default Ac3BitstreamMode.COMPLETE_MAIN
   */
  readonly bitstreamMode?: Ac3BitstreamMode;
  /**
   * If set to filmStandard, adds dynamic range compression signaling to the output bitstream.
   * @default - service default
   */
  readonly drcProfile?: Ac3DrcProfile;
  /**
   * When set to enabled, applies a 120Hz lowpass filter to the LFE channel prior to encoding.
   * Valid only in codingMode32Lfe mode.
   * @default Ac3LfeFilter.DISABLED
   */
  readonly lfeFilter?: Ac3LfeFilter;
  /**
   * When set to followInput, encoder metadata is sourced from the DD, DD+, or DolbyE decoder that supplies this audio data.
   * @default - service default
   */
  readonly metadataControl?: Ac3MetadataControl;
}

/**
 * Properties for EAC3 codec settings.
 */
export interface Eac3SettingsProps {
  /**
   * The average bitrate.
   * @default - service default
   */
  readonly bitrate?: Bitrate;
  /**
   * The Dolby Digital Plus coding mode.
   * @default Eac3CodingMode.CODING_MODE_3_2
   */
  readonly codingMode?: Eac3CodingMode;
  /**
   * The dialogue normalization level (1–31).
   * @default - service default
   */
  readonly dialNorm?: number;
  /**
   * When set to attenuate3Db, applies a 3 dB attenuation to the surround channels. Used only for the 3/2 coding mode.
   * @default Eac3AttenuationControl.NONE
   */
  readonly attenuationControl?: Eac3AttenuationControl;
  /**
   * Specifies the bitstream mode (bsmod) for the emitted E-AC-3 stream.
   * @default Eac3BitstreamMode.COMPLETE_MAIN
   */
  readonly bitstreamMode?: Eac3BitstreamMode;
  /**
   * When set to enabled, activates a DC highpass filter for all input channels.
   * @default - service default
   */
  readonly dcFilter?: Eac3DcFilter;
  /**
   * Sets the Dolby dynamic range compression profile.
   * @default - service default
   */
  readonly drcLine?: Eac3DrcLine;
  /**
   * Sets the profile for heavy Dolby dynamic range compression, ensuring that the instantaneous signal peaks do not exceed specified levels.
   * @default - service default
   */
  readonly drcRf?: Eac3DrcRf;
  /**
   * When encoding 3/2 audio, setting to lfe enables the LFE channel.
   * @default - service default
   */
  readonly lfeControl?: Eac3LfeControl;
  /**
   * When set to enabled, applies a 120Hz lowpass filter to the LFE channel prior to encoding.
   * Valid only with a codingMode32 coding mode.
   * @default - service default
   */
  readonly lfeFilter?: Eac3LfeFilter;
  /**
   * The Left only/Right only center mix level. Used only for the 3/2 coding mode.
   * @default - service default
   */
  readonly loRoCenterMixLevel?: number;
  /**
   * The Left only/Right only surround mix level. Used only for a 3/2 coding mode.
   * @default - service default
   */
  readonly loRoSurroundMixLevel?: number;
  /**
   * The Left total/Right total center mix level. Used only for a 3/2 coding mode.
   * @default - service default
   */
  readonly ltRtCenterMixLevel?: number;
  /**
   * The Left total/Right total surround mix level. Used only for the 3/2 coding mode.
   * @default - service default
   */
  readonly ltRtSurroundMixLevel?: number;
  /**
   * When set to followInput, encoder metadata is sourced from the DD, DD+, or DolbyE decoder that supplies this audio data.
   * @default - service default
   */
  readonly metadataControl?: Eac3MetadataControl;
  /**
   * When set to whenPossible, input DD+ audio will be passed through if it is present on the input.
   * @default - service default
   */
  readonly passthroughControl?: Eac3PassthroughControl;
  /**
   * When set to shift90Degrees, applies a 90-degree phase shift to the surround channels. Used only for a 3/2 coding mode.
   * @default - service default
   */
  readonly phaseControl?: Eac3PhaseControl;
  /**
   * A stereo downmix preference. Used only for the 3/2 coding mode.
   * @default - service default
   */
  readonly stereoDownmix?: Eac3StereoDownmix;
  /**
   * When encoding 3/2 audio, sets whether an extra center back surround channel is matrix encoded into the left and right surround channels.
   * @default - service default
   */
  readonly surroundExMode?: Eac3SurroundExMode;
  /**
   * When encoding 2/0 audio, sets whether Dolby Surround is matrix-encoded into the two channels.
   * @default - service default
   */
  readonly surroundMode?: Eac3SurroundMode;
}

/**
 * Properties for EAC3 Atmos codec settings.
 */
export interface Eac3AtmosSettingsProps {
  /**
   * The average bitrate.
   * @default - service default
   */
  readonly bitrate?: Bitrate;
  /**
   * The coding mode (e.g. CODING_MODE_5_1_4, CODING_MODE_7_1_4, CODING_MODE_9_1_6).
   * @default Eac3AtmosCodingMode.CODING_MODE_5_1_4
   */
  readonly codingMode?: Eac3AtmosCodingMode;
  /**
   * The dialogue normalization level (1–31).
   * @default - service default
   */
  readonly dialNorm?: number;
  /**
   * Sets the Dolby dynamic range compression line mode profile.
   * @default - service default
   */
  readonly drcLine?: Eac3AtmosDrcLine;
  /**
   * Sets the Dolby dynamic range compression RF mode profile.
   * @default - service default
   */
  readonly drcRf?: Eac3AtmosDrcRf;
  /**
   * Height channel trim level.
   * @default - service default
   */
  readonly heightTrim?: number;
  /**
   * Surround channel trim level.
   * @default - service default
   */
  readonly surroundTrim?: number;
}

/**
 * Properties for MP2 codec settings.
 */
export interface Mp2SettingsProps {
  /**
   * The average bitrate.
   * @default - service default
   */
  readonly bitrate?: Bitrate;
  /**
   * The MPEG2 Audio coding mode.
   * @default Mp2CodingMode.CODING_MODE_2_0
   */
  readonly codingMode?: Mp2CodingMode;
  /**
   * The sample rate.
   * @default AudioSampleRate.HZ_48000
   */
  readonly sampleRate?: AudioSampleRate;
}

/**
 * Properties for WAV codec settings.
 */
export interface WavSettingsProps {
  /**
   * The bit depth of the WAV output.
   * @default AudioBitDepth.DEPTH_16
   */
  readonly bitDepth?: AudioBitDepth;
  /**
   * The audio coding mode for the WAV audio.
   * @default WavCodingMode.CODING_MODE_2_0
   */
  readonly codingMode?: WavCodingMode;
  /**
   * The sample rate.
   * @default AudioSampleRate.HZ_48000
   */
  readonly sampleRate?: AudioSampleRate;
}

// =============================================================================
// Abstract class and implementations
// =============================================================================

/**
 * Audio codec settings. Use the static factory methods to create.
 */
export abstract class AudioCodecSettings {
  /**
   * Create AAC codec settings.
   */
  public static aac(props?: AacSettingsProps): AudioCodecSettings {
    return new AacAudioCodecSettings(props ?? {});
  }

  /**
   * Create AC3 codec settings.
   */
  public static ac3(props?: Ac3SettingsProps): AudioCodecSettings {
    return new Ac3AudioCodecSettings(props ?? {});
  }

  /**
   * Create EAC3 (Dolby Digital Plus) codec settings.
   */
  public static eac3(props?: Eac3SettingsProps): AudioCodecSettings {
    return new Eac3AudioCodecSettings(props ?? {});
  }

  /**
   * Create EAC3 Atmos (Dolby Digital Plus with Atmos) codec settings.
   */
  public static eac3Atmos(props?: Eac3AtmosSettingsProps): AudioCodecSettings {
    return new Eac3AtmosAudioCodecSettings(props ?? {});
  }

  /**
   * Create MP2 codec settings.
   */
  public static mp2(props?: Mp2SettingsProps): AudioCodecSettings {
    return new Mp2AudioCodecSettings(props ?? {});
  }

  /**
   * Create WAV codec settings.
   */
  public static wav(props?: WavSettingsProps): AudioCodecSettings {
    return new WavAudioCodecSettings(props ?? {});
  }

  /**
   * Create passthrough audio settings (no transcoding).
   */
  public static passthrough(): AudioCodecSettings {
    return new PassthroughAudioCodecSettings();
  }

  /** @internal */
  public abstract readonly _codecType: AudioCodecType;
  /** @internal */
  public abstract _bind(): CfnChannel.AudioCodecSettingsProperty;
}

/** @internal */
class AacAudioCodecSettings extends AudioCodecSettings {
  public readonly _codecType = AudioCodecType.AAC;
  constructor(private readonly props: AacSettingsProps) {
    super();
  }

  public _bind(): CfnChannel.AudioCodecSettingsProperty {
    const p = this.props;
    return {
      aacSettings: {
        bitrate: p.bitrate?.toBps() ?? 192000,
        profile: p.profile ?? AacProfile.LC,
        codingMode: p.codingMode ?? AacCodingMode.CODING_MODE_2_0,
        rateControlMode: p.rateControlMode ?? AacRateControlMode.CBR,
        sampleRate: (p.sampleRate ?? AudioSampleRate.HZ_48000)._toHz(),
        rawFormat: p.rawFormat ?? AacRawFormat.NONE,
        spec: p.spec ?? AacSpec.MPEG4,
        inputType: p.inputType ?? AacInputType.NORMAL,
        vbrQuality: p.vbrQuality,
      },
    };
  }
}

/** @internal */
class Ac3AudioCodecSettings extends AudioCodecSettings {
  public readonly _codecType = AudioCodecType.AC3;
  constructor(private readonly props: Ac3SettingsProps) {
    super();
  }

  public _bind(): CfnChannel.AudioCodecSettingsProperty {
    const p = this.props;
    return {
      ac3Settings: {
        bitrate: p.bitrate?.toBps(),
        codingMode: p.codingMode ?? Ac3CodingMode.CODING_MODE_2_0,
        dialnorm: p.dialNorm,
        attenuationControl: p.attenuationControl,
        bitstreamMode: p.bitstreamMode ?? Ac3BitstreamMode.COMPLETE_MAIN,
        drcProfile: p.drcProfile,
        lfeFilter: p.lfeFilter ?? Ac3LfeFilter.DISABLED,
        metadataControl: p.metadataControl,
      },
    };
  }
}

/** @internal */
class Eac3AudioCodecSettings extends AudioCodecSettings {
  public readonly _codecType = AudioCodecType.EAC3;
  constructor(private readonly props: Eac3SettingsProps) {
    super();
  }

  public _bind(): CfnChannel.AudioCodecSettingsProperty {
    const p = this.props;
    return {
      eac3Settings: {
        bitrate: p.bitrate?.toBps(),
        codingMode: p.codingMode ?? Eac3CodingMode.CODING_MODE_3_2,
        dialnorm: p.dialNorm,
        attenuationControl: p.attenuationControl ?? Eac3AttenuationControl.NONE,
        bitstreamMode: p.bitstreamMode ?? Eac3BitstreamMode.COMPLETE_MAIN,
        dcFilter: p.dcFilter,
        drcLine: p.drcLine,
        drcRf: p.drcRf,
        lfeControl: p.lfeControl,
        lfeFilter: p.lfeFilter,
        loRoCenterMixLevel: p.loRoCenterMixLevel,
        loRoSurroundMixLevel: p.loRoSurroundMixLevel,
        ltRtCenterMixLevel: p.ltRtCenterMixLevel,
        ltRtSurroundMixLevel: p.ltRtSurroundMixLevel,
        metadataControl: p.metadataControl,
        passthroughControl: p.passthroughControl,
        phaseControl: p.phaseControl,
        stereoDownmix: p.stereoDownmix,
        surroundExMode: p.surroundExMode,
        surroundMode: p.surroundMode,
      },
    };
  }
}

/** @internal */
class Eac3AtmosAudioCodecSettings extends AudioCodecSettings {
  public readonly _codecType = AudioCodecType.EAC3_ATMOS;
  constructor(private readonly props: Eac3AtmosSettingsProps) {
    super();
  }

  public _bind(): CfnChannel.AudioCodecSettingsProperty {
    const p = this.props;
    return {
      eac3AtmosSettings: {
        bitrate: p.bitrate?.toBps(),
        codingMode: p.codingMode ?? Eac3AtmosCodingMode.CODING_MODE_5_1_4,
        dialnorm: p.dialNorm,
        drcLine: p.drcLine,
        drcRf: p.drcRf,
        heightTrim: p.heightTrim,
        surroundTrim: p.surroundTrim,
      },
    };
  }
}

/** @internal */
class Mp2AudioCodecSettings extends AudioCodecSettings {
  public readonly _codecType = AudioCodecType.MP2;
  constructor(private readonly props: Mp2SettingsProps) {
    super();
  }

  public _bind(): CfnChannel.AudioCodecSettingsProperty {
    const p = this.props;
    return {
      mp2Settings: {
        bitrate: p.bitrate?.toBps(),
        codingMode: p.codingMode ?? Mp2CodingMode.CODING_MODE_2_0,
        sampleRate: (p.sampleRate ?? AudioSampleRate.HZ_48000)._toHz(),
      },
    };
  }
}

/** @internal */
class WavAudioCodecSettings extends AudioCodecSettings {
  public readonly _codecType = AudioCodecType.WAV;
  constructor(private readonly props: WavSettingsProps) {
    super();
  }

  public _bind(): CfnChannel.AudioCodecSettingsProperty {
    const p = this.props;
    return {
      wavSettings: {
        bitDepth: (p.bitDepth ?? AudioBitDepth.DEPTH_16)._toBits(),
        codingMode: p.codingMode ?? WavCodingMode.CODING_MODE_2_0,
        sampleRate: (p.sampleRate ?? AudioSampleRate.HZ_48000)._toHz(),
      },
    };
  }
}

/** @internal */
class PassthroughAudioCodecSettings extends AudioCodecSettings {
  public readonly _codecType = AudioCodecType.PASSTHROUGH;
  public _bind(): CfnChannel.AudioCodecSettingsProperty {
    return {
      passThroughSettings: {},
    };
  }
}
