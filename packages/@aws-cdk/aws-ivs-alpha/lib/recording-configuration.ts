import { CfnRecordingConfiguration } from 'aws-cdk-lib/aws-ivs';
import { IBucket } from 'aws-cdk-lib/aws-s3';
import { Duration, Fn, IResource, Resource, Stack, Token } from 'aws-cdk-lib/core';
import { Construct } from 'constructs';

/**
 * Properties of the IVS Recording configuration
 */
export interface RecordingConfigurationProps {
  /**
   * S3 bucket where recorded videos will be stored.
   */
  readonly bucket: IBucket;

  /**
   * The name of the Recording configuration.
   * The value does not need to be unique.
   *
   * @default - auto generate
   */
  readonly recordingConfigurationName?: string;

  /**
   * If a broadcast disconnects and then reconnects within the specified interval,
   * the multiple streams will be considered a single broadcast and merged together.
   *
   * `recordingReconnectWindow` must be between 0 and 300 seconds
   *
   * @default - 0 seconds (means disabled)
   */
  readonly recordingReconnectWindow?: Duration;

  /**
   * The set of renditions are recorded for a stream.
   * For BASIC channels, the CUSTOM value has no effect.
   * Custom renditions do not apply to BASIC channels.
   *
   * @default RenditionSelection.ALL
   */
  readonly renditionSelection?: RenditionSelection;

  /**
   * A list of which renditions are recorded for a stream.
   * This property must be set when `renditionSelection` is `RenditionSelection.CUSTOM`.

   * @default - no resolution selected
   */
  readonly renditions?: Resolution[];

  /**
   * Thumbnail recording mode.
   *
   * @default ThumbnailRecordingMode.INTERVAL
   */
  readonly thumbnailRecordingMode?: ThumbnailRecordingMode;

  /**
   * The desired resolution of recorded thumbnails for a stream.
   * Thumbnails are recorded at the selected resolution if the corresponding rendition is available during the stream;
   * otherwise, they are recorded at source resolution.
   *
   * @default - Source (same resolution as Input stream)
   * @see https://docs.aws.amazon.com/ivs/latest/LowLatencyUserGuide/record-to-s3.html
   */
  readonly thumbnailResolution?: Resolution;

  /**
   * The format in which thumbnails are recorded for a stream.
   *
   * @default ThumbnailStorage.SEQUENTIAL
   */
  readonly thumbnailStorage?: ThumbnailStorage[];

  /**
   * The targeted thumbnail-generation interval.
   * This is configurable (and required) only if `thumbnailRecordingMode` is `ThumbnailRecordingMode.INTERVAL`.
   *
   * `thumbnailTargetInterval` must be between 1 and 60 seconds
   *
   * @default Duration.seconds(60)
   */
  readonly thumbnailTargetInterval?: Duration;
}

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
 * Resolution for rendition
 */
export enum Resolution {
  /**
   * Full HD (1080p)
   */
  FULL_HD = 'FULL_HD',

  /**
   * HD (720p)
   */
  HD = 'HD',

  /**
   * SD (480p)
   */
  SD = 'SD',

  /**
   * Lowest resolution
   */
  LOWEST_RESOLUTION = 'LOWEST_RESOLUTION',
}

/**
 * Thumbnail recording mode.
 */
export enum ThumbnailRecordingMode {
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
export enum ThumbnailStorage {
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
 * Represents the IVS Recording configuration.
 */
export interface IRecordingConfiguration extends IResource {
  /**
   * The ID of the Recording configuration.
   * @attribute
   */
  readonly recordingConfigurationId: string;

  /**
   * The ARN of the Recording configuration.
   * @attribute
   */
  readonly recordingConfigurationArn: string;
}

/**
 * The IVS Recording configuration
 *
 * @resource AWS::IVS::RecordingConfiguration
 */
export class RecordingConfiguration extends Resource implements IRecordingConfiguration {
  /**
   * Imports an IVS Recording Configuration from attributes.
   */
  public static fromRecordingConfigurationId(scope: Construct, id: string,
    recordingConfigurationId: string): IRecordingConfiguration {

    class Import extends Resource implements IRecordingConfiguration {
      public readonly recordingConfigurationId = recordingConfigurationId;
      public readonly recordingConfigurationArn = Stack.of(this).formatArn({
        resource: 'recording-configuration',
        service: 'ivs',
        resourceName: recordingConfigurationId,
      });
    }

    return new Import(scope, id);
  }

  /**
   * Imports an IVS Recording Configuration from its ARN
   */
  public static fromArn(scope: Construct, id: string, recordingConfigurationArn: string): IRecordingConfiguration {
    const resourceParts = Fn.split('/', recordingConfigurationArn);

    if (!resourceParts || resourceParts.length < 2) {
      throw new Error(`Unexpected ARN format: ${recordingConfigurationArn}`);
    }

    const recordingConfigurationId = Fn.select(1, resourceParts);

    class Import extends Resource implements IRecordingConfiguration {
      public readonly recordingConfigurationId = recordingConfigurationId;
      public readonly recordingConfigurationArn = recordingConfigurationArn;
    }

    return new Import(scope, id);
  }

  /**
   * The ID of the Recording configuration.
   * @attribute
   */
  readonly recordingConfigurationId: string;

  /**
   * The ARN of the Recording configuration.
   * @attribute
   */
  readonly recordingConfigurationArn: string;

  private readonly props: RecordingConfigurationProps;

