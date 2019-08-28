import { Construct } from '@aws-cdk/core';
import { ContainerDefinition } from '../container-definition';
import { LogDriver, LogDriverConfig } from "./log-driver";

/**
 * Specifies the splunk log driver configuration options.
 */
export interface SplunkLogDriverProps {
  /**
   * Splunk HTTP Event Collector token.
   */
  readonly token: string;

  /**
   * Path to your Splunk Enterprise, self-service Splunk Cloud instance, or Splunk
   * Cloud managed cluster (including port and scheme used by HTTP Event Collector)
   * in one of the following formats: https://your_splunk_instance:8088 or
   * https://input-prd-p-XXXXXXX.cloud.splunk.com:8088 or https://http-inputs-XXXXXXXX.splunkcloud.com.
   */
  readonly url: string;

  /**
   * Event source.
   *
   * @default - source not set.
   */
  readonly source?: string;

  /**
   * Event source type.
   *
   * @default - sourceType not set.
   */
  readonly sourceType?: string;

  /**
   * Event index.
   *
   * @default - index not set.
   */
  readonly index?: string;

  /**
   * Path to root certificate.
   *
   * @default - capath not set.
   */
  readonly capath?: string;

  /**
   * Name to use for validating server certificate; by default the hostname of the splunk-url is used.
   *
   * @default - caname not set.
   */
  readonly caname?: string;

  /**
   * Ignore server certificate validation.
   *
   * @default - insecureskipverify not set.
   */
  readonly insecureskipverify?: string;

  /**
   * Message format. Can be inline, json or raw. Defaults to inline.
   *
   * @default - format not set.
   */
  readonly format?: string;

  /**
   * Verify on start, that docker can connect to Splunk server. Defaults to true.
   *
   * @default - verifyConnection not set.
   */
  readonly verifyConnection?: boolean;

  /**
   * Enable/disable gzip compression to send events to Splunk Enterprise or Splunk
   * Cloud instance. Defaults to false.
   *
   * @default - gzip not set.
   */
  readonly gzip?: boolean;

  /**
   * Set compression level for gzip. Valid values are -1 (default), 0 (no compression),
   * 1 (best speed) ... 9 (best compression). Defaults to DefaultCompression.
   *
   * @default - gzipLevel not set.
   */
  readonly gzipLevel?: number;

  /**
   * Specify tag for message, which interpret some markup. Default value is {{.ID}}
   * (12 characters of the container ID). Refer to the log tag option documentation
   * for customizing the log tag format.
   *
   * @default - tag not set
   */
  readonly tag?: string;

  /**
   * Comma-separated list of keys of labels, which should be included in message, if these
   * labels are specified for container.
   *
   * @default - labels not set
   */
  readonly labels?: string;

  /**
   * Comma-separated list of keys of environment variables, which should be included in
   * message, if these variables are specified for container.
   *
   * @default - env not set
   */
  readonly env?: string;

  /**
   * Similar to and compatible with env. A regular expression to match logging-related
   * environment variables. Used for advanced log tag options.
   *
   * @default - envRegex not set
   */
  readonly envRegex?: string;
}

/**
 * A log driver that sends log information to splunk Logs.
 */
export class SplunkLogDriver extends LogDriver {
  /**
   * Constructs a new instance of the SplunkLogDriver class.
   *
   * @param props the splunk log driver configuration options.
   */
  constructor(private readonly props?: SplunkLogDriverProps) {
    super();
  }

  /**
   * Called when the log driver is configured on a container
   */
  public bind(_scope: Construct, _containerDefinition: ContainerDefinition): LogDriverConfig {
    const options = this.props ? {
      'splunk-token': this.props.token,
      'splunk-url': this.props.url,
      'splunk-source': this.props.source,
      'splunk-sourceType': this.props.sourceType,
      'splunk-index': this.props.index,
      'splunk-capath': this.props.capath,
      'splunk-caname': this.props.caname,
      'splunk-insecureskipverify': this.props.insecureskipverify,
      'splunk-format': this.props.format,
      'splunk-verify-connection': this.props.verifyConnection,
      'splunk-gzip': this.props.gzip,
      'splunk-gzip-level': this.props.gzipLevel,
      'tag': this.props.tag,
      'labels': this.props.labels,
      'env': this.props.env,
      'env-regex': this.props.envRegex
    } : {};

    return {
      logDriver: 'splunk',
      options: removeEmpty(options),
    };
  }
}

/**
 * Remove undefined values from a dictionary
 */
function removeEmpty<T>(x: { [key: string]: (T | undefined | string) }): { [key: string]: string } {
  for (const key of Object.keys(x)) {
    if (!x[key]) {
      delete x[key];
    } else {
      x[key] = x[key] + '';
    }
  }
  return x as any;
}
