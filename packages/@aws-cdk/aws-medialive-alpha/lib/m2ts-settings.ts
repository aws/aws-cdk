import type { Bitrate, Duration } from 'aws-cdk-lib';
import type { CfnChannel } from 'aws-cdk-lib/aws-medialive';

/** The output bitrate mode of the transport stream. */
export enum M2tsRateMode {
  /** Constant bitrate — inserts null packets to fill the configured bitrate. */
  CBR = 'CBR',
  /** Variable bitrate — the configured bitrate acts as the maximum. */
  VBR = 'VBR',
}

/** The buffer model used for the transport stream. */
export enum M2tsBufferModel {
  /** Uses the multiplex buffer model for accurate interleaving. */
  MULTIPLEX = 'MULTIPLEX',
  /** Can lead to lower latency, but low-memory devices might not be able to play back the stream without interruptions. */
  NONE = 'NONE',
}

/** The buffer model used for Dolby Digital audio. */
export enum M2tsAudioBufferModel {
  /** ATSC buffer model. */
  ATSC = 'ATSC',
  /** DVB buffer model. */
  DVB = 'DVB',
}

/** The stream type used for audio elementary streams. */
export enum M2tsAudioStreamType {
  /** ATSC — stream type 0x81 for AC3, 0x87 for EAC3. */
  ATSC = 'ATSC',
  /** DVB — stream type 0x06. */
  DVB = 'DVB',
}

/** Controls insertion of the Program Clock Reference (PCR). */
export enum M2tsPcrControl {
  /** Insert PCR at the configured `pcrPeriod`. */
  CONFIGURED_PCR_PERIOD = 'CONFIGURED_PCR_PERIOD',
  /** Insert a PCR for every Packetized Elementary Stream (PES) header. */
  PCR_EVERY_PES_PACKET = 'PCR_EVERY_PES_PACKET',
}

/** Whether to include the ES Rate field in the PES header. */
export enum M2tsEsRateInPes {
  /** Exclude the ES Rate field. */
  EXCLUDE = 'EXCLUDE',
  /** Include the ES Rate field. */
  INCLUDE = 'INCLUDE',
}

/** ARIB-compliant field muxing. */
export enum M2tsArib {
  /** Disabled. */
  DISABLED = 'DISABLED',
  /** Enabled — uses ARIB-compliant field muxing and removes the video descriptor. */
  ENABLED = 'ENABLED',
}

/** How the ARIB Captions PID is selected. */
export enum M2tsAribCaptionsPidControl {
  /** Auto-select the PID from unused PIDs. */
  AUTO = 'AUTO',
  /** Use the configured `aribCaptionsPid`. */
  USE_CONFIGURED = 'USE_CONFIGURED',
}

/** KLV data passthrough behavior. */
export enum M2tsKlv {
  /** Do not pass KLV data through. */
  NONE = 'NONE',
  /** Pass KLV data from the input through to the output. */
  PASSTHROUGH = 'PASSTHROUGH',
}

/** EBIF data passthrough behavior. */
export enum M2tsEbif {
  /** Do not pass EBIF data through. */
  NONE = 'NONE',
  /** Pass EBIF data from the input through to the output. */
  PASSTHROUGH = 'PASSTHROUGH',
}

/** Nielsen ID3 passthrough behavior. */
export enum M2tsNielsenId3Behavior {
  /** Do not insert Nielsen ID3 tags. */
  NO_PASSTHROUGH = 'NO_PASSTHROUGH',
  /** Nielsen inaudible tones for media tracking will be detected in the input audio and an equivalent ID3 tag will be inserted in the output. */
  PASSTHROUGH = 'PASSTHROUGH',
}

/** Whether to generate the captionServiceDescriptor in the PMT. */
export enum M2tsCcDescriptor {
  /** Disabled. */
  DISABLED = 'DISABLED',
  /** Enabled. */
  ENABLED = 'ENABLED',
}

/** Behavior when the selected input audio stream is removed from the input. */
export enum M2tsAbsentInputAudioBehavior {
  /** Remove the output audio streams from the program. */
  DROP = 'DROP',
  /** Output encoded silence when not connected to an active input stream. */
  ENCODE_SILENCE = 'ENCODE_SILENCE',
}

/** Controls placement of audio Encoder Boundary Point (EBP) markers. */
export enum M2tsEbpAudioInterval {
  /** Add audio EBP markers to partitions 3 and 4 at a fixed interval. */
  VIDEO_AND_FIXED_INTERVALS = 'VIDEO_AND_FIXED_INTERVALS',
  /** Follow the video EBP interval. */
  VIDEO_INTERVAL = 'VIDEO_INTERVAL',
}

