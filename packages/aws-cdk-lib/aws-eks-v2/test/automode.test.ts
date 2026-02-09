import { Template, Match } from 'aws-cdk-lib/assertions';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as eks from '../lib';
import { testFixtureNoVpc } from './util';

const CLUSTER_VERSION = eks.KubernetesVersion.V1_33;

describe('eks auto mode', () => {
  describe('basic configuration', () => {
    test('auto mode is enabled by default', () => {
      const { stack } = testFixtureNoVpc();
      new eks.Cluster(stack, 'Cluster', {
        version: CLUSTER_VERSION,
      });

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
      const { stack } = testFixtureNoVpc();
      new eks.Cluster(stack, 'Cluster', {
        version: CLUSTER_VERSION,
        defaultCapacityType: eks.DefaultCapacityType.AUTOMODE,
      });

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
  });

  describe('default capacity interactions', () => {
    test('throws when defaultCapacity is set with auto mode', () => {
      const { stack } = testFixtureNoVpc();
      expect(() => {
        new eks.Cluster(stack, 'Cluster', {
          version: CLUSTER_VERSION,
          defaultCapacityType: eks.DefaultCapacityType.AUTOMODE,
          defaultCapacity: 2,
        });
      }).toThrow(/Cannot specify defaultCapacity or defaultCapacityInstance when using Auto Mode/);
    });

    test('throws when defaultCapacityInstance is set with auto mode', () => {
      const { stack } = testFixtureNoVpc();
      expect(() => {
        new eks.Cluster(stack, 'Cluster', {
          version: CLUSTER_VERSION,
          defaultCapacityType: eks.DefaultCapacityType.AUTOMODE,
          defaultCapacityInstance: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MEDIUM),
        });
      }).toThrow(/Cannot specify defaultCapacity or defaultCapacityInstance when using Auto Mode/);
    });

    test('allows nodegroup with specific capacity settings', () => {
      const { stack } = testFixtureNoVpc();
      new eks.Cluster(stack, 'Cluster', {
        version: CLUSTER_VERSION,
        defaultCapacityType: eks.DefaultCapacityType.NODEGROUP,
        defaultCapacity: 3,
        defaultCapacityInstance: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.LARGE),
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::EKS::Cluster', {
        ComputeConfig: {
          Enabled: false,
        },
      });

      template.hasResourceProperties('AWS::EKS::Nodegroup', {
        ScalingConfig: {
          DesiredSize: 3,
          MinSize: 3,
        },
        InstanceTypes: ['t3.large'],
      });
    });
  });

  describe('node pool configuration', () => {
    test('throws when nodePools specified without auto mode', () => {
      const { stack } = testFixtureNoVpc();
      expect(() => {
        new eks.Cluster(stack, 'Cluster', {
          version: CLUSTER_VERSION,
          defaultCapacityType: eks.DefaultCapacityType.NODEGROUP,
          compute: {
            nodePools: ['system', 'general-purpose'],
          },
        });
      }).toThrow(/Cannot specify compute without using DefaultCapacityType.AUTOMODE/);
    });

    test('throws when nodeRole specified without auto mode', () => {
      const { stack } = testFixtureNoVpc();
      const customRole = new iam.Role(stack, 'CustomRole', {
        assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
      });

      expect(() => {
        new eks.Cluster(stack, 'Cluster', {
          version: CLUSTER_VERSION,
          defaultCapacityType: eks.DefaultCapacityType.NODEGROUP,
          compute: {
            nodeRole: customRole,
          },
        });
      }).toThrow(/Cannot specify compute without using DefaultCapacityType.AUTOMODE/);
    });

    test('throws when both nodePools and nodeRole specified without auto mode', () => {
      const { stack } = testFixtureNoVpc();
      const customRole = new iam.Role(stack, 'CustomRole', {
        assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
      });

      expect(() => {
        new eks.Cluster(stack, 'Cluster', {
          version: CLUSTER_VERSION,
          defaultCapacityType: eks.DefaultCapacityType.NODEGROUP,
          compute: {
            nodePools: ['system', 'general-purpose'],
            nodeRole: customRole,
          },
        });
      }).toThrow(/Cannot specify compute without using DefaultCapacityType.AUTOMODE/);
    });

    test('validates node pool values', () => {
      const { stack } = testFixtureNoVpc();
      expect(() => {
        new eks.Cluster(stack, 'Cluster', {
          version: CLUSTER_VERSION,
          defaultCapacityType: eks.DefaultCapacityType.AUTOMODE,
          compute: {
            nodePools: ['invalid-pool'],
          },
        });
      }).toThrow(/Invalid node pool values: invalid-pool. Valid values are: general-purpose, system/);
    });

    test('validates case-sensitive node pool values', () => {
      const { stack } = testFixtureNoVpc();
      expect(() => {
        new eks.Cluster(stack, 'Cluster', {
          version: CLUSTER_VERSION,
          defaultCapacityType: eks.DefaultCapacityType.AUTOMODE,
          compute: {
            nodePools: ['System', 'GENERAL-PURPOSE'],
          },
        });
      }).toThrow(/Invalid node pool values: System, GENERAL-PURPOSE. Valid values are: general-purpose, system/);
    });

    test('configures node pools in correct order', () => {
      const { stack } = testFixtureNoVpc();
      new eks.Cluster(stack, 'Cluster', {
        version: CLUSTER_VERSION,
        defaultCapacityType: eks.DefaultCapacityType.AUTOMODE,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::EKS::Cluster', {
        ComputeConfig: {
          NodePools: Match.arrayEquals(['system', 'general-purpose']),
        },
      });
    });

    test('supports custom node role(new role)', () => {
      const { stack } = testFixtureNoVpc();
      const customRole = new iam.Role(stack, 'CustomRole', {
        assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
      });

      new eks.Cluster(stack, 'Cluster', {
        version: CLUSTER_VERSION,
        defaultCapacityType: eks.DefaultCapacityType.AUTOMODE,
        compute: {
          nodeRole: customRole,
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::EKS::Cluster', {
        ComputeConfig: {
          NodeRoleArn: { 'Fn::GetAtt': ['CustomRole6D8E6809', 'Arn'] },
        },
      });
    });

    test('supports custom node role(imported role)', () => {
      const { stack } = testFixtureNoVpc();
      const customRole = iam.Role.fromRoleArn(stack, 'CustomRole', 'arn:aws:iam::123456789012:role/CustomRole');

      new eks.Cluster(stack, 'Cluster', {
        version: CLUSTER_VERSION,
        defaultCapacityType: eks.DefaultCapacityType.AUTOMODE,
        compute: {
          nodeRole: customRole,
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::EKS::Cluster', {
        ComputeConfig: {
          NodeRoleArn: 'arn:aws:iam::123456789012:role/CustomRole',
        },
      });
    });

    test('does not include nodeRoleArn when nodePools is empty', () => {
      const { stack } = testFixtureNoVpc();

      new eks.Cluster(stack, 'Cluster', {
        version: CLUSTER_VERSION,
        defaultCapacityType: eks.DefaultCapacityType.AUTOMODE,
        compute: {
          nodePools: [],
        },
      });

      // Verify that nodeRoleArn is not included in the CloudFormation template
      Template.fromStack(stack).hasResourceProperties('AWS::EKS::Cluster', {
        ComputeConfig: {
          Enabled: true,
          NodePools: [],
        },
      });

      // Verify that nodeRoleArn is not present in the ComputeConfig
      const template = Template.fromStack(stack);
      const cluster = template.findResources('AWS::EKS::Cluster');
      const clusterLogicalId = Object.keys(cluster)[0];
      const computeConfig = cluster[clusterLogicalId].Properties.ComputeConfig;

      expect(computeConfig).not.toHaveProperty('NodeRoleArn');

      // Verify that no IAM role resource is created for node pools
      // The role would typically have a logical ID like 'ClusterClusternodePoolRole...'
      const iamRoles = template.findResources('AWS::IAM::Role');
      const nodePoolRoleKeys = Object.keys(iamRoles).filter(key =>
        key.includes('nodePoolRole'),
      );

      expect(nodePoolRoleKeys.length).toBe(0);
    });
  });

  describe('network configuration', () => {
    test('supports private endpoint access', () => {
      const { stack } = testFixtureNoVpc();
      new eks.Cluster(stack, 'Cluster', {
        version: CLUSTER_VERSION,
        defaultCapacityType: eks.DefaultCapacityType.AUTOMODE,
        endpointAccess: eks.EndpointAccess.PRIVATE,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::EKS::Cluster', {
        ResourcesVpcConfig: Match.objectLike({
          EndpointPrivateAccess: true,
          EndpointPublicAccess: false,
        }),
        KubernetesNetworkConfig: {
          ElasticLoadBalancing: {
            Enabled: true,
          },
        },
      });
    });
  });

  describe('mixed scenarios', () => {
    test('supports auto mode with explicit node groups', () => {
      const { stack } = testFixtureNoVpc();
      const cluster = new eks.Cluster(stack, 'Cluster', {
        version: CLUSTER_VERSION,
        defaultCapacityType: eks.DefaultCapacityType.AUTOMODE,
      });

      cluster.addNodegroupCapacity('CpuNodegroup', {
        minSize: 1,
        instanceTypes: [ec2.InstanceType.of(ec2.InstanceClass.C5, ec2.InstanceSize.XLARGE)],
        labels: { workload: 'cpu-intensive' },
      });

      cluster.addNodegroupCapacity('MemoryNodegroup', {
        minSize: 1,
        instanceTypes: [ec2.InstanceType.of(ec2.InstanceClass.R5, ec2.InstanceSize.XLARGE)],
        labels: { workload: 'memory-intensive' },
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::EKS::Cluster', {
        ComputeConfig: {
          Enabled: true,
          NodePools: ['system', 'general-purpose'],
        },
      });

      template.resourceCountIs('AWS::EKS::Nodegroup', 2);
      // cluster should support auto mode
      template.hasResourceProperties('AWS::EKS::Cluster', {
        ComputeConfig: {
          Enabled: true,
          NodePools: ['system', 'general-purpose'],
        },
        StorageConfig: {
          BlockStorage: {
            Enabled: true,
          },
        },
        KubernetesNetworkConfig: {
          ElasticLoadBalancing: {
            Enabled: true,
          },
        },
      });
      // as well as nodegroups
      template.hasResourceProperties('AWS::EKS::Nodegroup', {
        ScalingConfig: { MinSize: 1 },
        InstanceTypes: ['c5.xlarge'],
        Labels: { workload: 'cpu-intensive' },
      });

      template.hasResourceProperties('AWS::EKS::Nodegroup', {
        ScalingConfig: { MinSize: 1 },
        InstanceTypes: ['r5.xlarge'],
        Labels: { workload: 'memory-intensive' },
      });
    });
  });
});
