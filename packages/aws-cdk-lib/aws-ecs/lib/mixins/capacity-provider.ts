import type { IConstruct } from 'constructs';
import type { Duration } from '../../../core';
import { Token, Tokenization, UnscopedValidationError, ValidationError } from '../../../core';
import { Mixin } from '../../../core/lib/mixins';
import { lit } from '../../../core/lib/private/literal-string';
import { CfnCapacityProvider } from '../ecs.generated';

/**
 * Options for `CapacityProviderInfrastructureOptimization`.
 */
export interface CapacityProviderInfrastructureOptimizationOptions {
  /**
   * The amount of time Amazon ECS Managed Instances waits before optimizing
   * (scaling in) idle or underutilized EC2 instances.
   *
   * A longer delay increases the likelihood of placing new tasks on idle or
   * underutilized instances, reducing startup time. A shorter delay helps
   * reduce infrastructure costs by optimizing idle or underutilized
   * instances more quickly.
   *
   * Must be between 0 seconds and 3600 seconds (1 hour), inclusive.
   *
   * Cannot be used together with `disableInfrastructureOptimization`.
   *
   * @default - Use the default optimization behavior.
   */
  readonly scaleInAfter?: Duration;

  /**
   * Disables automatic infrastructure optimization entirely.
   *
   * Cannot be used together with `scaleInAfter`.
   *
   * @default false
   */
  readonly disableInfrastructureOptimization?: boolean;
}

/**
 * ECS-specific Mixin that configures how Amazon ECS Managed Instances
 * optimizes (scales in) idle or underutilized EC2 instances.
 *
 * Can only be applied to a `CfnCapacityProvider` that is already configured
 * with `managedInstancesProvider`.
 */
export class CapacityProviderInfrastructureOptimization extends Mixin {
  private readonly scaleInAfterSeconds?: number;

  constructor(options: CapacityProviderInfrastructureOptimizationOptions = {}) {
    super();

    if (options.scaleInAfter !== undefined && options.disableInfrastructureOptimization) {
      throw new UnscopedValidationError(
        lit`ScaleInAfterDisableInfrastructureOptimizationMutuallyExclusive`,
        'The options "scaleInAfter" and "disableInfrastructureOptimization" are mutually exclusive',
      );
    }

    if (options.scaleInAfter !== undefined) {
      const seconds = options.scaleInAfter.toSeconds();
      // Duration already rejects negative amounts, so only the upper bound needs checking here.
      if (!Token.isUnresolved(seconds) && seconds > 3600) {
        throw new UnscopedValidationError(
          lit`ScaleInAfterOutOfRange`,
          `scaleInAfter must be between 0 seconds and 3600 seconds (1 hour), got ${seconds} seconds`,
        );
      }
      this.scaleInAfterSeconds = seconds;
    }

    if (options.disableInfrastructureOptimization) {
      this.scaleInAfterSeconds = -1;
    }
  }

  public supports(construct: IConstruct): construct is CfnCapacityProvider {
    return CfnCapacityProvider.isCfnCapacityProvider(construct);
  }

  public applyTo(construct: IConstruct): void {
    if (!this.supports(construct)) {
      return;
    }

    if (this.scaleInAfterSeconds === undefined) {
      return;
    }

    const managedInstancesProvider = construct.managedInstancesProvider;
    if (managedInstancesProvider === undefined || Tokenization.isResolvable(managedInstancesProvider)) {
      throw new ValidationError(
        lit`CapacityProviderInfrastructureOptimizationRequiresManagedInstancesProvider`,
        'CapacityProviderInfrastructureOptimization can only be applied to a capacity provider configured with managedInstancesProvider',
        construct,
      );
    }

    construct.managedInstancesProvider = {
      ...managedInstancesProvider,
      // InfrastructureOptimizationProperty currently has only `scaleInAfter`, so it is safe to
      // overwrite it wholesale rather than merge. Revisit if AWS adds more fields to this group.
      infrastructureOptimization: {
        scaleInAfter: this.scaleInAfterSeconds,
      },
    };
  }
}