/** Controls placement of EBP markers on audio PIDs. */
export enum M2tsEbpPlacement {
  /** Place EBP markers on the video PID and all audio PIDs. */
  VIDEO_AND_AUDIO_PIDS = 'VIDEO_AND_AUDIO_PIDS',
  /** Place EBP markers only on the video PID. */
  VIDEO_PID = 'VIDEO_PID',
}

/** SCTE-35 passthrough behavior. */
export enum M2tsScte35Control {
  /** Do not pass SCTE-35 signals through. */
  NONE = 'NONE',
  /** Pass SCTE-35 signals from the input through to the output. */
  PASSTHROUGH = 'PASSTHROUGH',
}

/** The type of segmentation markers to insert. */
export enum M2tsSegmentationMarkers {
  /** No segmentation markers. */
  NONE = 'NONE',
  /** Set the Random Access Indicator (RAI) bit in the adaptation field. */
  RAI_SEGSTART = 'RAI_SEGSTART',
  /** Set the RAI bit and add the current timecode in the private data bytes. */
  RAI_ADAPT = 'RAI_ADAPT',
  /** Insert PAT and PMT tables at the start of segments. */
  PSI_SEGSTART = 'PSI_SEGSTART',
  /** Add Encoder Boundary Point information (OC-SP-EBP-I01-130118). */
  EBP = 'EBP',
  /** Add Encoder Boundary Point information using the legacy proprietary format. */
  EBP_LEGACY = 'EBP_LEGACY',
}

/** How segmentation markers respond to avails truncating a segment. */
export enum M2tsSegmentationStyle {
  /** Do not reset the segmentation cadence after a truncated segment. */
  MAINTAIN_CADENCE = 'MAINTAIN_CADENCE',
  /** Reset the segmentation cadence after a truncated segment. */
  RESET_CADENCE = 'RESET_CADENCE',
}

/** Timed metadata passthrough behavior. */
export enum M2tsTimedMetadataBehavior {
  /** Do not pass timed metadata through. */
  NO_PASSTHROUGH = 'NO_PASSTHROUGH',
  /** Pass timed metadata from the input through to the output. */
  PASSTHROUGH = 'PASSTHROUGH',
}

/** How DVB Service Description Table (SDT) information is inserted. */
export enum DvbSdtOutputMode {
  /** Copy SDT information from the input stream to the output stream. */
  SDT_FOLLOW = 'SDT_FOLLOW',
  /** Copy SDT from the input if present, otherwise use the configured values. */
  SDT_FOLLOW_IF_PRESENT = 'SDT_FOLLOW_IF_PRESENT',
  /** Use the user-defined SDT information. */
  SDT_MANUAL = 'SDT_MANUAL',
  /** Do not include SDT information in the output. */
  SDT_NONE = 'SDT_NONE',
}

/** Settings for inserting a DVB Network Information Table (NIT). */
export interface DvbNitSettings {
  /**
   * The numeric value placed in the Network Information Table (NIT).
   * @default - no network ID
   */
  readonly networkId?: number;
  /**
   * The network name placed in the networkNameDescriptor inside the NIT (max 256 characters).
   * @default - no network name
   */
  readonly networkName?: string;
  /**
   * The interval between instances of this table in the output transport stream.
   * @default - service default
   */
  readonly repInterval?: Duration;
}

/** Settings for inserting a DVB Service Description Table (SDT). */
export interface DvbSdtSettings {
  /**
   * The method of inserting SDT information into the output stream.
   * @default - service default
   */
  readonly outputSdt?: DvbSdtOutputMode;
  /**
   * The interval between instances of this table in the output transport stream.
   * @default - service default
   */
  readonly repInterval?: Duration;
  /**
   * The service name placed in the serviceDescriptor in the SDT (max 256 characters).
   * @default - no service name
   */
  readonly serviceName?: string;
  /**
   * The service provider name placed in the serviceDescriptor in the SDT (max 256 characters).
   * @default - no service provider name
   */
  readonly serviceProviderName?: string;
}

/** Settings for inserting a DVB Time and Date Table (TDT). */
export interface DvbTdtSettings {
  /**
   * The interval between instances of this table in the output transport stream.
   * @default - service default
   */
  readonly repInterval?: Duration;
}

/**
 * Properties for MPEG-2 transport stream (M2TS) container settings.
 *
 * Used by the UDP, Archive, SRT, and MediaConnect Router output groups. All properties are
 * optional; omit them to use MediaLive's service defaults.
 *
 * PID properties accept a decimal or hexadecimal value (and, where noted, ranges or comma-separated
 * lists). Each PID must be in the range 32 (0x20)..8182 (0x1ff6).
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-m2tssettings.html
 */
