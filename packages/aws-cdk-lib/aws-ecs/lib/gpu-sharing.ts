import type { IConstruct } from 'constructs';
import type { CfnTaskDefinition } from './ecs.generated';
import type { Size } from '../../core';
import { SizeRoundingBehavior, Token, ValidationError } from '../../core';
import { lit } from '../../core/lib/private/literal-string';

/**
 * Options for sharing a GPU with NVIDIA Multi-Process Service (MPS).
 */
export interface NvidiaMpsOptions {
  /**
   * The amount of GPU memory allocated to the container.
   *
   * Must be a whole number of mebibytes, and at least 1 MiB.
   */
  readonly memory: Size;

  /**
   * The maximum percentage of the GPU's compute capacity that the container can use.
   *
   * Must be an integer between 1 and 100.
   *
   * @default - no limit is set; the container can use all of the GPU's compute capacity
   */
  readonly maxComputePercent?: number;
}

/**
 * How a container shares a GPU with other containers.
 *
 * Use `gpuSharing` instead of `gpuCount` on a container to request a share of a
 * GPU rather than whole GPUs.
 *
 * @see https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-gpu.html
 */
export class GpuSharing {
  /**
   * Share a GPU with NVIDIA Multi-Process Service (MPS).
   *
   * Supported on Amazon EC2 and Amazon ECS Managed Instances. Not supported on
   * AWS Fargate or external instances (ECS Anywhere).
   *
   * @param options - the GPU memory and optional compute limit for the container
   *
   * @example
   * GpuSharing.nvidiaMps({
   *   memory: Size.gibibytes(4),
   *   maxComputePercent: 50,
   * });
   */
  public static nvidiaMps(options: NvidiaMpsOptions): GpuSharing {
    return new GpuSharing(options);
  }

  private constructor(private readonly nvidiaMpsOptions: NvidiaMpsOptions) { }

  /**
   * Validates the configuration and renders the CloudFormation `SharingStrategy`.
   *
   * @internal
   */
  public _renderSharingStrategy(scope: IConstruct): CfnTaskDefinition.SharingStrategyProperty {
    const { memory, maxComputePercent } = this.nvidiaMpsOptions;

    let memoryMiB: number;
    if (memory.isUnresolved()) {
      // A token amount can only be passed through when it is already expressed in MiB.
      memoryMiB = memory.toMebibytes();
    } else {
      memoryMiB = memory.toMebibytes({ rounding: SizeRoundingBehavior.NONE });
      if (!Number.isInteger(memoryMiB) || memoryMiB < 1) {
        throw new ValidationError(lit`GpuSharingMemoryInvalid`, `gpuSharing memory must be a whole number of MiB and at least 1 MiB, got ${memory.toString()}`, scope);
      }
    }

    if (maxComputePercent !== undefined && !Token.isUnresolved(maxComputePercent)
      && (!Number.isInteger(maxComputePercent) || maxComputePercent < 1 || maxComputePercent > 100)) {
      throw new ValidationError(lit`GpuSharingMaxComputePercentInvalid`, `gpuSharing maxComputePercent must be an integer between 1 and 100, got ${maxComputePercent}`, scope);
    }

    return {
      nvidiaMps: {
        memory: memoryMiB,
        maxComputePercent,
      },
    };
  }
}
