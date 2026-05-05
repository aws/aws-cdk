import { KubectlV31Layer } from '@aws-cdk/lambda-layer-kubectl-v31';
import { testFixture } from './util';
import { Template, Match } from '../../assertions';
import { Cluster, KubernetesVersion } from '../lib';

describe('ControlPlaneScalingConfig', () => {
  test('cluster without controlPlaneScalingConfig', () => {
    // WHEN
    const { stack } = testFixture();
    new Cluster(stack, 'Cluster', {
      version: KubernetesVersion.V1_31,
      kubectlLayer: new KubectlV31Layer(stack, 'KubectlLayer'),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('Custom::AWSCDK-EKS-Cluster', {
      Config: Match.objectLike({
        version: '1.31',
        // controlPlaneScalingConfig should not be present when not specified
      }),
    });

    // Verify controlPlaneScalingConfig is not in the template
    const template = Template.fromStack(stack);
    const resources = template.findResources('Custom::AWSCDK-EKS-Cluster');
    const clusterResource = Object.values(resources)[0];
    expect(clusterResource.Properties.Config.controlPlaneScalingConfig).toBeUndefined();
  });

  test('cluster with controlPlaneScalingConfig', () => {
    const tiers = ['standard', 'tier-xl', 'tier-2xl', 'tier-4xl'];

    tiers.forEach((tier) => {
      // WHEN
      const { stack } = testFixture();
      new Cluster(stack, `Cluster-${tier}`, {
        version: KubernetesVersion.V1_31,
        kubectlLayer: new KubectlV31Layer(stack, `KubectlLayer-${tier}`),
        controlPlaneScalingConfig: {
          tier,
        },
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('Custom::AWSCDK-EKS-Cluster', {
        Config: {
          controlPlaneScalingConfig: {
            tier,
          },
        },
      });
    });
  });
});
