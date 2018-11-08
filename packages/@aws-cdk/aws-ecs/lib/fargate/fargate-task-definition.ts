import cdk = require('@aws-cdk/cdk');
import { CommonTaskDefinitionProps, Compatibility, NetworkMode, TaskDefinition } from '../base/task-definition';

/**
 * Properties to define a Fargate Task
 */
export interface FargateTaskDefinitionProps extends CommonTaskDefinitionProps {
  /**
   * The number of cpu units used by the task.
   * Valid values, which determines your range of valid values for the memory parameter:
   * 256 (.25 vCPU) - Available memory values: 0.5GB, 1GB, 2GB
   * 512 (.5 vCPU) - Available memory values: 1GB, 2GB, 3GB, 4GB
   * 1024 (1 vCPU) - Available memory values: 2GB, 3GB, 4GB, 5GB, 6GB, 7GB, 8GB
   * 2048 (2 vCPU) - Available memory values: Between 4GB and 16GB in 1GB increments
   * 4096 (4 vCPU) - Available memory values: Between 8GB and 30GB in 1GB increments
   *
   * @default 256
   */
  cpu?: string;

  /**
   * The amount (in MiB) of memory used by the task.
   *
   * This field is required and you must use one of the following values, which determines your range of valid values
   * for the cpu parameter:
   *
   * 0.5GB, 1GB, 2GB - Available cpu values: 256 (.25 vCPU)
   *
   * 1GB, 2GB, 3GB, 4GB - Available cpu values: 512 (.5 vCPU)
   *
   * 2GB, 3GB, 4GB, 5GB, 6GB, 7GB, 8GB - Available cpu values: 1024 (1 vCPU)
   *
   * Between 4GB and 16GB in 1GB increments - Available cpu values: 2048 (2 vCPU)
   *
   * Between 8GB and 30GB in 1GB increments - Available cpu values: 4096 (4 vCPU)
   *
   * @default 512
   */
  memoryMiB?: string;
}

/**
 * A definition for Tasks on a Fargate cluster
 */
export class FargateTaskDefinition extends TaskDefinition {
  /**
   * The configured network mode
   */
  public readonly networkMode: NetworkMode = NetworkMode.AwsVpc;
  // NOTE: Until the fix to https://github.com/Microsoft/TypeScript/issues/26969 gets released,
  // we need to explicitly write the type here, as type deduction for enums won't lead to
  // the import being generated in the .d.ts file.

  constructor(parent: cdk.Construct, name: string, props: FargateTaskDefinitionProps = {}) {
    super(parent, name, {
      ...props,
      cpu: props.cpu || '256',
      memoryMiB: props.memoryMiB || '512',
      compatibility: Compatibility.Fargate,
      networkMode: NetworkMode.AwsVpc,
    });
  }
}
