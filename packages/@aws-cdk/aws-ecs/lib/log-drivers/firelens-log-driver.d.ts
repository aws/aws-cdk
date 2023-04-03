import { Construct } from 'constructs';
import { BaseLogDriverProps } from './base-log-driver';
import { LogDriver, LogDriverConfig } from './log-driver';
import { ContainerDefinition, Secret } from '../container-definition';
/**
 * Specifies the firelens log driver configuration options.
 */
export interface FireLensLogDriverProps extends BaseLogDriverProps {
    /**
     * The configuration options to send to the log driver.
     * @default - the log driver options
     */
    readonly options?: {
        [key: string]: string;
    };
    /**
     * The secrets to pass to the log configuration.
     * @default - No secret options provided.
     */
    readonly secretOptions?: {
        [key: string]: Secret;
    };
}
/**
 * FireLens enables you to use task definition parameters to route logs to an AWS service
 *  or AWS Partner Network (APN) destination for log storage and analytics
 */
export declare class FireLensLogDriver extends LogDriver {
    /**
     * The configuration options to send to the log driver.
     * @default - the log driver options
     */
    private options?;
    /**
     * The secrets to pass to the log configuration.
     * @default - No secret options provided.
     */
    private secretOptions?;
    /**
     * Constructs a new instance of the FireLensLogDriver class.
     * @param props the awsfirelens log driver configuration options.
     */
    constructor(props: FireLensLogDriverProps);
    /**
     * Called when the log driver is configured on a container
     */
    bind(_scope: Construct, _containerDefinition: ContainerDefinition): LogDriverConfig;
}
