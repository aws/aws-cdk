import { Duration, Token } from 'aws-cdk-lib';
import { Resolution } from './util';

/**
 * Thumbnail recording mode.
 */
export enum RecordingMode {
  /**
   * Use INTERVAL to enable the generation of thumbnails for recorded video at a time interval controlled by the TargetIntervalSeconds property.
   */
  INTERVAL = 'INTERVAL',

  /**
   * Use DISABLED to disable the generation of thumbnails for recorded video.
   */
  DISABLED = 'DISABLED',
}

/**
 * The format in which thumbnails are recorded for a stream.
 */
export enum Storage {
  /**
   * SEQUENTIAL records all generated thumbnails in a serial manner, to the media/thumbnails directory.
   */
  SEQUENTIAL = 'SEQUENTIAL',

  /**
   * LATEST saves the latest thumbnail in media/thumbnails/latest/thumb.jpg and overwrites it at the interval specified by thumbnailTargetInterval.
   */
  LATEST = 'LATEST',
}

/**
 * Thumbnail configuration for IVS Recording configuration
 */
export class ThumbnailConfiguration {
  /**
   * Disable the generation of thumbnails for recorded video
   */
  public static disable(): ThumbnailConfiguration {
    return new ThumbnailConfiguration(RecordingMode.DISABLED);
  }

  /**
   * Enable the generation of thumbnails for recorded video at a time interval.
   *
   * @param resolution The desired resolution of recorded thumbnails for a stream. If you do not specify this property, same resolution as Input stream is used.
   * @param storage The format in which thumbnails are recorded for a stream. If you do not specify this property, `ThumbnailStorage.SEQUENTIAL` is set.
   * @param targetInterval The targeted thumbnail-generation interval. If you do not specify this property, `Duration.seconds(60)` is set.
   */
  public static interval(resolution?: Resolution, storage?: Storage[], targetInterval?: Duration): ThumbnailConfiguration {
    return new ThumbnailConfiguration(RecordingMode.INTERVAL, resolution, storage, targetInterval);
  }

  /**
   * @param recordingMode Thumbnail recording mode. If you do not specify this property, `ThumbnailRecordingMode.INTERVAL` is set.
   * @param resolution The desired resolution of recorded thumbnails for a stream. If you do not specify this property, same resolution as Input stream is used.
   * @param storage The format in which thumbnails are recorded for a stream. If you do not specify this property, `ThumbnailStorage.SEQUENTIAL` is set.
   * @param targetInterval The targeted thumbnail-generation interval. Must be between 1 and 60 seconds. If you do not specify this property, `Duration.seconds(60)` is set.
   */
  private constructor(
    public readonly recordingMode?: RecordingMode,
    public readonly resolution?: Resolution,
    public readonly storage?: Storage[],
    public readonly targetInterval?: Duration,
  ) {
    if (targetInterval === undefined || Token.isUnresolved(targetInterval)) {
      return;
    }

    if (targetInterval.toMilliseconds() < Duration.seconds(1).toMilliseconds()) {
      throw new Error(`\`targetInterval\` must be between 1 and 60 seconds, got ${targetInterval.toMilliseconds()} milliseconds.`);
    }

    if (targetInterval.toSeconds() > 60) {
      throw new Error(`\`targetInterval\` must be between 1 and 60 seconds, got ${targetInterval.toSeconds()} seconds.`);
    }
  }
}

