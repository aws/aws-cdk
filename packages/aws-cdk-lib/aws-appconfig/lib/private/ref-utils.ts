import { UnscopedValidationError } from '../../../core';
import type { IDeploymentStrategyRef, IEnvironmentRef } from '../../../interfaces/generated/aws-appconfig-interfaces.generated';
import type { IDeploymentStrategy } from '../deployment-strategy';
import type { IEnvironment } from '../environment';

/**
 * Converts an IEnvironmentRef to IEnvironment, with runtime type checking
 */
export function toIEnvironment(environment: IEnvironmentRef): IEnvironment {
  // Check if it's already an IEnvironment by testing for key methods
  if ('addDeployment' in environment && 'applicationId' in environment && 'environmentId' in environment) {
    return environment as IEnvironment;
  }
  throw new UnscopedValidationError(`'environment' instance should implement IEnvironment, but doesn't: ${environment.constructor.name}`);
}

/**
 * Converts an IDeploymentStrategyRef to IDeploymentStrategy, with runtime type checking
 */
export function toIDeploymentStrategy(deploymentStrategy: IDeploymentStrategyRef): IDeploymentStrategy {
  // Check if it's already an IDeploymentStrategy by testing for key properties
  if ('deploymentStrategyId' in deploymentStrategy && 'deploymentStrategyArn' in deploymentStrategy) {
    return deploymentStrategy as IDeploymentStrategy;
  }
  throw new UnscopedValidationError(`'deploymentStrategy' instance should implement IDeploymentStrategy, but doesn't: ${deploymentStrategy.constructor.name}`);
}
