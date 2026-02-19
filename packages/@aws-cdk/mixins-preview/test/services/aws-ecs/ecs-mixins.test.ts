import { Construct } from 'constructs';
import { Stack, App } from 'aws-cdk-lib/core';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecsMixins from '../../../lib/services/aws-ecs/mixins';

class TestConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);
  }
}

describe('ECS Mixins', () => {
  let app: App;
  let stack: Stack;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'TestStack');
  });

  describe('ClusterSettings', () => {
    test('applies setting to ECS cluster', () => {
      const cluster = new ecs.CfnCluster(stack, 'Cluster');
      const mixin = new ecsMixins.ClusterSettings([{ name: 'containerInsights', value: 'enabled' }]);

      expect(mixin.supports(cluster)).toBe(true);
      mixin.applyTo(cluster);

      expect(cluster.clusterSettings).toEqual([
        { name: 'containerInsights', value: 'enabled' },
      ]);
    });

    test('updates existing setting with same name', () => {
      const cluster = new ecs.CfnCluster(stack, 'Cluster', {
        clusterSettings: [
          { name: 'containerInsights', value: 'disabled' },
        ],
      });
      const mixin = new ecsMixins.ClusterSettings([{ name: 'containerInsights', value: 'enhanced' }]);

      mixin.applyTo(cluster);

      expect(cluster.clusterSettings).toEqual([
        { name: 'containerInsights', value: 'enhanced' },
      ]);
    });

    test('adds setting when different name exists', () => {
      const cluster = new ecs.CfnCluster(stack, 'Cluster', {
        clusterSettings: [
          { name: 'otherSetting', value: 'someValue' },
        ],
      });
      const mixin = new ecsMixins.ClusterSettings([{ name: 'containerInsights', value: 'enhanced' }]);

      mixin.applyTo(cluster);

      expect(cluster.clusterSettings).toEqual([
        { name: 'otherSetting', value: 'someValue' },
        { name: 'containerInsights', value: 'enhanced' },
      ]);
    });

    test('wraps non-array clusterSettings and preserves existing value', () => {
      const cluster = new ecs.CfnCluster(stack, 'Cluster');
      (cluster as any).clusterSettings = { Ref: 'ExistingSettings' };
      const mixin = new ecsMixins.ClusterSettings([{ name: 'containerInsights', value: 'enhanced' }]);

      mixin.applyTo(cluster);

      expect(cluster.clusterSettings).toEqual([
        { Ref: 'ExistingSettings' },
        { name: 'containerInsights', value: 'enhanced' },
      ]);
    });

    test('does not support non-ECS cluster constructs', () => {
      const construct = new TestConstruct(stack, 'test');
      const mixin = new ecsMixins.ClusterSettings([{ name: 'containerInsights', value: 'enabled' }]);

      expect(mixin.supports(construct)).toBe(false);
    });
  });
});