export interface M2tsSettingsProps {
  /** Behavior when the selected input audio stream is removed. @default - service default */
  readonly absentInputAudioBehavior?: M2tsAbsentInputAudioBehavior;
  /** ARIB-compliant field muxing. @default - service default */
  readonly arib?: M2tsArib;
  /** The PID for ARIB Captions. @default - service default */
  readonly aribCaptionsPid?: string;
  /** How the ARIB Captions PID is selected. @default - service default */
  readonly aribCaptionsPidControl?: M2tsAribCaptionsPidControl;
  /** The buffer model for Dolby Digital audio. @default - service default */
  readonly audioBufferModel?: M2tsAudioBufferModel;
  /** The number of audio frames to insert per PES packet. @default - service default */
  readonly audioFramesPerPes?: number;
  /** The PID(s) of the elementary audio streams (ranges/comma-separated allowed). @default - service default */
  readonly audioPids?: string;
  /** The stream type used for audio elementary streams. @default - service default */
  readonly audioStreamType?: M2tsAudioStreamType;
  /** The output bitrate of the transport stream. Set to 0 bps to let the muxer choose. @default - muxer chooses */
  readonly bitrate?: Bitrate;
  /** The transport stream buffer model. @default - service default */
  readonly bufferModel?: M2tsBufferModel;
  /** Whether to generate the captionServiceDescriptor in the PMT. @default - service default */
  readonly ccDescriptor?: M2tsCcDescriptor;
  /** DVB Network Information Table (NIT) settings. @default - no NIT */
  readonly dvbNitSettings?: DvbNitSettings;
  /** DVB Service Description Table (SDT) settings. @default - no SDT */
  readonly dvbSdtSettings?: DvbSdtSettings;
  /** The PID(s) for input source DVB Subtitle data (ranges/comma-separated allowed). @default - service default */
  readonly dvbSubPids?: string;
  /** DVB Time and Date Table (TDT) settings. @default - no TDT */
  readonly dvbTdtSettings?: DvbTdtSettings;
  /** The PID for input source DVB Teletext data. @default - service default */
  readonly dvbTeletextPid?: string;
  /** EBIF data passthrough behavior. @default - service default */
  readonly ebif?: M2tsEbif;
  /** Placement of audio EBP markers. @default - service default */
  readonly ebpAudioInterval?: M2tsEbpAudioInterval;
  /** The EBP lookahead interval. @default - service default */
  readonly ebpLookahead?: Duration;
  /** Placement of EBP markers on audio PIDs. @default - service default */
  readonly ebpPlacement?: M2tsEbpPlacement;
  /** Whether to include the ES Rate field in the PES header. @default - service default */
  readonly esRateInPes?: M2tsEsRateInPes;
  /** The PID for input source ETV Platform data. @default - service default */
  readonly etvPlatformPid?: string;
  /** The PID for input source ETV Signal data. @default - service default */
  readonly etvSignalPid?: string;
  /** The length of each fragment (used only with EBP markers). @default - service default */
  readonly fragmentTime?: Duration;
  /** KLV data passthrough behavior. @default - service default */
  readonly klv?: M2tsKlv;
  /** The PID(s) for input source KLV data (ranges/comma-separated allowed). @default - service default */
  readonly klvDataPids?: string;
  /** Nielsen ID3 passthrough behavior. @default - service default */
  readonly nielsenId3Behavior?: M2tsNielsenId3Behavior;
  /** The bitrate of extra null packets to insert into the transport stream. @default - no null packets */
  readonly nullPacketBitrate?: Bitrate;
  /** The interval between PAT instances (0, or 10ms..1000ms). @default - service default */
  readonly patInterval?: Duration;
  /** Controls insertion of the Program Clock Reference (PCR). @default - service default */
  readonly pcrControl?: M2tsPcrControl;
  /** The maximum interval between Program Clock References (PCRs). @default - service default */
  readonly pcrPeriod?: Duration;
  /** The PID of the Program Clock Reference. @default - same as the video PID */
  readonly pcrPid?: string;
  /** The interval between PMT instances (0, or 10ms..1000ms). @default - service default */
  readonly pmtInterval?: Duration;
  /** The PID for the Program Map Table (PMT). @default - service default */
  readonly pmtPid?: string;
  /** The value of the program number field in the PMT. @default - service default */
  readonly programNum?: number;
  /** The transport stream bitrate mode (CBR/VBR). @default - service default */
  readonly rateMode?: M2tsRateMode;
  /** The PID(s) for input source SCTE-27 data (ranges/comma-separated allowed). @default - service default */
  readonly scte27Pids?: string;
  /** SCTE-35 passthrough behavior. @default - service default */
  readonly scte35Control?: M2tsScte35Control;
  /** The PID of the SCTE-35 stream. @default - service default */
  readonly scte35Pid?: string;
  /** The SCTE-35 preroll pullup interval. @default - service default */
  readonly scte35PrerollPullup?: Duration;
  /** The type of segmentation markers to insert. @default - service default */
  readonly segmentationMarkers?: M2tsSegmentationMarkers;
  /** How segmentation markers respond to avails. @default - service default */
  readonly segmentationStyle?: M2tsSegmentationStyle;
  /** The length of each segment (required unless `segmentationMarkers` is NONE). @default - service default */
  readonly segmentationTime?: Duration;
  /** Timed metadata passthrough behavior. @default - service default */
  readonly timedMetadataBehavior?: M2tsTimedMetadataBehavior;
  /** The PID of the timed metadata stream. @default - service default */
  readonly timedMetadataPid?: string;
  /** The value of the transport stream ID field in the PMT. @default - service default */
  readonly transportStreamId?: number;
  /** The PID of the elementary video stream. @default - service default */
  readonly videoPid?: string;
}

