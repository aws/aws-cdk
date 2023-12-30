import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as cxapi from '@aws-cdk/cx-api';
import * as AWS from 'aws-sdk';
import { Mode } from '../api/aws-auth/credentials';
import { SdkProvider } from '../api/aws-auth/sdk-provider';
import { ContextProviderPlugin } from '../api/plugin';

/**
 * Provides ECS cluster context information.
 */
export class EcsClusterContextProviderPlugin implements ContextProviderPlugin {
  constructor(private readonly aws: SdkProvider) {
  }

  async getValue(query: cxschema.EcsClusterContextQuery): Promise<cxapi.EcsClusterContextResponse> {
    const options = { assumeRoleArn: query.lookupRoleArn };
    const ecs = (await this.aws.forEnvironment(cxapi.EnvironmentUtils.make(query.account, query.region), Mode.ForReading, options)).sdk.ecs();

    const cluster = await this.findCluster(ecs, query);

    return {
      clusterArn: cluster.clusterArn!,
      clusterName: cluster.clusterName!,
      hasEc2Capacity: cluster.capacityProviders?.includes('FARGATE_SPOT') ?? false,
      securityGroupIds: [],
      vpcId: '',
    };
  }

  private async findCluster(ecs: AWS.ECS, query: cxschema.EcsClusterContextQuery): Promise<AWS.ECS.Cluster> {
    const queryClusters = [query.clusterName, query.clusterArn].filter(Boolean) as string[];
    const response = await ecs.describeClusters({ clusters: queryClusters }).promise();

    let filteredClusters = [];
    for (const cluster of response.clusters || []) {
      const clusterArn = cluster.clusterArn;
      if (!clusterArn) {
        throw new Error(`Invalid cluster response: ${JSON.stringify(cluster)}`);
      }
      const tagInfo = await ecs.listTagsForResource({ resourceArn: clusterArn }).promise();
      const clusterTags = tagInfo.tags || [];

      if (query?.tags?.every(tag => clusterTags.some(ct => ct.key === tag.key && ct.value === tag.value))) {
        filteredClusters.push(cluster);
      }
    }

    if (filteredClusters.length === 0) {
      throw new Error(`No ECS clusters found matching ${JSON.stringify(query)}`);
    }
    if (filteredClusters.length > 1) {
      throw new Error(`Expected to find one ECS cluster matching ${JSON.stringify(query)}, but found ${filteredClusters.length}`);
    }

    return filteredClusters[0];
  }
}