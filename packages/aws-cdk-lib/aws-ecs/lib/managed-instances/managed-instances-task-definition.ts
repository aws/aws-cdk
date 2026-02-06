import { Construct } from 'constructs';
import { Tokenization } from '../../../core';
import { addConstructMetadata } from '../../../core/lib/metadata-resource';
import { propertyInjectable } from '../../../core/lib/prop-injectable';
import { ImportedTaskDefinition } from '../base/_imported-task-definition';
import {
  CommonTaskDefinitionAttributes,
  CommonTaskDefinitionProps,
  Compatibility,
  ITaskDefinition,
  NetworkMode,
  TaskDefinition,
} from '../base/task-definition';
import { RuntimePlatform } from '../runtime-platform';

/**
 * The properties for a task definition run on Managed Instances.
 */
export interface ManagedInstancesTaskDefinitionProps extends CommonTaskDefinitionProps {
  /**
   * The name of the task definition.
   *
   * @default - Same as `family`.
   */
  readonly taskDefinitionName?: string;

  /**
   * The number of cpu units used by the task.
   *
   * @default 256
   */
  readonly cpu?: number;

  /**
   * The amount (in MiB) of memory used by the task.
   *
   * @default 512
   */
  readonly memoryLimitMiB?: number;

  /**
   * The runtime platform of the task definition.
   *
   * @default - If the property is undefined, `operatingSystemFamily` is LINUX and `cpuArchitecture` is X86_64
   */
  readonly runtimePlatform?: RuntimePlatform;

  /**
   * When set to true, the container will have a read-only root filesystem.
   *
   * @default false
   */
  readonly readonlyRootFilesystem?: boolean;
}

/**
 * The interface of a task definition run on Managed Instances.
 */
export interface IManagedInstancesTaskDefinition extends ITaskDefinition {

}

/**
 * Attributes used to import an existing Managed Instances task definition
 */
export interface ManagedInstancesTaskDefinitionAttributes extends CommonTaskDefinitionAttributes {
}

/**
 * The details of a task definition run on Managed Instances.
 *
 * @resource AWS::ECS::TaskDefinition
 */
@propertyInjectable
export class ManagedInstancesTaskDefinition extends TaskDefinition implements IManagedInstancesTaskDefinition {
  /**
   * Uniquely identifies this class.
   */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-ecs.ManagedInstancesTaskDefinition';

  /**
   * Imports a task definition from the specified task definition ARN.
   */
  public static fromManagedInstancesTaskDefinitionArn(
    scope: Construct,
    id: string,
    managedInstancesTaskDefinitionArn: string,
  ): IManagedInstancesTaskDefinition {
    return new ImportedTaskDefinition(scope, id, { taskDefinitionArn: managedInstancesTaskDefinitionArn });
  }

  /**
   * Import an existing Managed Instances task definition from its attributes
   */
  public static fromManagedInstancesTaskDefinitionAttributes(
    scope: Construct,
    id: string,
    attrs: ManagedInstancesTaskDefinitionAttributes,
  ): IManagedInstancesTaskDefinition {
    return new ImportedTaskDefinition(scope, id, {
      taskDefinitionArn: attrs.taskDefinitionArn,
      compatibility: Compatibility.MANAGED_INSTANCES,
      networkMode: attrs.networkMode,
      taskRole: attrs.taskRole,
      executionRole: attrs.executionRole,
    });
  }

  /**
   * The number of cpu units used by the task.
   */
  public readonly cpu: number;

  /**
   * The amount (in MiB) of memory used by the task.
   */
  public readonly memoryMiB: number;

  /**
   * Constructs a new instance of the ManagedInstancesTaskDefinition class.
   */
  constructor(scope: Construct, id: string, props: ManagedInstancesTaskDefinitionProps = {}) {
    const cpu = props.cpu ?? 256;
    const memoryMiB = props.memoryLimitMiB ?? 512;

    super(scope, id, {
      ...props,
      family: props.taskDefinitionName ?? props.family,
      cpu: Tokenization.stringifyNumber(cpu),
      memoryMiB: Tokenization.stringifyNumber(memoryMiB),
      compatibility: Compatibility.MANAGED_INSTANCES,
      networkMode: NetworkMode.AWS_VPC,
    });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    this.cpu = cpu;
    this.memoryMiB = memoryMiB;
  }
}