/**
 * MPEG-2 transport stream (M2TS) container settings for an MPEG-TS output.
 *
 * Use `M2tsSettings.of()` to configure the transport stream produced by a UDP, Archive, SRT, or
 * MediaConnect Router output. Omitting it entirely uses MediaLive's service defaults.
 */
export class M2tsSettings {
  /** Create M2TS container settings. */
  public static of(props: M2tsSettingsProps): M2tsSettings {
    return new M2tsSettings(props);
  }

  private constructor(private readonly props: M2tsSettingsProps) {}

  /** @internal */
  public _bind(): CfnChannel.M2tsSettingsProperty {
    const p = this.props;
    return {
      absentInputAudioBehavior: p.absentInputAudioBehavior,
      arib: p.arib,
      aribCaptionsPid: p.aribCaptionsPid,
      aribCaptionsPidControl: p.aribCaptionsPidControl,
      audioBufferModel: p.audioBufferModel,
      audioFramesPerPes: p.audioFramesPerPes,
      audioPids: p.audioPids,
      audioStreamType: p.audioStreamType,
      bitrate: p.bitrate?.toBps(),
      bufferModel: p.bufferModel,
      ccDescriptor: p.ccDescriptor,
      dvbNitSettings: p.dvbNitSettings ? {
        networkId: p.dvbNitSettings.networkId,
        networkName: p.dvbNitSettings.networkName,
        repInterval: p.dvbNitSettings.repInterval?.toMilliseconds(),
      } : undefined,
      dvbSdtSettings: p.dvbSdtSettings ? {
        outputSdt: p.dvbSdtSettings.outputSdt,
        repInterval: p.dvbSdtSettings.repInterval?.toMilliseconds(),
        serviceName: p.dvbSdtSettings.serviceName,
        serviceProviderName: p.dvbSdtSettings.serviceProviderName,
      } : undefined,
      dvbSubPids: p.dvbSubPids,
      dvbTdtSettings: p.dvbTdtSettings ? {
        repInterval: p.dvbTdtSettings.repInterval?.toMilliseconds(),
      } : undefined,
      dvbTeletextPid: p.dvbTeletextPid,
      ebif: p.ebif,
      ebpAudioInterval: p.ebpAudioInterval,
      ebpLookaheadMs: p.ebpLookahead?.toMilliseconds(),
      ebpPlacement: p.ebpPlacement,
      esRateInPes: p.esRateInPes,
      etvPlatformPid: p.etvPlatformPid,
      etvSignalPid: p.etvSignalPid,
      fragmentTime: p.fragmentTime?.toSeconds(),
      klv: p.klv,
      klvDataPids: p.klvDataPids,
      nielsenId3Behavior: p.nielsenId3Behavior,
      nullPacketBitrate: p.nullPacketBitrate?.toBps(),
      patInterval: p.patInterval?.toMilliseconds(),
      pcrControl: p.pcrControl,
      pcrPeriod: p.pcrPeriod?.toMilliseconds(),
      pcrPid: p.pcrPid,
      pmtInterval: p.pmtInterval?.toMilliseconds(),
      pmtPid: p.pmtPid,
      programNum: p.programNum,
      rateMode: p.rateMode,
      scte27Pids: p.scte27Pids,
      scte35Control: p.scte35Control,
      scte35Pid: p.scte35Pid,
      scte35PrerollPullupMilliseconds: p.scte35PrerollPullup?.toMilliseconds(),
      segmentationMarkers: p.segmentationMarkers,
      segmentationStyle: p.segmentationStyle,
      segmentationTime: p.segmentationTime?.toSeconds(),
      timedMetadataBehavior: p.timedMetadataBehavior,
      timedMetadataPid: p.timedMetadataPid,
      transportStreamId: p.transportStreamId,
      videoPid: p.videoPid,
    };
  }
}
