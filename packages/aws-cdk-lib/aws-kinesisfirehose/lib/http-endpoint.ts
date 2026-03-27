import type { Construct } from 'constructs';
import type { CommonDestinationProps, SecretsManagerProps } from './common';
import { BackupMode } from './common';
import type { DestinationBindOptions, DestinationConfig, IDestination } from './destination';
import * as iam from '../../aws-iam';
import { createBackupConfig, createBufferingHints, createLoggingOptions, createProcessingConfig, createSecretsManagerConfiguration } from './private/helpers';
import * as cdk from '../../core';
import { undefinedIfAllValuesAreEmpty } from '../../core/lib/util';

/**
 * Props for defining an HTTP endpoint destination of an Amazon Data Firehose delivery stream.
 */
export interface HttpEndpointProps extends CommonDestinationProps {
  /**
   * The length of time that Firehose buffers incoming data before delivering
   * it to the S3 bucket.
   *
   * Minimum: Duration.seconds(0)
   * Maximum: Duration.seconds(900)
   *
   * @default Duration.seconds(300)
   */
  readonly bufferingInterval?: cdk.Duration;

  /**
   * The size of the buffer that Amazon Data Firehose uses for incoming data before
   * delivering it to the S3 bucket.
   *
   * Minimum: Size.mebibytes(1) when record data format conversion is disabled, Size.mebibytes(64) when it is enabled
   * Maximum: Size.mebibytes(128)
   *
   * @default Size.mebibytes(5) when record data format conversion is disabled, Size.mebibytes(128) when it is enabled
   */
  readonly bufferingSize?: cdk.Size;

  /**
   * The authentication configuration to access the HTTP endpoint.
   *
   * @default - no authentication
   */
  readonly authentication?: HttpEndpointAuthentication;

  /**
   * The name of the HTTP endpoint selected as the destination.
   *
   * @default - no name
   */
  readonly name?: string;

  /**
   * The URL of the HTTP endpoint selected as the destination.
   */
  readonly url: string;

  /**
   * The metadata sent to the HTTP endpoint destination.
   *
   * @default - no metadata
   */
  readonly parameters?: Record<string, string>;

  /**
   * The content encoding to compress the body of a request before sending the request to the destination.
   * For more information, see Content-Encoding in MDN Web Docs, the official Mozilla documentation.
   *
   * @default - ContentEncoding.NONE
   */
  readonly contentEncoding?: ContentEncoding;

  /**
   * The total amount of time that Data Firehose spends on retries.
   *
   * Minimum: Duration.seconds(0)
   * Maximum: Duration.seconds(7200)
   *
   * @default Duration.seconds(300)
   */
  readonly retryDuration?: cdk.Duration;
}

/**
 * The authentication configuration to access the HTTP endpoint.
 */
export interface HttpEndpointAuthenticationOptions {
  /**
   * The plaintext access key
   * @default - no access key
   */
  readonly accessKey?: string;

  /**
   * The configuration that defines how you access secrets for destinations.
   * @default - no secret
   */
  readonly secretsManager?: SecretsManagerProps;
}

/**
 * The authentication configuration to access the HTTP endpoint.
 * @see https://docs.aws.amazon.com/firehose/latest/dev/create-destination.html#create-destination-http
 */
export abstract class HttpEndpointAuthentication {
  /**
   * Authenticate with an API key or other credentials.
   *
   * The maximum length of the access key is 4096 bytes.
   * @see https://docs.aws.amazon.com/firehose/latest/dev/httpdeliveryrequestresponse.html#requestformat
   *
   * @param accessKey The access key
   */
  public static accessKey(accessKey: string): HttpEndpointAuthentication {
    return new HttpEndpointAccessKeyAuthentication(accessKey);
  }

  /**
   * Authenticate with AWS Secrets Manager.
   *
   * @see https://docs.aws.amazon.com/firehose/latest/dev/using-secrets-manager.html
   *
   * @param secretsManager The secrets manager configuration
   */
  public static secretsManager(secretsManager: SecretsManagerProps): HttpEndpointAuthentication {
    return new HttpEndpointSecretsManagerAuthentication(secretsManager);
  }

