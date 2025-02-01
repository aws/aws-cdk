import { DeployOptions, HotswapProperties } from '..';
import { Deployments, EcsHotswapProperties, HotswapPropertyOverrides, WorkGraph } from '../../../api/aws-cdk';

export function buildParameterMap(parameters?: Map<string, string | undefined>): { [name: string]: { [name: string]: string | undefined } } {
  const parameterMap: {
    [name: string]: { [name: string]: string | undefined };
  } = {};
  parameterMap['*'] = {};

  const entries = parameters?.entries() ?? [];
  for (const [key, value] of entries) {
    const [stack, parameter] = key.split(':', 2) as [string, string | undefined];
    if (!parameter) {
      parameterMap['*'][stack] = value;
    } else {
      if (!parameterMap[stack]) {
        parameterMap[stack] = {};
      }
      parameterMap[stack][parameter] = value;
    }
  }

  return parameterMap;
}

/**
 * Remove the asset publishing and building from the work graph for assets that are already in place
 */
export async function removePublishedAssets(graph: WorkGraph, deployments: Deployments, options: DeployOptions) {
  await graph.removeUnnecessaryAssets(assetNode => deployments.isSingleAssetPublished(assetNode.assetManifest, assetNode.asset, {
    stack: assetNode.parentStack,
    roleArn: options.roleArn,
    stackName: assetNode.parentStack.stackName,
  }));
}

/**
 * Create the HotswapPropertyOverrides class out of the Interface exposed to users
 */
export function createHotswapPropertyOverrides(hotswapProperties: HotswapProperties): HotswapPropertyOverrides {
  return new HotswapPropertyOverrides(new EcsHotswapProperties(
    hotswapProperties.ecs.minimumHealthyPercent,
    hotswapProperties.ecs.maximumHealthyPercent,
  ));
}
