import { Construct } from 'constructs';
import { TaskDefinition } from './base/task-definition';
import { ContainerDefinition, ContainerDefinitionOptions, ContainerDefinitionProps } from './container-definition';
import { ContainerImage } from './container-image';
import { CfnTaskDefinition } from './ecs.generated';
import { LogDriverConfig } from './log-drivers/log-driver';
/**
 * Firelens log router type, fluentbit or fluentd.
 * https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_firelens.html
 */
export declare enum FirelensLogRouterType {
    /**
     * fluentbit
     */
    FLUENTBIT = "fluentbit",
    /**
     * fluentd
     */
    FLUENTD = "fluentd"
}
/**
 * Firelens configuration file type, s3 or file path.
 * https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_firelens.html#firelens-taskdef-customconfig
 */
export declare enum FirelensConfigFileType {
    /**
     * s3
     */
    S3 = "s3",
    /**
     * fluentd
     */
    FILE = "file"
}
/**
 * The options for firelens log router
 * https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_firelens.html#firelens-taskdef-customconfig
 */
export interface FirelensOptions {
    /**
     * By default, Amazon ECS adds additional fields in your log entries that help identify the source of the logs.
     * You can disable this action by setting enable-ecs-log-metadata to false.
     * @default - true
     */
    readonly enableECSLogMetadata?: boolean;
    /**
     * Custom configuration file, s3 or file.
     * Both configFileType and configFileValue must be used together
     * to define a custom configuration source.
     *
     * @default - determined by checking configFileValue with S3 ARN.
     */
    readonly configFileType?: FirelensConfigFileType;
    /**
     * Custom configuration file, S3 ARN or a file path
     * Both configFileType and configFileValue must be used together
     * to define a custom configuration source.
     *
     * @default - no config file value
     */
    readonly configFileValue?: string;
}
/**
 * Firelens Configuration
 * https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_firelens.html#firelens-taskdef
 */
export interface FirelensConfig {
    /**
     * The log router to use
     * @default - fluentbit
     */
    readonly type: FirelensLogRouterType;
    /**
     * Firelens options
     * @default - no additional options
     */
    readonly options?: FirelensOptions;
}
/**
 * The properties in a firelens log router.
 */
export interface FirelensLogRouterProps extends ContainerDefinitionProps {
    /**
     * Firelens configuration
     */
    readonly firelensConfig: FirelensConfig;
}
/**
 * The options for creating a firelens log router.
 */
export interface FirelensLogRouterDefinitionOptions extends ContainerDefinitionOptions {
    /**
     * Firelens configuration
     */
    readonly firelensConfig: FirelensConfig;
}
/**
 * Obtain Fluent Bit image in Amazon ECR and setup corresponding IAM permissions.
 * ECR image pull permissions will be granted in task execution role.
 * Cloudwatch logs, Kinesis data stream or firehose permissions will be grant by check options in logDriverConfig.
 * https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_firelens.html#firelens-using-fluentbit
 */
export declare function obtainDefaultFluentBitECRImage(task: TaskDefinition, logDriverConfig?: LogDriverConfig, imageTag?: string): ContainerImage;
/**
 * Firelens log router
 */
export declare class FirelensLogRouter extends ContainerDefinition {
    /**
     * Firelens configuration
     */
    readonly firelensConfig: FirelensConfig;
    /**
     * Constructs a new instance of the FirelensLogRouter class.
     */
    constructor(scope: Construct, id: string, props: FirelensLogRouterProps);
    /**
     * Render this container definition to a CloudFormation object
     */
    renderContainerDefinition(_taskDefinition?: TaskDefinition): CfnTaskDefinition.ContainerDefinitionProperty;
}
