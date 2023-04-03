import { Construct } from 'constructs';
import { BaseLogDriverProps } from './base-log-driver';
import { LogDriver, LogDriverConfig } from './log-driver';
import { ContainerDefinition } from '../container-definition';
/**
 * Specifies the json-file log driver configuration options.
 *
 * [Source](https://docs.docker.com/config/containers/logging/json-file/)
 */
export interface JsonFileLogDriverProps extends BaseLogDriverProps {
    /**
     * The maximum size of the log before it is rolled. A positive integer plus a modifier
     * representing the unit of measure (k, m, or g).
     *
     * @default - -1 (unlimited)
     */
    readonly maxSize?: string;
    /**
     * The maximum number of log files that can be present. If rolling the logs creates
     * excess files, the oldest file is removed. Only effective when max-size is also set.
     * A positive integer.
     *
     * @default - 1
     */
    readonly maxFile?: number;
    /**
     * Toggles compression for rotated logs.
     *
     * @default - false
     */
    readonly compress?: boolean;
}
/**
 * A log driver that sends log information to json-file Logs.
 */
export declare class JsonFileLogDriver extends LogDriver {
    private readonly props;
    /**
     * Constructs a new instance of the JsonFileLogDriver class.
     *
     * @param props the json-file log driver configuration options.
     */
    constructor(props?: JsonFileLogDriverProps);
    /**
     * Called when the log driver is configured on a container
     */
    bind(_scope: Construct, _containerDefinition: ContainerDefinition): LogDriverConfig;
}
