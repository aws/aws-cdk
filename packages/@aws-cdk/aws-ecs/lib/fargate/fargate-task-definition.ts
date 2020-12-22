import { Resource, Tokenization } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CommonTaskDefinitionProps, Compatibility, ITaskDefinition, NetworkMode, TaskDefinition } from '../base/task-definition';

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
   * @default 512
   */
  readonly memoryLimitMiB?: number;
}

/**
 * The interface of a task definition run on a Fargate cluster.
 */
export interface IFargateTaskDefinition extends ITaskDefinition {

}

/**
 * The details of a task definition run on a Fargate cluster.
 *
 * @resource AWS::ECS::TaskDefinition
 */
export class FargateTaskDefinition extends TaskDefinition implements IFargateTaskDefinition {

  /**
   * Imports a task definition from the specified task definition ARN.
   */
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
   * The Docker networking mode to use for the containers in the task. Fargate tasks require the awsvpc network mode.
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
      cpu: props.cpu !== undefined ? Tokenization.stringifyNumber(props.cpu) : '256',
      memoryMiB: props.memoryLimitMiB !== undefined ? Tokenization.stringifyNumber(props.memoryLimitMiB) : '512',
      compatibility: Compatibility.FARGATE,
      networkMode: NetworkMode.AWS_VPC,
    });
  }
}
