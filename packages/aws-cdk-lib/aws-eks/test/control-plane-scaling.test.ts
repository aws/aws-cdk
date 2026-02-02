import { KubectlV31Layer } from '@aws-cdk/lambda-layer-kubectl-v31';
import { testFixtureCluster, testFixtureNoVpc } from './util';
import { Template, Match } from '../../assertions';

describe('ControlPlaneScalingConfig', () => {
  test('cluster without controlPlaneScalingConfig', () => {
    // WHEN
    const { stack } = testFixtureNoVpc();
    const { stack: clusterStack } = testFixtureCluster({
      kubectlLayer: new KubectlV31Layer(stack, 'KubectlLayer'),
    });

    // THEN
    Template.fromStack(clusterStack).hasResourceProperties('Custom::AWSCDK-EKS-Cluster', {
      Config: Match.objectLike({
        version: '1.25',
        // controlPlaneScalingConfig should not be present when not specified
      }),
    });

    // Verify controlPlaneScalingConfig is not in the template
    const template = Template.fromStack(clusterStack);
    const resources = template.findResources('Custom::AWSCDK-EKS-Cluster');
    const clusterResource = Object.values(resources)[0];
    expect(clusterResource.Properties.Config.controlPlaneScalingConfig).toBeUndefined();
  });

  test('cluster with controlPlaneScalingConfig', () => {
    // WHEN
    const { stack } = testFixtureNoVpc();
    const { stack: clusterStack } = testFixtureCluster({
      kubectlLayer: new KubectlV31Layer(stack, 'KubectlLayer'),
      controlPlaneScalingConfig: {
        tier: 'standard',
      },
    });

    // THEN
    Template.fromStack(clusterStack).hasResourceProperties('Custom::AWSCDK-EKS-Cluster', {
      Config: {
        controlPlaneScalingConfig: {
          tier: 'standard',
        },
      },
    });
  });
});
