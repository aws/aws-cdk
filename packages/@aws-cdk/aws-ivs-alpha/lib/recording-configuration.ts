import { CfnRecordingConfiguration } from 'aws-cdk-lib/aws-ivs';
import { IBucketRef } from 'aws-cdk-lib/aws-s3';
import { Duration, Fn, IResource, Resource, Stack, Token } from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import { RenditionConfiguration } from './rendition-configuration';
import { ThumbnailConfiguration } from './thumbnail-configuration';
import { addConstructMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';

/**
 * Properties of the IVS Recording configuration
 */
export interface RecordingConfigurationProps {
  /**
   * S3 bucket where recorded videos will be stored.
   */
  readonly bucket: IBucketRef;

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
   * A rendition configuration describes which renditions should be recorded for a stream.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ivs-recordingconfiguration-renditionconfiguration.html
   *
   * @default - no rendition configuration
   */
  readonly renditionConfiguration?: RenditionConfiguration;

  /**
   * A thumbnail configuration enables/disables the recording of thumbnails for a live session and controls the interval at which thumbnails are generated for the live session.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ivs-recordingconfiguration-thumbnailconfiguration.html
   *
   * @default - no thumbnail configuration
   */
  readonly thumbnailConfiguration?:ThumbnailConfiguration;
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
@propertyInjectable
export class RecordingConfiguration extends Resource implements IRecordingConfiguration {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = '@aws-cdk.aws-ivs-alpha.RecordingConfiguration';

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
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    this.props = props;

    this.validateRecordingConfigurationName();
    this.validateRecordingReconnectWindowSeconds();

    const resource = new CfnRecordingConfiguration(this, 'Resource', {
      destinationConfiguration: {
        s3: {
          bucketName: this.props.bucket.bucketRef.bucketName,
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
    if (!this.props.renditionConfiguration) {
      return;
    }

    return {
      renditions: this.props.renditionConfiguration.renditions,
      renditionSelection: this.props.renditionConfiguration.renditionSelection,
    };
  }

  private _renderThumbnailConfiguration(): CfnRecordingConfiguration.ThumbnailConfigurationProperty | undefined {
    if (!this.props.thumbnailConfiguration) {
      return;
    }

    return {
      recordingMode: this.props.thumbnailConfiguration.recordingMode,
      resolution: this.props.thumbnailConfiguration.resolution,
      storage: this.props.thumbnailConfiguration.storage,
      targetIntervalSeconds: this.props.thumbnailConfiguration.targetInterval?.toSeconds(),
    };
  }

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
  }

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
  }
}
