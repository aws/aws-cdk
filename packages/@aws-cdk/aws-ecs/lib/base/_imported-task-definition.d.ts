import { IRole } from '@aws-cdk/aws-iam';
import { Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { Compatibility, NetworkMode } from './task-definition';
import { IEc2TaskDefinition } from '../ec2/ec2-task-definition';
import { IFargateTaskDefinition } from '../fargate/fargate-task-definition';
/**
 * The properties of ImportedTaskDefinition
 */
export interface ImportedTaskDefinitionProps {
    /**
     * The arn of the task definition
     */
    readonly taskDefinitionArn: string;
    /**
     * What launch types this task definition should be compatible with.
     *
     * @default Compatibility.EC2_AND_FARGATE
     */
    readonly compatibility?: Compatibility;
    /**
     * The networking mode to use for the containers in the task.
     *
     * @default Network mode cannot be provided to the imported task.
     */
    readonly networkMode?: NetworkMode;
    /**
     * The name of the IAM role that grants containers in the task permission to call AWS APIs on your behalf.
     *
     * @default Permissions cannot be granted to the imported task.
     */
    readonly taskRole?: IRole;
}
/**
 * Task definition reference of an imported task
 */
export declare class ImportedTaskDefinition extends Resource implements IEc2TaskDefinition, IFargateTaskDefinition {
    /**
     * What launch types this task definition should be compatible with.
     */
    readonly compatibility: Compatibility;
    /**
     * ARN of this task definition
     */
    readonly taskDefinitionArn: string;
    /**
     * Execution role for this task definition
     */
    readonly executionRole?: IRole;
    /**
     * The networking mode to use for the containers in the task.
     */
    readonly _networkMode?: NetworkMode;
    /**
     * The name of the IAM role that grants containers in the task permission to call AWS APIs on your behalf.
     */
    readonly _taskRole?: IRole;
    constructor(scope: Construct, id: string, props: ImportedTaskDefinitionProps);
    get networkMode(): NetworkMode;
    get taskRole(): IRole;
    /**
     * Return true if the task definition can be run on an EC2 cluster
     */
    get isEc2Compatible(): boolean;
    /**
     * Return true if the task definition can be run on a Fargate cluster
     */
    get isFargateCompatible(): boolean;
    /**
     * Return true if the task definition can be run on a ECS Anywhere cluster
     */
    get isExternalCompatible(): boolean;
}
