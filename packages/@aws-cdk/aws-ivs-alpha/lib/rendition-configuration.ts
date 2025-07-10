import { Resolution } from './util';

/**
 * Rendition selection mode.
 */
export enum RenditionSelection {
  /**
   * Record all available renditions.
   */
  ALL = 'ALL',

  /**
   * Does not record any video. This option is useful if you just want to record thumbnails.
   */
  NONE = 'NONE',

  /**
   * Select a subset of video renditions to record.
   */
  CUSTOM = 'CUSTOM',
}

/**
 * Rendition configuration for IVS Recording configuration
 */
export class RenditionConfiguration {
  /**
   * Record all available renditions.
   */
  public static all(): RenditionConfiguration {
    return new RenditionConfiguration(RenditionSelection.ALL);
  }

  /**
   * Does not record any video.
   */
  public static none(): RenditionConfiguration {
    return new RenditionConfiguration(RenditionSelection.NONE);
  }

  /**
   * Record a subset of video renditions.
   *
   * @param renditions A list of which renditions are recorded for a stream.
   */
  public static custom(renditions: Resolution[]): RenditionConfiguration {
    return new RenditionConfiguration(RenditionSelection.CUSTOM, renditions);
  }

  /**
   * @param renditionSelection The set of renditions are recorded for a stream.
   * @param renditions A list of which renditions are recorded for a stream. If you do not specify this property, no resolution is selected.
   */
  private constructor(public readonly renditionSelection: RenditionSelection, public readonly renditions?: Resolution[]) { }
}
