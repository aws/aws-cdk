import { Construct } from 'constructs';
import { CommonTaskDefinitionAttributes, CommonTaskDefinitionProps, InferenceAccelerator, ITaskDefinition, NetworkMode, TaskDefinition } from '../base/task-definition';
/**
 * The properties for a task definition run on an External cluster.
 */
export interface ExternalTaskDefinitionProps extends CommonTaskDefinitionProps {
    /**
     * The networking mode to use for the containers in the task.
     *
     * With ECS Anywhere, supported modes are bridge, host and none.
     *
     * @default NetworkMode.BRIDGE
     */
    readonly networkMode?: NetworkMode;
}
/**
 * The interface of a task definition run on an External cluster.
 */
export interface IExternalTaskDefinition extends ITaskDefinition {
}
/**
 * Attributes used to import an existing External task definition
 */
export interface ExternalTaskDefinitionAttributes extends CommonTaskDefinitionAttributes {
}
/**
 * The details of a task definition run on an External cluster.
 *
 * @resource AWS::ECS::TaskDefinition
 */
export declare class ExternalTaskDefinition extends TaskDefinition implements IExternalTaskDefinition {
    /**
     * Imports a task definition from the specified task definition ARN.
     */
    static fromEc2TaskDefinitionArn(scope: Construct, id: string, externalTaskDefinitionArn: string): IExternalTaskDefinition;
    /**
     * Imports an existing External task definition from its attributes
     */
    static fromExternalTaskDefinitionAttributes(scope: Construct, id: string, attrs: ExternalTaskDefinitionAttributes): IExternalTaskDefinition;
    /**
     * Constructs a new instance of the ExternalTaskDefinition class.
     */
    constructor(scope: Construct, id: string, props?: ExternalTaskDefinitionProps);
    /**
     * Overriden method to throw error as interface accelerators are not supported for external tasks
     */
    addInferenceAccelerator(_inferenceAccelerator: InferenceAccelerator): void;
}
