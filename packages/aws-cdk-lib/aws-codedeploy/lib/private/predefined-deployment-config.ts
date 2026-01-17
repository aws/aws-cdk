import { IBindableDeploymentConfig } from '../base-deployment-config';
import { IDeploymentConfigRef } from '../codedeploy.generated';

export function isIBindableDeploymentConfig(x: IDeploymentConfigRef): x is IBindableDeploymentConfig {
  return typeof x === 'object' && !!x && 'bindEnvironment' in x;
}
