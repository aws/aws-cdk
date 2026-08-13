/** HLS output mode. */
export enum HlsMode {
  /** Live mode — older segments are removed */
  LIVE = 'LIVE',
  /** VOD mode — all segments are kept */
  VOD = 'VOD',
}

/** HLS input loss action. */
export enum HlsInputLossAction {
  /** Emit output with slate/black frames */
  EMIT_OUTPUT = 'EMIT_OUTPUT',
  /** Pause the output */
  PAUSE_OUTPUT = 'PAUSE_OUTPUT',
}

/** HLS client cache control. */
export enum HlsClientCache {
  /** Enable client caching */
  ENABLED = 'ENABLED',
  /** Disable client caching */
  DISABLED = 'DISABLED',
}

/** HLS codec specification. */
export enum HlsCodecSpecification {
  /** RFC 4281 */
  RFC_4281 = 'RFC_4281',
  /** RFC 6381 */
  RFC_6381 = 'RFC_6381',
}

/** HLS directory structure. */
export enum HlsDirectoryStructure {
  /** Single directory */
  SINGLE_DIRECTORY = 'SINGLE_DIRECTORY',
  /** Subdirectory per stream */
  SUBDIRECTORY_PER_STREAM = 'SUBDIRECTORY_PER_STREAM',
}

/** HLS discontinuity tags. */
export enum HlsDiscontinuityTags {
  /** Insert discontinuity tags */
  INSERT = 'INSERT',
  /** Never insert discontinuity tags */
  NEVER_INSERT = 'NEVER_INSERT',
}

/** HLS encryption type. */
export enum HlsEncryptionType {
  /** AES-128 encryption */
  AES128 = 'AES128',
  /** Sample AES encryption */
  SAMPLE_AES = 'SAMPLE_AES',
}

/** HLS ID3 segment tagging state. */
export enum HlsId3SegmentTaggingState {
  /** Disabled */
  DISABLED = 'DISABLED',
  /** Enabled */
  ENABLED = 'ENABLED',
}

/** HLS I-frame only playlists. */
export enum HlsIFrameOnlyPlaylists {
  /** Disabled */
  DISABLED = 'DISABLED',
  /** Standard */
  STANDARD = 'STANDARD',
}

/** HLS incomplete segment behavior. */
export enum HlsIncompleteSegmentBehavior {
  /** Auto */
  AUTO = 'AUTO',
  /** Suppress */
  SUPPRESS = 'SUPPRESS',
}

/** HLS IV in manifest. */
export enum HlsIvInManifest {
  /** Include IV in manifest */
  INCLUDE = 'INCLUDE',
  /** Exclude IV from manifest */
  EXCLUDE = 'EXCLUDE',
}

/** HLS IV source. */
export enum HlsIvSource {
  /** IV follows segment number */
  FOLLOWS_SEGMENT_NUMBER = 'FOLLOWS_SEGMENT_NUMBER',
  /** Explicit IV */
  EXPLICIT = 'EXPLICIT',
}

/** HLS manifest compression. */
export enum HlsManifestCompression {
  /** No compression */
  NONE = 'NONE',
  /** Gzip compression */
  GZIP = 'GZIP',
}

/** HLS manifest duration format. */
export enum HlsManifestDurationFormat {
  /** Floating point */
  FLOATING_POINT = 'FLOATING_POINT',
  /** Integer */
  INTEGER = 'INTEGER',
}

/** HLS output selection. */
export enum HlsOutputSelection {
  /** Manifests and segments */
  MANIFESTS_AND_SEGMENTS = 'MANIFESTS_AND_SEGMENTS',
  /** Segments only */
  SEGMENTS_ONLY = 'SEGMENTS_ONLY',
  /** Variant manifests and segments */
  VARIANT_MANIFESTS_AND_SEGMENTS = 'VARIANT_MANIFESTS_AND_SEGMENTS',
}

/** HLS program date time. */
export enum HlsProgramDateTime {
  /** Include */
  INCLUDE = 'INCLUDE',
  /** Exclude */
  EXCLUDE = 'EXCLUDE',
}

