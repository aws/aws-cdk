import { Template, Match } from 'aws-cdk-lib/assertions';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as eks from '../lib';
import { testFixtureNoVpc } from './util';

const CLUSTER_VERSION = eks.KubernetesVersion.V1_32;

describe('eks auto mode', () => {
  test('auto mode is enabled by default', () => {
    // GIVEN
    const { stack } = testFixtureNoVpc();

    // WHEN
    new eks.Cluster(stack, 'Cluster', {
      version: CLUSTER_VERSION,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EKS::Cluster', {
      ComputeConfig: {
        Enabled: true,
        NodePools: ['system', 'general-purpose'],
      },
      KubernetesNetworkConfig: {
        ElasticLoadBalancing: {
          Enabled: true,
        },
      },
      StorageConfig: {
        BlockStorage: {
          Enabled: true,
        },
      },
    });
  });

  test('auto mode can be explicitly enabled', () => {
    // GIVEN
    const { stack } = testFixtureNoVpc();

    // WHEN
    new eks.Cluster(stack, 'Cluster', {
      version: CLUSTER_VERSION,
      autoMode: true,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EKS::Cluster', {
      ComputeConfig: {
        Enabled: true,
        NodePools: ['system', 'general-purpose'],
      },
      KubernetesNetworkConfig: {
        ElasticLoadBalancing: {
          Enabled: true,
        },
      },
      StorageConfig: {
        BlockStorage: {
          Enabled: true,
        },
      },
    });
  });

  test('auto mode can be explicitly disabled', () => {
    // GIVEN
    const { stack } = testFixtureNoVpc();

    // WHEN
    new eks.Cluster(stack, 'Cluster', {
      version: CLUSTER_VERSION,
      autoMode: false,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EKS::Cluster', {
      ComputeConfig: {
        Enabled: false,
        NodePools: ['system', 'general-purpose'],
      },
      KubernetesNetworkConfig: {
        ElasticLoadBalancing: {
          Enabled: false,
        },
      },
      StorageConfig: {
        BlockStorage: {
          Enabled: false,
        },
      },
    });
  });

  test('auto mode configures node pools in correct order', () => {
    // GIVEN
    const { stack } = testFixtureNoVpc();

    // WHEN
    new eks.Cluster(stack, 'Cluster', {
      version: CLUSTER_VERSION,
      autoMode: true,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EKS::Cluster', {
      ComputeConfig: {
        NodePools: Match.arrayEquals(['system', 'general-purpose']),
      },
    });
  });

  test('throws when defaultCapacity* properties are set with autoMode enabled', () => {
    // GIVEN
    const { stack } = testFixtureNoVpc();

    // WHEN/THEN
    expect(() => {
      new eks.Cluster(stack, 'Cluster1', {
        version: CLUSTER_VERSION,
        autoMode: true,
        defaultCapacity: 2,
      });
    }).toThrow(/defaultCapacity\* properties are not supported when autoMode is explicitly enabled/);

    expect(() => {
      new eks.Cluster(stack, 'Cluster2', {
        version: CLUSTER_VERSION,
        autoMode: true,
        defaultCapacityType: eks.DefaultCapacityType.NODEGROUP,
      });
    }).toThrow(/defaultCapacity\* properties are not supported when autoMode is explicitly enabled/);

    expect(() => {
      new eks.Cluster(stack, 'Cluster3', {
        version: CLUSTER_VERSION,
        autoMode: true,
        defaultCapacityInstance: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MEDIUM),
      });
    }).toThrow(/defaultCapacity\* properties are not supported when autoMode is explicitly enabled/);
  });
});
