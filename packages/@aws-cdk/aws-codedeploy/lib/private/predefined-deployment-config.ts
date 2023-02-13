import { IResource } from '@aws-cdk/core';
import { IBaseDeploymentConfig } from '../base-deployment-config';

/**
 * A reference to a DeploymentConfig that is managed by AWS
 *
 * Since these DeploymentConfigs are present in every region, and we might use
 * them in conjunction with cross-region DeploymentGroups, we need to specialize
 * the account and region to the DeploymentGroup before using.
 *
 * A DeploymentGroup must call `bindEnvironment()` first if it detects this type,
 * before reading the DeploymentConfig ARN.
 *
 * This type is fully hidden, which means that the constant objects provided by
 * CDK will have magical behavior that customers can't reimplement themselves.
 * Not ideal, but our DeploymentConfig type inheritance is already overly
 * complicated and to do it properly with the nominal typing we are emplying
 * will require adding 4 more empty or nearly empty interfaces, which seems a
 * bit silly for a need that's not necessarily clearly needed by customers.
 * We can always move to exposing later.
 */
export interface IPredefinedDeploymentConfig {
  /**
   * Bind the predefined deployment config to the environment of the given resource
   */
  bindEnvironment(deploymentGroup: IResource): IBaseDeploymentConfig;
}

export function isPredefinedDeploymentConfig(x: unknown): x is IPredefinedDeploymentConfig {
  return typeof x === 'object' && !!x && !!(x as any).bindEnvironment;
}