/** HLS program date time clock. */
export enum HlsProgramDateTimeClock {
  /** Initialize from output timecode */
  INITIALIZE_FROM_OUTPUT_TIMECODE = 'INITIALIZE_FROM_OUTPUT_TIMECODE',
  /** System clock */
  SYSTEM_CLOCK = 'SYSTEM_CLOCK',
}

/** HLS redundant manifest. */
export enum HlsRedundantManifest {
  /** Disabled */
  DISABLED = 'DISABLED',
  /** Enabled */
  ENABLED = 'ENABLED',
}

/** HLS segmentation mode. */
export enum HlsSegmentationMode {
  /** Use input segmentation */
  USE_INPUT_SEGMENTATION = 'USE_INPUT_SEGMENTATION',
  /** Use segment duration */
  USE_SEGMENT_DURATION = 'USE_SEGMENT_DURATION',
}

/** HLS stream inf resolution. */
export enum HlsStreamInfResolution {
  /** Include */
  INCLUDE = 'INCLUDE',
  /** Exclude */
  EXCLUDE = 'EXCLUDE',
}

/** HLS caption language setting. */
export enum HlsCaptionLanguageSetting {
  /** Insert */
  INSERT = 'INSERT',
  /** None */
  NONE = 'NONE',
  /** Omit */
  OMIT = 'OMIT',
}

/**
 * Whether MediaPackage sets a MediaPackage V2 audio rendition as default / auto-select in the HLS
 * manifest. Across all renditions: at most one may be `YES`; not all may be `NO`.
 */
export enum MediaPackageV2HlsSetting {
  /** Set this rendition as default / auto-select. */
  YES = 'YES',
  /** Do not set this rendition as default / auto-select. */
  NO = 'NO',
  /** Let MediaPackage decide for this rendition. */
  OMIT = 'OMIT',
}

/** Ad marker type for an HLS output group. */
export enum HlsAdMarkers {
  /** Adobe ad markers. */
  ADOBE = 'ADOBE',
  /** Elemental ad markers. */
  ELEMENTAL = 'ELEMENTAL',
  /** Elemental SCTE-35 ad markers. */
  ELEMENTAL_SCTE35 = 'ELEMENTAL_SCTE35',
}

/** Ad marker type for an RTMP output group. */
export enum RtmpAdMarkers {
  /** onCuePoint SCTE-35 ad markers. */
  ON_CUE_POINT_SCTE35 = 'ON_CUE_POINT_SCTE35',
}

/** HLS timed metadata ID3 frame. */
export enum HlsTimedMetadataId3Frame {
  /** None */
  NONE = 'NONE',
  /** PRIV */
  PRIV = 'PRIV',
  /** TDRL */
  TDRL = 'TDRL',
}

/** Whether to use chunked transfer encoding for an HLS CDN connection (Akamai, WebDAV). */
export enum HttpTransferMode {
  /** Use chunked transfer encoding. */
  CHUNKED = 'CHUNKED',
  /** Do not use chunked transfer encoding. */
  NON_CHUNKED = 'NON_CHUNKED',
}

/** HLS TS file mode. */
export enum HlsTsFileMode {
  /** Segmented files */
  SEGMENTED_FILES = 'SEGMENTED_FILES',
  /** Single file */
  SINGLE_FILE = 'SINGLE_FILE',
}

/** RTMP authentication scheme. */
export enum RtmpAuthenticationScheme {
  /** Common authentication */
  COMMON = 'COMMON',
  /** Akamai authentication */
  AKAMAI = 'AKAMAI',
}

/** RTMP cache full behavior. */
export enum RtmpCacheFullBehavior {
  /** Disconnect immediately */
  DISCONNECT_IMMEDIATELY = 'DISCONNECT_IMMEDIATELY',
  /** Wait for server */
  WAIT_FOR_SERVER = 'WAIT_FOR_SERVER',
}

/** RTMP caption data. */
export enum RtmpCaptionData {
  /** All */
  ALL = 'ALL',
  /** Field 1 and field 2 608 */
  FIELD1_AND_FIELD2_608 = 'FIELD1_AND_FIELD2_608',
  /** Field 1 608 */
  FIELD1_608 = 'FIELD1_608',
}

