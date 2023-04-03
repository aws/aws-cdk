import { SecretValue } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { BaseLogDriverProps } from './base-log-driver';
import { LogDriver, LogDriverConfig } from './log-driver';
import { ContainerDefinition, Secret } from '../container-definition';
/**
 * Log Message Format
 */
export declare enum SplunkLogFormat {
    INLINE = "inline",
    JSON = "json",
    RAW = "raw"
}
/**
 * Specifies the splunk log driver configuration options.
 *
 * [Source](https://docs.docker.com/config/containers/logging/splunk/)
 */
export interface SplunkLogDriverProps extends BaseLogDriverProps {
    /**
     * Splunk HTTP Event Collector token.
     *
     * The splunk-token is added to the Options property of the Log Driver Configuration. So the secret value will be resolved and
     * viewable in plain text in the console.
     *
     * Please provide at least one of `token` or `secretToken`.
     * @deprecated Use `SplunkLogDriverProps.secretToken` instead.
     * @default - token not provided.
     */
    readonly token?: SecretValue;
    /**
     * Splunk HTTP Event Collector token (Secret).
     *
     * The splunk-token is added to the SecretOptions property of the Log Driver Configuration. So the secret value will not be
     * resolved or viewable as plain text.
     */
    readonly secretToken: Secret;
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
     * @default - caPath not set.
     */
    readonly caPath?: string;
    /**
     * Name to use for validating server certificate.
     *
     * @default - The hostname of the splunk-url
     */
    readonly caName?: string;
    /**
     * Ignore server certificate validation.
     *
     * @default - insecureSkipVerify not set.
     */
    readonly insecureSkipVerify?: string;
    /**
     * Message format. Can be inline, json or raw.
     *
     * @default - inline
     */
    readonly format?: SplunkLogFormat;
    /**
     * Verify on start, that docker can connect to Splunk server.
     *
     * @default - true
     */
    readonly verifyConnection?: boolean;
    /**
     * Enable/disable gzip compression to send events to Splunk Enterprise or Splunk
     * Cloud instance.
     *
     * @default - false
     */
    readonly gzip?: boolean;
    /**
     * Set compression level for gzip. Valid values are -1 (default), 0 (no compression),
     * 1 (best speed) ... 9 (best compression).
     *
     * @default - -1 (Default Compression)
     */
    readonly gzipLevel?: number;
}
/**
 * A log driver that sends log information to splunk Logs.
 */
export declare class SplunkLogDriver extends LogDriver {
    private readonly props;
    /**
     * Constructs a new instance of the SplunkLogDriver class.
     *
     * @param props the splunk log driver configuration options.
     */
    constructor(props: SplunkLogDriverProps);
    /**
     * Called when the log driver is configured on a container
     */
    bind(_scope: Construct, _containerDefinition: ContainerDefinition): LogDriverConfig;
}
