import { Template, Match } from '../../assertions';
import { testFixtureCluster } from './util';

describe('ControlPlaneScalingConfig', () => {
  test('cluster without controlPlaneScalingConfig', () => {
    // WHEN
    const { stack } = testFixtureCluster();

    // THEN
    Template.fromStack(stack).hasResourceProperties('Custom::AWSCDK-EKS-Cluster', {
      Config: Match.objectLike({
        version: '1.25',
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
    // WHEN
    const { stack } = testFixtureCluster({
      controlPlaneScalingConfig: {
        tier: 'standard',
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('Custom::AWSCDK-EKS-Cluster', {
      Config: {
        controlPlaneScalingConfig: {
          tier: 'standard',
        },
      },
    });
  });
});
