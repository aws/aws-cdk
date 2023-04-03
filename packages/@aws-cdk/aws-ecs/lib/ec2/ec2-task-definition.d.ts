import { Construct } from 'constructs';
import { CommonTaskDefinitionAttributes, CommonTaskDefinitionProps, IpcMode, ITaskDefinition, NetworkMode, PidMode, TaskDefinition, InferenceAccelerator } from '../base/task-definition';
import { PlacementConstraint } from '../placement';
/**
 * The properties for a task definition run on an EC2 cluster.
 */
export interface Ec2TaskDefinitionProps extends CommonTaskDefinitionProps {
    /**
     * The Docker networking mode to use for the containers in the task.
     *
     * The valid values are NONE, BRIDGE, AWS_VPC, and HOST.
     *
     * @default - NetworkMode.BRIDGE for EC2 tasks, AWS_VPC for Fargate tasks.
     */
    readonly networkMode?: NetworkMode;
    /**
     * An array of placement constraint objects to use for the task. You can
     * specify a maximum of 10 constraints per task (this limit includes
     * constraints in the task definition and those specified at run time).
     *
     * @default - No placement constraints.
     */
    readonly placementConstraints?: PlacementConstraint[];
    /**
     * The IPC resource namespace to use for the containers in the task.
     *
     * Not supported in Fargate and Windows containers.
     *
     * @default - IpcMode used by the task is not specified
     */
    readonly ipcMode?: IpcMode;
    /**
     * The process namespace to use for the containers in the task.
     *
     * Not supported in Fargate and Windows containers.
     *
     * @default - PidMode used by the task is not specified
     */
    readonly pidMode?: PidMode;
    /**
     * The inference accelerators to use for the containers in the task.
     *
     * Not supported in Fargate.
     *
     * @default - No inference accelerators.
     */
    readonly inferenceAccelerators?: InferenceAccelerator[];
}
/**
 * The interface of a task definition run on an EC2 cluster.
 */
export interface IEc2TaskDefinition extends ITaskDefinition {
}
/**
 * Attributes used to import an existing EC2 task definition
 */
export interface Ec2TaskDefinitionAttributes extends CommonTaskDefinitionAttributes {
}
/**
 * The details of a task definition run on an EC2 cluster.
 *
 * @resource AWS::ECS::TaskDefinition
 */
export declare class Ec2TaskDefinition extends TaskDefinition implements IEc2TaskDefinition {
    /**
     * Imports a task definition from the specified task definition ARN.
     */
    static fromEc2TaskDefinitionArn(scope: Construct, id: string, ec2TaskDefinitionArn: string): IEc2TaskDefinition;
    /**
     * Imports an existing Ec2 task definition from its attributes
     */
    static fromEc2TaskDefinitionAttributes(scope: Construct, id: string, attrs: Ec2TaskDefinitionAttributes): IEc2TaskDefinition;
    /**
     * Constructs a new instance of the Ec2TaskDefinition class.
     */
    constructor(scope: Construct, id: string, props?: Ec2TaskDefinitionProps);
}
