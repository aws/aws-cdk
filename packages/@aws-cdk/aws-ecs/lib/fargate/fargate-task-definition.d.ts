import { Construct } from 'constructs';
import { CommonTaskDefinitionAttributes, CommonTaskDefinitionProps, ITaskDefinition, NetworkMode, TaskDefinition } from '../base/task-definition';
import { RuntimePlatform } from '../runtime-platform';
/**
 * The properties for a task definition.
 */
export interface FargateTaskDefinitionProps extends CommonTaskDefinitionProps {
    /**
     * The number of cpu units used by the task. For tasks using the Fargate launch type,
     * this field is required and you must use one of the following values,
     * which determines your range of valid values for the memory parameter:
     *
     * 256 (.25 vCPU) - Available memory values: 512 (0.5 GB), 1024 (1 GB), 2048 (2 GB)
     *
     * 512 (.5 vCPU) - Available memory values: 1024 (1 GB), 2048 (2 GB), 3072 (3 GB), 4096 (4 GB)
     *
     * 1024 (1 vCPU) - Available memory values: 2048 (2 GB), 3072 (3 GB), 4096 (4 GB), 5120 (5 GB), 6144 (6 GB), 7168 (7 GB), 8192 (8 GB)
     *
     * 2048 (2 vCPU) - Available memory values: Between 4096 (4 GB) and 16384 (16 GB) in increments of 1024 (1 GB)
     *
     * 4096 (4 vCPU) - Available memory values: Between 8192 (8 GB) and 30720 (30 GB) in increments of 1024 (1 GB)
     *
     * 8192 (8 vCPU) - Available memory values: Between 16384 (16 GB) and 61440 (60 GB) in increments of 4096 (4 GB)
     *
     * 16384 (16 vCPU) - Available memory values: Between 32768 (32 GB) and 122880 (120 GB) in increments of 8192 (8 GB)
     *
     * @default 256
     */
    readonly cpu?: number;
    /**
     * The amount (in MiB) of memory used by the task. For tasks using the Fargate launch type,
     * this field is required and you must use one of the following values, which determines your range of valid values for the cpu parameter:
     *
     * 512 (0.5 GB), 1024 (1 GB), 2048 (2 GB) - Available cpu values: 256 (.25 vCPU)
     *
     * 1024 (1 GB), 2048 (2 GB), 3072 (3 GB), 4096 (4 GB) - Available cpu values: 512 (.5 vCPU)
     *
     * 2048 (2 GB), 3072 (3 GB), 4096 (4 GB), 5120 (5 GB), 6144 (6 GB), 7168 (7 GB), 8192 (8 GB) - Available cpu values: 1024 (1 vCPU)
     *
     * Between 4096 (4 GB) and 16384 (16 GB) in increments of 1024 (1 GB) - Available cpu values: 2048 (2 vCPU)
     *
     * Between 8192 (8 GB) and 30720 (30 GB) in increments of 1024 (1 GB) - Available cpu values: 4096 (4 vCPU)
     *
     * Between 16384 (16 GB) and 61440 (60 GB) in increments of 4096 (4 GB) - Available cpu values: 8192 (8 vCPU)
     *
     * Between 32768 (32 GB) and 122880 (120 GB) in increments of 8192 (8 GB) - Available cpu values: 16384 (16 vCPU)
     *
     * @default 512
     */
    readonly memoryLimitMiB?: number;
    /**
     * The amount (in GiB) of ephemeral storage to be allocated to the task. The maximum supported value is 200 GiB.
     *
     * NOTE: This parameter is only supported for tasks hosted on AWS Fargate using platform version 1.4.0 or later.
     *
     * @default 20
     */
    readonly ephemeralStorageGiB?: number;
    /**
     * The operating system that your task definitions are running on.
     *
     * A runtimePlatform is supported only for tasks using the Fargate launch type.
     *
     * @default - Undefined.
     */
    readonly runtimePlatform?: RuntimePlatform;
}
/**
 * The interface of a task definition run on a Fargate cluster.
 */
export interface IFargateTaskDefinition extends ITaskDefinition {
}
/**
 * Attributes used to import an existing Fargate task definition
 */
export interface FargateTaskDefinitionAttributes extends CommonTaskDefinitionAttributes {
}
/**
 * The details of a task definition run on a Fargate cluster.
 *
 * @resource AWS::ECS::TaskDefinition
 */
export declare class FargateTaskDefinition extends TaskDefinition implements IFargateTaskDefinition {
    /**
     * Imports a task definition from the specified task definition ARN.
     */
    static fromFargateTaskDefinitionArn(scope: Construct, id: string, fargateTaskDefinitionArn: string): IFargateTaskDefinition;
    /**
     * Import an existing Fargate task definition from its attributes
     */
    static fromFargateTaskDefinitionAttributes(scope: Construct, id: string, attrs: FargateTaskDefinitionAttributes): IFargateTaskDefinition;
    /**
     * The Docker networking mode to use for the containers in the task. Fargate tasks require the awsvpc network mode.
     */
    readonly networkMode: NetworkMode;
    /**
     * The amount (in GiB) of ephemeral storage to be allocated to the task.
     */
    readonly ephemeralStorageGiB?: number;
    /**
     * Constructs a new instance of the FargateTaskDefinition class.
     */
    constructor(scope: Construct, id: string, props?: FargateTaskDefinitionProps);
}