/** RTMP input loss action. */
export enum RtmpInputLossAction {
  /** Emit output */
  EMIT_OUTPUT = 'EMIT_OUTPUT',
  /** Pause output */
  PAUSE_OUTPUT = 'PAUSE_OUTPUT',
}

/** RTMP include filler NAL units. */
export enum RtmpIncludeFillerNalUnits {
  /** Auto */
  AUTO = 'AUTO',
  /** Drop */
  DROP = 'DROP',
  /** Include */
  INCLUDE = 'INCLUDE',
}

/** RTMP TLS certificate verification mode. */
export enum RtmpCertificateMode {
  /** Verify the TLS certificate chain */
  VERIFY_AUTHENTICITY = 'VERIFY_AUTHENTICITY',
  /** Do not verify the TLS certificate */
  SELF_SIGNED = 'SELF_SIGNED',
}

/**
 * Behavior of last resort when input video is lost and no more backup inputs are available,
 * for an SRT output group.
 */
export enum SrtInputLossAction {
  /** Drop the entire transport stream. */
  DROP_TS = 'DROP_TS',
  /** Drop the program from the transport stream (replaced with null packets to meet bitrate). */
  DROP_PROGRAM = 'DROP_PROGRAM',
  /** Continue emitting with repeat, black, or slate frames substituted for the absent video. */
  EMIT_PROGRAM = 'EMIT_PROGRAM',
}

/** SRT output encryption type. */
export enum SrtEncryptionType {
  /** AES-128 encryption */
  AES128 = 'AES128',
  /** AES-192 encryption */
  AES192 = 'AES192',
  /** AES-256 encryption */
  AES256 = 'AES256',
}

/** UDP input loss action. */
export enum UdpInputLossAction {
  /** Drop the entire transport stream */
  DROP_TS = 'DROP_TS',
  /** Drop the program from the transport stream */
  DROP_PROGRAM = 'DROP_PROGRAM',
  /** Continue emitting with substitute frames */
  EMIT_PROGRAM = 'EMIT_PROGRAM',
}

/** Enables column-only or column-and-row FEC for a UDP output. */
export enum FecMode {
  /** Column-only FEC. */
  COLUMN = 'COLUMN',
  /** Column-and-row FEC (more robust). */
  COLUMN_AND_ROW = 'COLUMN_AND_ROW',
}

/** UDP timed metadata ID3 frame. */
export enum UdpTimedMetadataId3Frame {
  /** None */
  NONE = 'NONE',
  /** PRIV */
  PRIV = 'PRIV',
  /** TDRL */
  TDRL = 'TDRL',
}

/** MS Smooth audio-only timecode control. */
export enum MsSmoothAudioOnlyTimecodeControl {
  /** Passthrough */
  PASSTHROUGH = 'PASSTHROUGH',
  /** Use configured clock */
  USE_CONFIGURED_CLOCK = 'USE_CONFIGURED_CLOCK',
}

/** MS Smooth certificate mode. */
export enum MsSmoothCertificateMode {
  /** Self-signed */
  SELF_SIGNED = 'SELF_SIGNED',
  /** Verify authenticity */
  VERIFY_AUTHENTICITY = 'VERIFY_AUTHENTICITY',
}

/** MS Smooth event ID mode. */
export enum MsSmoothEventIdMode {
  /** No event ID */
  NO_EVENT_ID = 'NO_EVENT_ID',
  /** Use configured */
  USE_CONFIGURED = 'USE_CONFIGURED',
  /** Use timestamp */
  USE_TIMESTAMP = 'USE_TIMESTAMP',
}

/** MS Smooth event stop behavior. */
export enum MsSmoothEventStopBehavior {
  /** None */
  NONE = 'NONE',
  /** Send EOS */
  SEND_EOS = 'SEND_EOS',
}

/** MS Smooth input loss action. */
export enum MsSmoothInputLossAction {
  /** Emit output */
  EMIT_OUTPUT = 'EMIT_OUTPUT',
  /** Pause output */
  PAUSE_OUTPUT = 'PAUSE_OUTPUT',
}

