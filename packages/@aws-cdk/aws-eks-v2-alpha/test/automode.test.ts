import { Template, Match } from 'aws-cdk-lib/assertions';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
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
        NodePools: Match.absent(),
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

  test('validates node pool values', () => {
    // GIVEN
    const { stack } = testFixtureNoVpc();

    // WHEN/THEN
    expect(() => {
      new eks.Cluster(stack, 'Cluster', {
        version: CLUSTER_VERSION,
        autoMode: true,
        compute: {
          nodePools: ['invalid-pool'],
        },
      });
    }).toThrow(/Invalid node pool values: invalid-pool. Valid values are: general-purpose, system/);
  });

  test('validates case-sensitive node pool values', () => {
    // GIVEN
    const { stack } = testFixtureNoVpc();

    // WHEN/THEN
    expect(() => {
      new eks.Cluster(stack, 'Cluster', {
        version: CLUSTER_VERSION,
        autoMode: true,
        compute: {
          nodePools: ['System', 'GENERAL-PURPOSE'],
        },
      });
    }).toThrow(/Invalid node pool values: System, GENERAL-PURPOSE. Valid values are: general-purpose, system/);
  });

  test('accepts valid node pool values in any order', () => {
    // GIVEN
    const { stack } = testFixtureNoVpc();

    // WHEN
    new eks.Cluster(stack, 'Cluster', {
      version: CLUSTER_VERSION,
      autoMode: true,
      compute: {
        nodePools: ['general-purpose', 'system'],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EKS::Cluster', {
      ComputeConfig: {
        NodePools: Match.arrayEquals(['general-purpose', 'system']),
      },
    });
  });

  test('can provide custom node role in auto mode', () => {
    // GIVEN
    const { stack } = testFixtureNoVpc();
    const customRole = new iam.Role(stack, 'CustomRole', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
    });

    // WHEN
    new eks.Cluster(stack, 'Cluster', {
      version: CLUSTER_VERSION,
      autoMode: true,
      compute: {
        nodeRole: customRole,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EKS::Cluster', {
      ComputeConfig: {
        NodeRoleArn: {
          'Fn::GetAtt': ['CustomRole6D8E6809', 'Arn'],
        },
      },
    });
  });

  test('validates storage configuration in auto mode', () => {
    // GIVEN
    const { stack } = testFixtureNoVpc();

    // WHEN
    new eks.Cluster(stack, 'Cluster', {
      version: CLUSTER_VERSION,
      autoMode: true,
      storage: {
        blockStorage: {},
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EKS::Cluster', {
      StorageConfig: {
        BlockStorage: {
          Enabled: true,
        },
      },
    });
  });

  test('validates network configuration in auto mode', () => {
    // GIVEN
    const { stack } = testFixtureNoVpc();

    // WHEN
    new eks.Cluster(stack, 'Cluster', {
      version: CLUSTER_VERSION,
      autoMode: true,
      kubernetesNetwork: {
        elasticLoadBalancing: {
          enabled: true,
        },
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EKS::Cluster', {
      KubernetesNetworkConfig: {
        ElasticLoadBalancing: {
          Enabled: true,
        },
      },
    });
  });

  test('verifies node role has required managed policies in auto mode', () => {
    // GIVEN
    const { stack } = testFixtureNoVpc();
    const customRole = new iam.Role(stack, 'CustomRole', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
    });

    // WHEN
    new eks.Cluster(stack, 'Cluster', {
      version: CLUSTER_VERSION,
      autoMode: true,
      compute: {
        nodeRole: customRole,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
      ManagedPolicyArns: Match.arrayWith([
        {
          'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::aws:policy/AmazonEKSClusterPolicy']],
        },
        {
          'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::aws:policy/AmazonEKSComputePolicy']],
        },
        {
          'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::aws:policy/AmazonEKSBlockStoragePolicy']],
        },
        {
          'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::aws:policy/AmazonEKSLoadBalancingPolicy']],
        },
      ]),
    });
  });

  test('supports auto mode with private endpoint access', () => {
    // GIVEN
    const { stack } = testFixtureNoVpc();

    // WHEN
    new eks.Cluster(stack, 'Cluster', {
      version: CLUSTER_VERSION,
      autoMode: true,
      endpointAccess: eks.EndpointAccess.PRIVATE,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EKS::Cluster', {
      ResourcesVpcConfig: Match.objectLike({
        EndpointPrivateAccess: true,
        EndpointPublicAccess: false,
      }),
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
