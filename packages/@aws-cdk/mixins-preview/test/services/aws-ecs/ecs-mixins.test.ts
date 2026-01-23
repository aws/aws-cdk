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

  describe('EnableEnhancedContainerInsights', () => {
    test('applies to ECS cluster', () => {
      const cluster = new ecs.CfnCluster(stack, 'Cluster');
      const mixin = new ecsMixins.EnableEnhancedContainerInsights();

      expect(mixin.supports(cluster)).toBe(true);
      mixin.applyTo(cluster);

      expect(cluster.clusterSettings).toEqual([
        { name: 'containerInsights', value: 'enhanced' },
      ]);
    });

    test('overrides disabled containerInsights setting', () => {
      const cluster = new ecs.CfnCluster(stack, 'Cluster', {
        clusterSettings: [
          { name: 'containerInsights', value: 'disabled' },
        ],
      });
      const mixin = new ecsMixins.EnableEnhancedContainerInsights();

      mixin.applyTo(cluster);

      expect(cluster.clusterSettings).toEqual([
        { name: 'containerInsights', value: 'enhanced' },
      ]);
    });

    test('overrides enabled containerInsights setting', () => {
      const cluster = new ecs.CfnCluster(stack, 'Cluster', {
        clusterSettings: [
          { name: 'containerInsights', value: 'enabled' },
        ],
      });
      const mixin = new ecsMixins.EnableEnhancedContainerInsights();

      mixin.applyTo(cluster);

      expect(cluster.clusterSettings).toEqual([
        { name: 'containerInsights', value: 'enhanced' },
      ]);
    });

    test('does not support non-ECS cluster constructs', () => {
      const construct = new TestConstruct(stack, 'test');
      const mixin = new ecsMixins.EnableEnhancedContainerInsights();

      expect(mixin.supports(construct)).toBe(false);
    });
  });
});