  public constructor(scope: Construct, id: string, props: RecordingConfigurationProps) {
    super(scope, id, {
      physicalName: props.recordingConfigurationName,
    });

    this.props = props;

    this.validateRecordingConfigurationName();
    this.validateRecordingReconnectWindowSeconds();
    this.validateRenditionSettings();
    this.validateThumbnailSettings();

    const resource = new CfnRecordingConfiguration(this, 'Resource', {
      destinationConfiguration: {
        s3: {
          bucketName: this.props.bucket.bucketName,
        },
      },
      name: this.props.recordingConfigurationName,
      recordingReconnectWindowSeconds: this.props.recordingReconnectWindow?.toSeconds(),
      renditionConfiguration: this._renderRenditionConfiguration(),
      thumbnailConfiguration: this._renderThumbnailConfiguration(),
    });

    this.recordingConfigurationId = resource.ref;
    this.recordingConfigurationArn = resource.attrArn;
  }

  private _renderRenditionConfiguration(): CfnRecordingConfiguration.RenditionConfigurationProperty | undefined {
    if (!this.props.renditions && !this.props.renditionSelection) {
      return;
    }

    return {
      renditions: this.props.renditions,
      renditionSelection: this.props.renditionSelection,
    };
  };

  private _renderThumbnailConfiguration(): CfnRecordingConfiguration.ThumbnailConfigurationProperty | undefined {
    if (!this.props.thumbnailRecordingMode
      && !this.props.thumbnailResolution
      && !this.props.thumbnailStorage
      && !this.props.thumbnailTargetInterval) {
      return;
    }

    return {
      recordingMode: this.props.thumbnailRecordingMode,
      resolution: this.props.thumbnailResolution,
      storage: this.props.thumbnailStorage,
      targetIntervalSeconds: this.props.thumbnailTargetInterval?.toSeconds(),
    };
  };

  private validateRecordingConfigurationName(): undefined {
    const recordingConfigurationName = this.props.recordingConfigurationName;

    if (recordingConfigurationName == undefined || Token.isUnresolved(recordingConfigurationName)) {
      return;
    }

    if (!/^[a-zA-Z0-9-_]*$/.test(recordingConfigurationName)) {
      throw new Error(`\`recordingConfigurationName\` must consist only of alphanumeric characters, hyphens or underbars, got: ${recordingConfigurationName}.`);
    }

    if (recordingConfigurationName.length > 128) {
      throw new Error(`\`recordingConfigurationName\` must be less than or equal to 128 characters, got: ${recordingConfigurationName.length} characters.`);
    }
  };

  private validateRecordingReconnectWindowSeconds(): undefined {
    const recordingReconnectWindow = this.props.recordingReconnectWindow;

    if (recordingReconnectWindow === undefined || Token.isUnresolved(recordingReconnectWindow)) {
      return;
    }

    if (0 < recordingReconnectWindow.toMilliseconds() && recordingReconnectWindow.toMilliseconds() < Duration.seconds(1).toMilliseconds()) {
      throw new Error(`\`recordingReconnectWindow\` must be between 0 and 300 seconds, got ${recordingReconnectWindow.toMilliseconds()} milliseconds.`);
    }

    if (recordingReconnectWindow.toSeconds() > 300) {
      throw new Error(`\`recordingReconnectWindow\` must be between 0 and 300 seconds, got ${recordingReconnectWindow.toSeconds()} seconds.`);
    }
  };

  private validateRenditionSettings(): undefined {
    if (this.props.renditionSelection === RenditionSelection.CUSTOM && !this.props.renditions) {
      throw new Error('`renditions` must be provided when \`renditionSelection\` is `RenditionSelection.CUSTOM`.');
    }

    if (this.props.renditionSelection !== RenditionSelection.CUSTOM && this.props.renditions) {
      throw new Error(`\`renditions\` can only be set when \`renditionSelection\` is \`RenditionSelection.CUSTOM\`, got ${this.props.renditionSelection}.`);
    }
  };

  private validateThumbnailSettings(): undefined {
    const thumbnailRecordingMode = this.props.thumbnailRecordingMode;
    const thumbnailResolution = this.props.thumbnailResolution;
    const thumbnailStorage = this.props.thumbnailStorage;
    const thumbnailTargetInterval = this.props.thumbnailTargetInterval;

    if (Token.isUnresolved(thumbnailTargetInterval)) {
      return;
    }

    if (thumbnailRecordingMode === ThumbnailRecordingMode.INTERVAL && thumbnailTargetInterval !== undefined) {
      if (thumbnailTargetInterval.toMilliseconds() < Duration.seconds(1).toMilliseconds()) {
        throw new Error(`\`thumbnailTargetInterval\` must be between 1 and 60 seconds, got ${thumbnailTargetInterval.toMilliseconds()} milliseconds.`);
      }

      if (thumbnailTargetInterval.toSeconds() > 60) {
        throw new Error(`\`thumbnailTargetInterval\` must be between 1 and 60 seconds, got ${thumbnailTargetInterval.toSeconds()} seconds.`);
      }
    }

    if (thumbnailRecordingMode !== ThumbnailRecordingMode.INTERVAL) {
      if (thumbnailResolution) {
        throw new Error('`thumbnailResolution` can only be set when `thumbnailRecordingMode` is `ThumbnailRecordingMode.INTERVAL`.');
      }

      if (thumbnailStorage !== undefined) {
        throw new Error('`thumbnailStorage` can only be set when `thumbnailRecordingMode` is `ThumbnailRecordingMode.INTERVAL`.');
      }

      if (thumbnailTargetInterval !== undefined) {
        throw new Error('`thumbnailTargetInterval` can only be set when `thumbnailRecordingMode` is `ThumbnailRecordingMode.INTERVAL`.');
      }
    }
  };
}
