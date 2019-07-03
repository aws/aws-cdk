import { Construct, Resource } from '@aws-cdk/core';
import { CommonTaskDefinitionProps, Compatibility, ITaskDefinition, NetworkMode, TaskDefinition } from '../base/task-definition';

/**
 * Properties to define a Fargate Task
 */
export interface FargateTaskDefinitionProps extends CommonTaskDefinitionProps {
  /**
   * The number of cpu units used by the task.
   *
   * Valid values, which determines your range of valid values for the memory parameter:
   *
   * 256 (.25 vCPU) - Available memory values: 0.5GB, 1GB, 2GB
   * 512 (.5 vCPU) - Available memory values: 1GB, 2GB, 3GB, 4GB
   * 1024 (1 vCPU) - Available memory values: 2GB, 3GB, 4GB, 5GB, 6GB, 7GB, 8GB
   * 2048 (2 vCPU) - Available memory values: Between 4GB and 16GB in 1GB increments
   * 4096 (4 vCPU) - Available memory values: Between 8GB and 30GB in 1GB increments
   *
   * @default 256
   */
  readonly cpu?: number;

  /**
   * The amount (in MiB) of memory used by the task.
   *
   * This field is required and you must use one of the following values, which determines your range of valid values
   * for the cpu parameter:
   *
   * 512, 1024, 2048 - Available cpu values: 256 (.25 vCPU)
   *
   * 1024, 2048, 3072, 4096 - Available cpu values: 512 (.5 vCPU)
   *
   * 2048, 3072, 4096, 5120, 6144, 7168, 8192 - Available cpu values: 1024 (1 vCPU)
   *
   * Between 4GB and 16GB in 1GB increments - Available cpu values: 2048 (2 vCPU)
   *
   * Between 8GB and 30GB in 1GB increments - Available cpu values: 4096 (4 vCPU)
   *
   * @default 512
   */
  readonly memoryLimitMiB?: number;
}

export interface IFargateTaskDefinition extends ITaskDefinition {

}

/**
 * A definition for Tasks on a Fargate cluster
 * @resource AWS::ECS::TaskDefinition
 */
export class FargateTaskDefinition extends TaskDefinition implements IFargateTaskDefinition {

  public static fromFargateTaskDefinitionArn(scope: Construct, id: string, fargateTaskDefinitionArn: string): IFargateTaskDefinition {
    class Import extends Resource implements IFargateTaskDefinition {
      public readonly taskDefinitionArn = fargateTaskDefinitionArn;
      public readonly compatibility = Compatibility.FARGATE;
      public readonly isEc2Compatible = false;
      public readonly isFargateCompatible = true;
    }

    return new Import(scope, id);
  }

  /**
   * The configured network mode
   */
  public readonly networkMode: NetworkMode = NetworkMode.AWS_VPC;
  // NOTE: Until the fix to https://github.com/Microsoft/TypeScript/issues/26969 gets released,
  // we need to explicitly write the type here, as type deduction for enums won't lead to
  // the import being generated in the .d.ts file.

  /**
   * Constructs a new instance of the FargateTaskDefinition class.
   */
  constructor(scope: Construct, id: string, props: FargateTaskDefinitionProps = {}) {
    super(scope, id, {
      ...props,
      cpu: props.cpu !== undefined ? String(props.cpu) : '256',
      memoryMiB: props.memoryLimitMiB !== undefined ? String(props.memoryLimitMiB) : '512',
      compatibility: Compatibility.FARGATE,
      networkMode: NetworkMode.AWS_VPC,
    });
  }
}
