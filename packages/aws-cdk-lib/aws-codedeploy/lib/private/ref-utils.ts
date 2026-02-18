import { UnscopedValidationError } from '../../../core';
import type { IApplicationRef, IDeploymentConfigRef } from '../../../interfaces/generated/aws-codedeploy-interfaces.generated';
import type { IBaseDeploymentConfig } from '../base-deployment-config';
import type { IEcsApplication } from '../ecs/application';
import type { IEcsDeploymentConfig } from '../ecs/deployment-config';
import type { ILambdaApplication } from '../lambda/application';
import type { ILambdaDeploymentConfig } from '../lambda/deployment-config';
import type { IServerApplication } from '../server/application';
import type { IServerDeploymentConfig } from '../server/deployment-config';

/**
 * Convert an IApplicationRef to IServerApplication, validating it has the required properties
 */
export function toIServerApplication(app: IApplicationRef): IServerApplication {
  if (!('applicationArn' in app) || !('applicationName' in app)) {
    throw new UnscopedValidationError(`'application' instance should implement IServerApplication, but doesn't: ${app.constructor.name}`);
  }
  return app as IServerApplication;
}

/**
 * Convert an IApplicationRef to IEcsApplication, validating it has the required properties
 */
export function toIEcsApplication(app: IApplicationRef): IEcsApplication {
  if (!('applicationArn' in app) || !('applicationName' in app)) {
    throw new UnscopedValidationError(`'application' instance should implement IEcsApplication, but doesn't: ${app.constructor.name}`);
  }
  return app as IEcsApplication;
}

/**
 * Convert an IApplicationRef to ILambdaApplication, validating it has the required properties
 */
export function toILambdaApplication(app: IApplicationRef): ILambdaApplication {
  if (!('applicationArn' in app) || !('applicationName' in app)) {
    throw new UnscopedValidationError(`'application' instance should implement ILambdaApplication, but doesn't: ${app.constructor.name}`);
  }
  return app as ILambdaApplication;
}

/**
 * Convert an IDeploymentConfigRef to IServerDeploymentConfig, validating it has the required properties
 */
export function toIServerDeploymentConfig(config: IDeploymentConfigRef): IServerDeploymentConfig {
  if (!('deploymentConfigArn' in config) || !('deploymentConfigName' in config)) {
    throw new UnscopedValidationError(`'deploymentConfig' instance should implement IServerDeploymentConfig, but doesn't: ${config.constructor.name}`);
  }
  return config as IServerDeploymentConfig;
}

/**
 * Convert an IDeploymentConfigRef to IEcsDeploymentConfig, validating it has the required properties
 */
export function toIEcsDeploymentConfig(config: IDeploymentConfigRef): IEcsDeploymentConfig {
  if (!('deploymentConfigArn' in config) || !('deploymentConfigName' in config)) {
    throw new UnscopedValidationError(`'deploymentConfig' instance should implement IEcsDeploymentConfig, but doesn't: ${config.constructor.name}`);
  }
  return config as IEcsDeploymentConfig;
}

/**
 * Convert an IDeploymentConfigRef to ILambdaDeploymentConfig, validating it has the required properties
 */
export function toIBaseDeploymentConfig(config: IDeploymentConfigRef): IBaseDeploymentConfig {
  if (!('deploymentConfigArn' in config) || !('deploymentConfigName' in config)) {
    throw new UnscopedValidationError(`'deploymentConfig' instance should implement ILambdaDeploymentConfig, but doesn't: ${config.constructor.name}`);
  }
  return config as ILambdaDeploymentConfig;
}