  /**
   * Binds this authentication configuration to access the HTTP endpoint.
   */
  abstract bind(scope: Construct): HttpEndpointAuthenticationOptions;
}

class HttpEndpointAccessKeyAuthentication extends HttpEndpointAuthentication {
  constructor(private readonly accessKey: string) { super(); }

  bind(scope: Construct): HttpEndpointAuthenticationOptions {
    if (!cdk.Token.isUnresolved(this.accessKey) && Buffer.from(this.accessKey).byteLength > 4096) {
      throw new cdk.ValidationError('The maximum length of the access key is 4096 bytes.', scope);
    }
    return { accessKey: this.accessKey };
  }
}

class HttpEndpointSecretsManagerAuthentication extends HttpEndpointAuthentication {
  constructor(private readonly secretsManager: SecretsManagerProps) { super(); }

  bind(_scope: Construct): HttpEndpointAuthenticationOptions {
    return { secretsManager: this.secretsManager };
  }
}

/**
 * The content encoding to compress the body of a request before sending the request to the destination.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding
 */
export enum ContentEncoding {
  /** No content-encoding */
  NONE = 'NONE',
  /** gzip */
  GZIP = 'GZIP',
}

/**
 * An HTTP endpoint destination for data from an Amazon Data Firehose delivery stream.
 */
export class HttpEndpoint implements IDestination {
  constructor(private readonly props: HttpEndpointProps) {
  }

  bind(scope: Construct, _options: DestinationBindOptions): DestinationConfig {
    const role = this.props.role ?? new iam.Role(scope, 'HttpEndpointDestinationRole', {
      assumedBy: new iam.ServicePrincipal('firehose.amazonaws.com'),
    });

    const { loggingOptions, dependables: loggingDependables } = createLoggingOptions(scope, {
      loggingConfig: this.props.loggingConfig,
      role,
      streamId: 'HttpEndpointDestination',
    }) ?? {};

    if (this.props.retryDuration && !this.props.retryDuration.isUnresolved() && this.props.retryDuration.toSeconds() > 7200) {
      throw new cdk.ValidationError(`Retry duration must be less than or equal to 7200 seconds, got ${this.props.retryDuration.toSeconds()}.`, scope);
    }

    const s3Backup = { ...this.props.s3Backup, mode: this.props.s3Backup?.mode ?? BackupMode.FAILED };
    const { backupConfig, dependables: backupDependables } = createBackupConfig(scope, role, s3Backup)!;

    const authentication = this.props.authentication?.bind(scope);

    return {
      httpEndpointDestinationConfiguration: {
        bufferingHints: createBufferingHints(scope, this.props.bufferingInterval, this.props.bufferingSize),
        cloudWatchLoggingOptions: loggingOptions,
        endpointConfiguration: {
          accessKey: authentication?.accessKey,
          name: this.props.name,
          url: this.props.url,
        },
        processingConfiguration: createProcessingConfig(scope, this.props, { role }),
        requestConfiguration: undefinedIfAllValuesAreEmpty({
          commonAttributes: this.props.parameters
            && Object.entries(this.props.parameters).map(([key, value]) => ({ attributeName: key, attributeValue: value })),
          contentEncoding: this.props.contentEncoding,
        }),
        retryOptions: undefinedIfAllValuesAreEmpty({
          durationInSeconds: this.props.retryDuration?.toSeconds(),
        }),
        roleArn: role.roleArn,
        s3BackupMode: s3Backup.mode === BackupMode.ALL ? 'AllData' : 'FailedDataOnly',
        s3Configuration: backupConfig,
        secretsManagerConfiguration: createSecretsManagerConfiguration(scope, role, authentication?.secretsManager),
      },
      dependables: [...(loggingDependables ?? []), ...(backupDependables ?? [])],
    };
  }
}
