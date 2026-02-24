import { Mixin } from '../../core';
import { CfnCluster } from 'aws-cdk-lib/aws-ecs';
import type { IConstruct } from 'constructs/lib/construct';

/**
 * Applies one or more cluster settings to an ECS cluster.
 *
 * If a setting with the same name already exists, its value is replaced.
 * @mixin true
 */
export class ClusterSettings extends Mixin {
  private readonly settings: CfnCluster.ClusterSettingsProperty[];

  constructor(settings: CfnCluster.ClusterSettingsProperty[]) {
    super();
    this.settings = settings;
  }

  public supports(construct: IConstruct): construct is CfnCluster {
    return CfnCluster.isCfnCluster(construct);
  }

  public applyTo(cluster: IConstruct): void {
    if (!this.supports(cluster)) {
      return;
    }

    const clusterSettings = Array.isArray(cluster.clusterSettings)
      ? [...cluster.clusterSettings] as any[]
      : cluster.clusterSettings === undefined
        ? []
        : [cluster.clusterSettings];

    for (const setting of this.settings) {
      const existingIndex = clusterSettings.findIndex((currentSetting) => (currentSetting as any)?.name === setting.name);
      if (existingIndex >= 0) {
        clusterSettings[existingIndex] = setting;
      } else {
        clusterSettings.push(setting);
      }
    }

    cluster.clusterSettings = clusterSettings;
  }
}
