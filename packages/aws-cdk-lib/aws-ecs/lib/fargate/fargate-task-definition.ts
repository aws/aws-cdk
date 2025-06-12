import { Construct } from 'constructs';
import { Tokenization, Token, ValidationError } from '../../../core';
import { addConstructMetadata } from '../../../core/lib/metadata-resource';
import { propertyInjectable } from '../../../core/lib/prop-injectable';
import { ImportedTaskDefinition } from '../base/_imported-task-definition';
import {
  CommonTaskDefinitionAttributes,
  CommonTaskDefinitionProps,
  Compatibility,
  ITaskDefinition,
  NetworkMode,
  PidMode,
  TaskDefinition,
} from '../base/task-definition';
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
   * Note: For windows platforms, this field is not enforced at runtime. However, it is still required as it is used to determine
   * the instance type and size that tasks run on.
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
   * Note: For windows platforms, this field is not enforced at runtime. However, it is still required as it is used to determine
   * the instance type and size that tasks run on.
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

  /**
   * The process namespace to use for the containers in the task.
   *
   * Only supported for tasks that are hosted on AWS Fargate if the tasks
   * are using platform version 1.4.0 or later (Linux).  Only the TASK option
   * is supported for Linux-based Fargate containers. Not supported in
   * Windows containers. If pidMode is specified for a Fargate task, then
   * runtimePlatform.operatingSystemFamily must also be specified.  For more
   * information, see [Task Definition Parameters](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html#task_definition_pidmode).
   *
   * @default - PidMode used by the task is not specified
   */
  readonly pidMode?: PidMode;
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
@propertyInjectable
export class FargateTaskDefinition extends TaskDefinition implements IFargateTaskDefinition {
  /**
   * Uniquely identifies this class.
   */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-ecs.FargateTaskDefinition';

  /**
   * Imports a task definition from the specified task definition ARN.
   */
  public static fromFargateTaskDefinitionArn(scope: Construct, id: string, fargateTaskDefinitionArn: string): IFargateTaskDefinition {
    return new ImportedTaskDefinition(scope, id, { taskDefinitionArn: fargateTaskDefinitionArn });
  }

  /**
   * Import an existing Fargate task definition from its attributes
   */
  public static fromFargateTaskDefinitionAttributes(
    scope: Construct,
    id: string,
    attrs: FargateTaskDefinitionAttributes,
  ): IFargateTaskDefinition {
    return new ImportedTaskDefinition(scope, id, {
      taskDefinitionArn: attrs.taskDefinitionArn,
      compatibility: Compatibility.FARGATE,
      networkMode: attrs.networkMode,
      taskRole: attrs.taskRole,
      executionRole: attrs.executionRole,
    });
  }

  /**
   * The Docker networking mode to use for the containers in the task. Fargate tasks require the awsvpc network mode.
   */
  public readonly networkMode: NetworkMode = NetworkMode.AWS_VPC;
  // NOTE: Until the fix to https://github.com/Microsoft/TypeScript/issues/26969 gets released,
  // we need to explicitly write the type here, as type deduction for enums won't lead to
  // the import being generated in the .d.ts file.

  /**
   * The amount (in GiB) of ephemeral storage to be allocated to the task.
   */
  public readonly ephemeralStorageGiB?: number;

  /**
   * The number of cpu units used by the task.
   */
  public readonly cpu: number;

  /**
   * The amount (in MiB) of memory used by the task.
   */
  public readonly memoryMiB: number;

  /**
   * Constructs a new instance of the FargateTaskDefinition class.
   */
  constructor(scope: Construct, id: string, props: FargateTaskDefinitionProps = {}) {
    const cpu = props.cpu ?? 256;
    const memoryMiB = props.memoryLimitMiB ?? 512;

    super(scope, id, {
      ...props,
      cpu: Tokenization.stringifyNumber(cpu),
      memoryMiB: Tokenization.stringifyNumber(memoryMiB),
      compatibility: Compatibility.FARGATE,
      networkMode: NetworkMode.AWS_VPC,
      pidMode: props.pidMode,
    });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    this.cpu = cpu;
    this.memoryMiB = memoryMiB;

    // eslint-disable-next-line max-len
    if (props.ephemeralStorageGiB && !Token.isUnresolved(props.ephemeralStorageGiB) && (props.ephemeralStorageGiB < 21 || props.ephemeralStorageGiB > 200)) {
      throw new ValidationError('Ephemeral storage size must be between 21GiB and 200GiB', this);
    }

    if (props.pidMode) {
      if (!props.runtimePlatform?.operatingSystemFamily) {
        throw new ValidationError('Specifying \'pidMode\' requires that operating system family also be provided.', this);
      }
      if (props.runtimePlatform?.operatingSystemFamily?.isWindows()) {
        throw new ValidationError('\'pidMode\' is not supported for Windows containers.', this);
      }
      if (!Token.isUnresolved(props.pidMode)
          && props.runtimePlatform?.operatingSystemFamily?.isLinux()
          && props.pidMode !== PidMode.TASK) {
        throw new ValidationError(`\'pidMode\' can only be set to \'${PidMode.TASK}\' for Linux Fargate containers, got: \'${props.pidMode}\'.`, this);
      }
    }

    this.ephemeralStorageGiB = props.ephemeralStorageGiB;
  }
}
