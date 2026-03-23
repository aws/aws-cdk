import { testFixtureCluster } from './util';
import { Template } from '../../assertions';

describe('ControlPlaneScalingConfig', () => {
  test('cluster without controlPlaneScalingConfig', () => {
    // WHEN
    const { stack } = testFixtureCluster();

    // THEN
    const template = Template.fromStack(stack);
    const resources = template.findResources('AWS::EKS::Cluster');
    const clusterResource = Object.values(resources)[0];
    expect(clusterResource.Properties.ControlPlaneScalingConfig).toBeUndefined();
  });

  test('cluster with controlPlaneScalingConfig', () => {
    // WHEN
    const { stack } = testFixtureCluster({
      controlPlaneScalingConfig: {
        tier: 'standard',
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EKS::Cluster', {
      ControlPlaneScalingConfig: {
        Tier: 'standard',
      },
    });
  });
});
