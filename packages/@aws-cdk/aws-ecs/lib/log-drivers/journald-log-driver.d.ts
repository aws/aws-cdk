import { Construct } from 'constructs';
import { BaseLogDriverProps } from './base-log-driver';
import { LogDriver, LogDriverConfig } from './log-driver';
import { ContainerDefinition } from '../container-definition';
/**
 * Specifies the journald log driver configuration options.
 *
 * [Source](https://docs.docker.com/config/containers/logging/journald/)
 */
export interface JournaldLogDriverProps extends BaseLogDriverProps {
}
/**
 * A log driver that sends log information to journald Logs.
 */
export declare class JournaldLogDriver extends LogDriver {
    private readonly props;
    /**
     * Constructs a new instance of the JournaldLogDriver class.
     *
     * @param props the journald log driver configuration options.
     */
    constructor(props?: JournaldLogDriverProps);
    /**
     * Called when the log driver is configured on a container
     */
    bind(_scope: Construct, _containerDefinition: ContainerDefinition): LogDriverConfig;
}
