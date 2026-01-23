import { Mixin } from '../../core';
import { CfnCluster } from 'aws-cdk-lib/aws-ecs';
import type { IConstruct } from 'constructs/lib/construct';

/**
 * ECS-specific mixin for enabling enhanced Container Insights.
 * @mixin true
 */
export class EnableEnhancedContainerInsights extends Mixin {
  supports(construct: IConstruct): construct is CfnCluster {
    return CfnCluster.isCfnResource(construct);
  }

  applyTo(cluster: IConstruct): IConstruct {
    if (!this.supports(cluster)) {
      return cluster;
    }

    cluster.clusterSettings = [
      { name: 'containerInsights', value: 'enhanced' },
    ];

    return cluster;
  }
}