/** MS Smooth segmentation mode. */
export enum MsSmoothSegmentationMode {
  /** Use input segmentation */
  USE_INPUT_SEGMENTATION = 'USE_INPUT_SEGMENTATION',
  /** Use segment duration */
  USE_SEGMENT_DURATION = 'USE_SEGMENT_DURATION',
}

/** MS Smooth sparse track type. */
export enum MsSmoothSparseTrackType {
  /** None */
  NONE = 'NONE',
  /** SCTE-35 */
  SCTE_35 = 'SCTE_35',
  /** SCTE-35 without segmentation */
  SCTE_35_WITHOUT_SEGMENTATION = 'SCTE_35_WITHOUT_SEGMENTATION',
}

/** MS Smooth stream manifest behavior. */
export enum MsSmoothStreamManifestBehavior {
  /** Do not send */
  DO_NOT_SEND = 'DO_NOT_SEND',
  /** Send */
  SEND = 'SEND',
}

/** MS Smooth timestamp offset mode. */
export enum MsSmoothTimestampOffsetMode {
  /** Use configured offset */
  USE_CONFIGURED_OFFSET = 'USE_CONFIGURED_OFFSET',
  /** Use event start date */
  USE_EVENT_START_DATE = 'USE_EVENT_START_DATE',
}

/** CMAF Ingest ID3 behavior. */
export enum Id3Behavior {
  /** No passthrough */
  NO_PASSTHROUGH = 'NO_PASSTHROUGH',
  /** Passthrough */
  PASSTHROUGH = 'PASSTHROUGH',
}

/** CMAF Ingest KLV behavior. */
export enum KlvBehavior {
  /** No passthrough */
  NO_PASSTHROUGH = 'NO_PASSTHROUGH',
  /** Passthrough */
  PASSTHROUGH = 'PASSTHROUGH',
}

/** CMAF Ingest Nielsen ID3 behavior. */
export enum NielsenId3Behavior {
  /** No passthrough */
  NO_PASSTHROUGH = 'NO_PASSTHROUGH',
  /** Passthrough */
  PASSTHROUGH = 'PASSTHROUGH',
}

/** CMAF Ingest SCTE-35 type. */
export enum Scte35Type {
  /** None */
  NONE = 'NONE',
  /** SCTE-35 without segmentation */
  SCTE_35_WITHOUT_SEGMENTATION = 'SCTE_35_WITHOUT_SEGMENTATION',
}

/**
 * Segment length units.
 * @internal
 */
export enum SegmentLengthUnits {
  /** Milliseconds */
  MILLISECONDS = 'MILLISECONDS',
  /** Seconds */
  SECONDS = 'SECONDS',
}

/** CMAF Ingest timed metadata ID3 frame. */
export enum TimedMetadataId3Frame {
  /** None */
  NONE = 'NONE',
  /** PRIV */
  PRIV = 'PRIV',
  /** TDRL */
  TDRL = 'TDRL',
}

/** CMAF Ingest timed metadata passthrough. */
export enum TimedMetadataPassthrough {
  /** Disabled */
  DISABLED = 'DISABLED',
  /** Enabled */
  ENABLED = 'ENABLED',
}

/**
 * S3 canned ACL for output destinations.
 */
export enum S3CannedAcl {
  /** Grants the owner full control and authenticated AWS users read access. */
  AUTHENTICATED_READ = 'AUTHENTICATED_READ',
  /** Grants the object owner and bucket owner full control. */
  BUCKET_OWNER_FULL_CONTROL = 'BUCKET_OWNER_FULL_CONTROL',
  /** Grants the owner full control and the bucket owner read access. */
  BUCKET_OWNER_READ = 'BUCKET_OWNER_READ',
  /** Grants the owner full control and all users read access. */
  PUBLIC_READ = 'PUBLIC_READ',
}

/** H.265 packaging type for HLS/MS Smooth outputs. */
export enum H265PackagingType {
  /** HEV1 packaging */
  HEV1 = 'HEV1',
  /** HVC1 packaging */
  HVC1 = 'HVC1',
}
