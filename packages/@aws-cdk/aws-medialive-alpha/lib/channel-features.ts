/**
 * Feature activation state.
 */
export enum FeatureActivationState {
  /** Enable the feature */
  ENABLED = 'ENABLED',
  /** Disable the feature */
  DISABLED = 'DISABLED',
}

/**
 * Feature activations for the channel.
 */
export interface FeatureActivations {
  /**
   * Enable Input Prepare schedule actions.
   * @default FeatureActivationState.DISABLED
   */
  readonly inputPrepareScheduleActions?: FeatureActivationState;
  /**
   * Enable output static image overlay schedule actions.
   * @default FeatureActivationState.DISABLED
   */
  readonly outputStaticImageOverlayScheduleActions?: FeatureActivationState;
}

/**
 * Motion graphics insertion state.
 */
export enum MotionGraphicsInsertion {
  /** Enable motion graphics overlay */
  ENABLED = 'ENABLED',
  /** Disable motion graphics overlay */
  DISABLED = 'DISABLED',
}

/**
 * Motion graphics overlay configuration.
 */
export interface MotionGraphicsConfiguration {
  /**
   * Whether to enable the motion graphics overlay.
   * @default MotionGraphicsInsertion.DISABLED
   */
  readonly motionGraphicsInsertion?: MotionGraphicsInsertion;
}

/**
 * Whether Nielsen PCM to ID3 tagging is enabled.
 */
export enum NielsenPcmToId3TaggingState {
  /** Disabled. */
  DISABLED = 'DISABLED',
  /** Enabled. */
  ENABLED = 'ENABLED',
}

/**
 * Nielsen watermark configuration.
 */
export interface NielsenConfiguration {
  /**
   * The Distributor ID assigned to your organization by Nielsen.
   * @default - no distributor ID
   */
  readonly distributorId?: string;
  /**
   * Whether to enable Nielsen PCM to ID3 tagging.
   * @default - service default
   */
  readonly nielsenPcmToId3Tagging?: NielsenPcmToId3TaggingState;
}

/**
 * Thumbnail state.
 */
export enum ThumbnailState {
  /** Enable thumbnail generation. */
  AUTO = 'AUTO',
  /** Disable thumbnail generation. */
  DISABLED = 'DISABLED',
}

/**
 * Thumbnail configuration for the channel.
 */
export interface ThumbnailConfiguration {
  /**
   * Whether to enable thumbnail generation.
   * @default ThumbnailState.AUTO
   */
  readonly state?: ThumbnailState;
}
