import { Construct } from 'constructs';
import { ImportedTaskDefinition } from '../../lib/base/_imported-task-definition';
import {
  CommonTaskDefinitionAttributes,
  CommonTaskDefinitionProps,
  Compatibility,
  InferenceAccelerator,
  ITaskDefinition,
  NetworkMode,
  TaskDefinition,
} from '../base/task-definition';

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
export class ExternalTaskDefinition extends TaskDefinition implements IExternalTaskDefinition {
  /**
   * Imports a task definition from the specified task definition ARN.
   */
  public static fromEc2TaskDefinitionArn(scope: Construct, id: string, externalTaskDefinitionArn: string): IExternalTaskDefinition {
    return new ImportedTaskDefinition(scope, id, {
      taskDefinitionArn: externalTaskDefinitionArn,
    });
  }

  /**
   * Imports an existing External task definition from its attributes
   */
  public static fromExternalTaskDefinitionAttributes(
    scope: Construct,
    id: string,
    attrs: ExternalTaskDefinitionAttributes,
  ): IExternalTaskDefinition {
    return new ImportedTaskDefinition(scope, id, {
      taskDefinitionArn: attrs.taskDefinitionArn,
      compatibility: Compatibility.EXTERNAL,
      networkMode: attrs.networkMode,
      taskRole: attrs.taskRole,
    });
  }

  /**
   * Constructs a new instance of the ExternalTaskDefinition class.
   */
  constructor(scope: Construct, id: string, props: ExternalTaskDefinitionProps = {}) {
    super(scope, id, {
      ...props,
      compatibility: Compatibility.EXTERNAL,
      networkMode: props.networkMode ?? NetworkMode.BRIDGE,
    });
  }

  /**
   * Overriden method to throw error as interface accelerators are not supported for external tasks
   */
  public addInferenceAccelerator(_inferenceAccelerator: InferenceAccelerator) {
    throw new Error('Cannot use inference accelerators on tasks that run on External service');
  }
}
