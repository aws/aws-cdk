import type * as iot from '@aws-cdk/aws-iot-alpha';
import { Duration, Size, UnscopedValidationError } from 'aws-cdk-lib';
import type * as iam from 'aws-cdk-lib/aws-iam';
import type { CommonActionProps } from './common-action-props';
import { singletonActionRole } from './private/role';

export interface HttpActionSigV4Auth {
  /**
   * The service name.
   */
  readonly serviceName: string;
  /**
   * The signing region.
   */
  readonly signingRegion: string;
}

export interface HttpActionHeader {
  /**
   * The HTTP header key.
   */
  readonly key: string;
  /**
   * The HTTP header value. Substitution templates are supported.
   */
  readonly value: string;
}

/**
 * Configuration for batching HTTP action messages.
 *
 * @see https://docs.aws.amazon.com/iot/latest/developerguide/http_batching.html
 */
export interface HttpActionBatchConfig {
  /**
   * The maximum amount of time an outgoing message waits for other messages to create the batch.
   *
   * Must be between 5 ms and 200 ms.
   *
   * @default Duration.millis(20)
   */
  readonly maxBatchOpenDuration?: Duration;

  /**
   * The maximum number of messages that are batched together in a single IoT rule action execution.
   *
   * Must be between 2 and 10.
   *
   * @default 10
   */
  readonly maxBatchSize?: number;

  /**
   * Maximum size of a message batch.
   *
   * Must be between 100 bytes and 128 KiB.
   *
   * @default Size.kibibytes(5)
   */
  readonly maxBatchSizeBytes?: Size;
}

/**
 * Configuration properties of an HTTPS action.
 *
 * @see https://docs.aws.amazon.com/iot/latest/developerguide/https-rule-action.html
 */
export interface HttpsActionProps extends CommonActionProps {
  /**
   * If specified, AWS IoT uses the confirmation URL to create a matching topic rule destination.
   */
  readonly confirmationUrl?: string;

  /**
   * The headers to include in the HTTPS request to the endpoint.
   */
  readonly headers?: Array<HttpActionHeader>;

  /**
   * Use Sigv4 authorization.
   */
  readonly auth?: HttpActionSigV4Auth;

  /**
   * Configuration for batching HTTP action messages.
   *
   * When provided, batching is automatically enabled.
   *
   * @see https://docs.aws.amazon.com/iot/latest/developerguide/http_batching.html
   * @default - Batching is disabled
   */
  readonly batchConfig?: HttpActionBatchConfig;
}

/**
 * The action to send data from an MQTT message to a web application or service.
 */
export class HttpsAction implements iot.IAction {
  private readonly role?: iam.IRole;
  private readonly url: string;
  private readonly confirmationUrl?: string;
  private readonly headers?: Array<HttpActionHeader>;
  private readonly auth?: HttpActionSigV4Auth;
  private readonly batchConfig?: HttpActionBatchConfig;

  /**
   * @param url The url to which to send post request.
   * @param props Optional properties to not use default.
   */
  constructor(url: string, props: HttpsActionProps = {}) {
    this.url = url;
    this.confirmationUrl = props.confirmationUrl;
    this.headers = props.headers;
    this.role = props.role;
    this.auth = props.auth;
    this.batchConfig = props.batchConfig;

    this.validateBatchConfig();
  }

  private validateBatchConfig(): void {
    if (!this.batchConfig) {
      return;
    }

    if (this.batchConfig.maxBatchOpenDuration) {
      const ms = this.batchConfig.maxBatchOpenDuration.toMilliseconds();
      if (ms < Duration.millis(5).toMilliseconds() || ms > Duration.millis(200).toMilliseconds()) {
        throw new UnscopedValidationError(`maxBatchOpenDuration must be between 5 ms and 200 ms, got ${ms} ms`);
      }
    }

    if (this.batchConfig.maxBatchSize) {
      if (this.batchConfig.maxBatchSize < 2 || this.batchConfig.maxBatchSize > 10) {
        throw new UnscopedValidationError(`maxBatchSize must be between 2 and 10, got ${this.batchConfig.maxBatchSize}`);
      }
    }

    if (this.batchConfig.maxBatchSizeBytes) {
      const bytes = this.batchConfig.maxBatchSizeBytes.toBytes();
      if (bytes < Size.bytes(100).toBytes() || bytes > Size.kibibytes(128).toBytes()) {
        throw new UnscopedValidationError(`maxBatchSizeBytes must be between 100 bytes and 128 KiB, got ${bytes} bytes`);
      }
    }
  }

  /**
   * @internal
   */
  public _bind(topicRule: iot.ITopicRule): iot.ActionConfig {
    const role = this.role ?? singletonActionRole(topicRule);
    const sigV4 = this.auth ? {
      sigv4: {
        roleArn: role.roleArn,
        serviceName: this.auth.serviceName,
        signingRegion: this.auth.signingRegion,
      },
    } : this.auth;

    const batchConfig = this.batchConfig ? {
      maxBatchOpenMs: this.batchConfig.maxBatchOpenDuration?.toMilliseconds(),
      maxBatchSize: this.batchConfig.maxBatchSize,
      maxBatchSizeBytes: this.batchConfig.maxBatchSizeBytes?.toBytes(),
    } : undefined;

    return {
      configuration: {
        http: {
          url: this.url,
          confirmationUrl: this.confirmationUrl,
          headers: this.headers,
          auth: sigV4,
          enableBatching: this.batchConfig ? true : false,
          batchConfig,
        },
      },
    };
  }
}
