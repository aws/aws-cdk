import { Template, Match } from 'aws-cdk-lib/assertions';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as eks from '../lib';
import { testFixtureNoVpc } from './util';

const CLUSTER_VERSION = eks.KubernetesVersion.V1_32;

describe('eks auto mode', () => {
  describe('auto mode and defaultCapacity interactions', () => {
    test('Case 1: autoMode implicitly on (undefined), no defaultCapacity* defined', () => {
      // GIVEN
      const { stack } = testFixtureNoVpc();

      // WHEN
      new eks.Cluster(stack, 'Cluster', {
        version: CLUSTER_VERSION,
        // defaultCapacityType is undefined (implicitly AUTOMODE)
        // no defaultCapacity* properties
      });

      // THEN
      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::EKS::Cluster', {
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

      // Verify no nodegroups are created
      template.resourceCountIs('AWS::EKS::Nodegroup', 0);
      template.resourceCountIs('AWS::AutoScaling::AutoScalingGroup', 0);
    });

    test('Case 2: autoMode explicitly on, no defaultCapacity* defined', () => {
      // GIVEN
      const { stack } = testFixtureNoVpc();

      // WHEN
      new eks.Cluster(stack, 'Cluster', {
        version: CLUSTER_VERSION,
        defaultCapacityType: eks.DefaultCapacityType.AUTOMODE,
      });

      // THEN
      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::EKS::Cluster', {
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

      // Verify no nodegroups are created
      template.resourceCountIs('AWS::EKS::Nodegroup', 0);
      template.resourceCountIs('AWS::AutoScaling::AutoScalingGroup', 0);
    });

    test('Case 3: autoMode implicitly on (undefined), defaultCapacity defined', () => {
      // GIVEN
      const { stack } = testFixtureNoVpc();

      // WHEN/THEN
      expect(() => {
        new eks.Cluster(stack, 'Cluster', {
          version: CLUSTER_VERSION,
          // defaultCapacityType undefined (implicitly AUTOMODE)
          defaultCapacity: 2,
        });
      }).toThrow(/Cannot specify defaultCapacity or defaultCapacityInstance when using Auto Mode. Auto Mode manages compute resources automatically./);
    });

    test('Case 4: defaultCapacityType AUTOMODE with defaultCapacity throws error', () => {
      // GIVEN
      const { stack } = testFixtureNoVpc();

      // WHEN/THEN
      expect(() => {
        new eks.Cluster(stack, 'Cluster', {
          version: CLUSTER_VERSION,
          defaultCapacityType: eks.DefaultCapacityType.AUTOMODE,
          defaultCapacity: 2,
        });
      }).toThrow(/Cannot specify defaultCapacity or defaultCapacityInstance when using Auto Mode. Auto Mode manages compute resources automatically./);
    });

    test('Case 5: defaultCapacityType AUTOMODE with defaultCapacityInstance throws error', () => {
      // GIVEN
      const { stack } = testFixtureNoVpc();

      // WHEN/THEN
      expect(() => {
        new eks.Cluster(stack, 'Cluster', {
          version: CLUSTER_VERSION,
          defaultCapacityType: eks.DefaultCapacityType.AUTOMODE,
          defaultCapacityInstance: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.LARGE),
        });
      }).toThrow(/Cannot specify defaultCapacity or defaultCapacityInstance when using Auto Mode. Auto Mode manages compute resources automatically./);
    });

    test('Case 6: defaultCapacityType NODEGROUP, defaultCapacity defined', () => {
      // GIVEN
      const { stack } = testFixtureNoVpc();

      // WHEN
      new eks.Cluster(stack, 'Cluster', {
        version: CLUSTER_VERSION,
        defaultCapacityType: eks.DefaultCapacityType.NODEGROUP,
        defaultCapacity: 3,
        defaultCapacityInstance: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.LARGE),
      });

      // THEN
      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::EKS::Cluster', {
        ComputeConfig: {
          Enabled: false,
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

      // Verify nodegroup is created with specified configuration
      template.hasResourceProperties('AWS::EKS::Nodegroup', {
        ScalingConfig: {
          DesiredSize: 3,
          MinSize: 3,
        },
        InstanceTypes: ['t3.large'],
      });
    });

    test('Case 7: defaultCapacityType EC2, no defaultCapacity - cluster only', () => {
      // GIVEN
      const { stack } = testFixtureNoVpc();

      // WHEN
      new eks.Cluster(stack, 'Cluster', {
        version: CLUSTER_VERSION,
        defaultCapacityType: eks.DefaultCapacityType.EC2,
      });

      // THEN
      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::EKS::Cluster', {
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

      // Verify no nodegroup resources are created
      template.resourceCountIs('AWS::EKS::Nodegroup', 0);
    });

    test('validates node pool values', () => {
      // GIVEN
      const { stack } = testFixtureNoVpc();

      // WHEN/THEN
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
      // GIVEN
      const { stack } = testFixtureNoVpc();

      // WHEN/THEN
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

    test('accepts valid node pool values in any order', () => {
      // GIVEN
      const { stack } = testFixtureNoVpc();

      // WHEN
      new eks.Cluster(stack, 'Cluster', {
        version: CLUSTER_VERSION,
        defaultCapacityType: eks.DefaultCapacityType.AUTOMODE,
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
        defaultCapacityType: eks.DefaultCapacityType.AUTOMODE,
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

    test('verifies node role has required managed policies in auto mode', () => {
      // GIVEN
      const { stack } = testFixtureNoVpc();
      const customRole = new iam.Role(stack, 'CustomRole', {
        assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
      });

      // WHEN
      new eks.Cluster(stack, 'Cluster', {
        version: CLUSTER_VERSION,
        defaultCapacityType: eks.DefaultCapacityType.AUTOMODE,
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
        defaultCapacityType: eks.DefaultCapacityType.AUTOMODE,
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
  });

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
      defaultCapacityType: eks.DefaultCapacityType.AUTOMODE,
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

  test('auto mode configures node pools in correct order', () => {
    // GIVEN
    const { stack } = testFixtureNoVpc();

    // WHEN
    new eks.Cluster(stack, 'Cluster', {
      version: CLUSTER_VERSION,
      defaultCapacityType: eks.DefaultCapacityType.AUTOMODE,
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
        defaultCapacityType: eks.DefaultCapacityType.AUTOMODE,
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
        defaultCapacityType: eks.DefaultCapacityType.AUTOMODE,
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
      defaultCapacityType: eks.DefaultCapacityType.AUTOMODE,
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
      defaultCapacityType: eks.DefaultCapacityType.AUTOMODE,
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

  test('validates network configuration in auto mode', () => {
    // GIVEN
    const { stack } = testFixtureNoVpc();

    // WHEN
    new eks.Cluster(stack, 'Cluster', {
      version: CLUSTER_VERSION,
      defaultCapacityType: eks.DefaultCapacityType.AUTOMODE,
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
      defaultCapacityType: eks.DefaultCapacityType.AUTOMODE,
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
      defaultCapacityType: eks.DefaultCapacityType.AUTOMODE,
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

  test.each([
    {
      name: 'defaultCapacity with AUTOMODE',
      props: {
        defaultCapacityType: eks.DefaultCapacityType.AUTOMODE,
        defaultCapacity: 2,
      },
    },
    {
      name: 'defaultCapacityInstance with AUTOMODE',
      props: {
        defaultCapacityType: eks.DefaultCapacityType.AUTOMODE,
        defaultCapacityInstance: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MEDIUM),
      },
    },
    {
      name: 'defaultCapacity and defaultCapacityInstance with AUTOMODE',
      props: {
        defaultCapacityType: eks.DefaultCapacityType.AUTOMODE,
        defaultCapacityInstance: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MEDIUM),
      },
    },
  ])('throws when $name is set', ({ props }) => {
    // GIVEN
    const { stack } = testFixtureNoVpc();

    // WHEN/THEN
    expect(() => {
      new eks.Cluster(stack, 'Cluster', {
        version: CLUSTER_VERSION,
        ...props,
      });
    }).toThrow(/Cannot specify defaultCapacity or defaultCapacityInstance when using Auto Mode. Auto Mode manages compute resources automatically./);
  });

  describe('auto mode and/or nodegroup scenarios', () => {
    test('Scenario 1: Auto Mode Only (Default)', () => {
      // GIVEN
      const { stack } = testFixtureNoVpc();

      // WHEN
      new eks.Cluster(stack, 'Cluster', {
        version: CLUSTER_VERSION,
        // defaultCapacityType: eks.DefaultCapacityType.AUTOMODE is default, no need to specify
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

      // Verify no nodegroups or ASGs are created
      Template.fromStack(stack).resourceCountIs('AWS::EKS::Nodegroup', 0);
      Template.fromStack(stack).resourceCountIs('AWS::AutoScaling::AutoScalingGroup', 0);
    });

    describe('Scenario 2: Traditional Node Groups', () => {
      test('creates default nodegroup when defaultCapacity is defined', () => {
        // GIVEN
        const { stack } = testFixtureNoVpc();

        // WHEN
        new eks.Cluster(stack, 'Cluster', {
          version: CLUSTER_VERSION,
          defaultCapacityType: eks.DefaultCapacityType.NODEGROUP,
          defaultCapacity: 3, // Only specify defaultCapacity
        });

        // THEN
        const template = Template.fromStack(stack);
        // Verify Auto Mode is disabled
        template.hasResourceProperties('AWS::EKS::Cluster', {
          ComputeConfig: {
            Enabled: false,
          },
        });

        // Verify default nodegroup is created with correct configuration
        template.hasResourceProperties('AWS::EKS::Nodegroup', {
          ScalingConfig: {
            DesiredSize: 3,
            MinSize: 3,
          },
          InstanceTypes: Match.arrayWith(['m5.large']), // Default instance type
        });
      });

      test('creates default nodegroup when defaultCapacityType is defined', () => {
        // GIVEN
        const { stack } = testFixtureNoVpc();

        // WHEN
        new eks.Cluster(stack, 'Cluster', {
          version: CLUSTER_VERSION,
          defaultCapacityType: eks.DefaultCapacityType.NODEGROUP, // Only specify defaultCapacityType
        });

        // THEN
        const template = Template.fromStack(stack);
        // Verify Auto Mode is disabled
        template.hasResourceProperties('AWS::EKS::Cluster', {
          ComputeConfig: {
            Enabled: false,
          },
        });

        // Verify default nodegroup is created with default values
        template.hasResourceProperties('AWS::EKS::Nodegroup', {
          ScalingConfig: {
            DesiredSize: 2, // Default capacity count
            MinSize: 2,
          },
          InstanceTypes: Match.arrayWith(['m5.large']), // Default instance type
        });
      });

      test('creates default nodegroup with all defaultCapacity* properties', () => {
        // GIVEN
        const { stack } = testFixtureNoVpc();

        // WHEN
        new eks.Cluster(stack, 'Cluster', {
          version: CLUSTER_VERSION,
          defaultCapacity: 4,
          defaultCapacityType: eks.DefaultCapacityType.NODEGROUP,
          defaultCapacityInstance: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.LARGE),
        });

        // THEN
        const template = Template.fromStack(stack);
        // Verify Auto Mode is disabled
        template.hasResourceProperties('AWS::EKS::Cluster', {
          ComputeConfig: {
            Enabled: false,
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

        // Verify default nodegroup is created with all specified properties
        template.hasResourceProperties('AWS::EKS::Nodegroup', {
          ScalingConfig: {
            DesiredSize: 4,
            MinSize: 4,
          },
          InstanceTypes: ['t3.large'],
        });
      });

      test('no default capacity is created when defaultCapacity is 0', () => {
        // GIVEN
        const { stack } = testFixtureNoVpc();

        // WHEN
        new eks.Cluster(stack, 'Cluster', {
          version: CLUSTER_VERSION,
          defaultCapacity: 0,
          defaultCapacityType: eks.DefaultCapacityType.NODEGROUP,
          defaultCapacityInstance: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MEDIUM),
        });

        // THEN
        const template = Template.fromStack(stack);
        // Verify Auto Mode is disabled
        template.hasResourceProperties('AWS::EKS::Cluster', {
          ComputeConfig: {
            Enabled: false,
          },
        });

        // Verify no capacity resources are created
        template.resourceCountIs('AWS::EKS::Nodegroup', 0);
        template.resourceCountIs('AWS::AutoScaling::AutoScalingGroup', 0);
      });
    });

    test('Scenario 3: Hybrid Mode - Auto Mode with explicit Node Groups', () => {
      // GIVEN
      const { stack } = testFixtureNoVpc();

      // WHEN
      const cluster = new eks.Cluster(stack, 'Cluster', {
        version: CLUSTER_VERSION,
        // defaultCapacityType: eks.DefaultCapacityType.AUTOMODE is default
      });

      // Add an explicit nodegroup
      cluster.addNodegroupCapacity('ExtraNodegroup', {
        minSize: 1,
        maxSize: 3,
        instanceTypes: [ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.LARGE)],
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

      // Verify both Auto Mode and explicit nodegroup exist
      Template.fromStack(stack).hasResourceProperties('AWS::EKS::Nodegroup', {
        ScalingConfig: {
          MinSize: 1,
          MaxSize: 3,
        },
        InstanceTypes: ['t3.large'],
      });
    });

    test('Scenario 4: Manual Node Group Management', () => {
      // GIVEN
      const { stack } = testFixtureNoVpc();

      // WHEN
      const cluster = new eks.Cluster(stack, 'Cluster', {
        version: CLUSTER_VERSION,
        defaultCapacityType: eks.DefaultCapacityType.NODEGROUP,
        defaultCapacity: 0, // No default capacity
      });

      // Add two manually managed nodegroups
      cluster.addNodegroupCapacity('Nodegroup1', {
        minSize: 1,
        instanceTypes: [ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.LARGE)],
      });

      cluster.addNodegroupCapacity('Nodegroup2', {
        minSize: 2,
        instanceTypes: [ec2.InstanceType.of(ec2.InstanceClass.C5, ec2.InstanceSize.XLARGE)],
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::EKS::Cluster', {
        ComputeConfig: {
          Enabled: false,
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

      // Verify both manually added nodegroups exist with correct configurations
      const template = Template.fromStack(stack);
      template.resourceCountIs('AWS::EKS::Nodegroup', 2);

      template.hasResourceProperties('AWS::EKS::Nodegroup', {
        ScalingConfig: {
          MinSize: 1,
        },
        InstanceTypes: ['m5.large'],
      });

      template.hasResourceProperties('AWS::EKS::Nodegroup', {
        ScalingConfig: {
          MinSize: 2,
        },
        InstanceTypes: ['c5.xlarge'],
      });
    });

    test('Scenario 3: Hybrid Mode - verifies Auto Mode and Node Groups can coexist', () => {
      // GIVEN
      const { stack } = testFixtureNoVpc();

      // WHEN
      const cluster = new eks.Cluster(stack, 'Cluster', {
        version: CLUSTER_VERSION,
        defaultCapacityType: eks.DefaultCapacityType.AUTOMODE,
        compute: {
          nodePools: ['system', 'general-purpose'],
        },
      });

      // Add multiple nodegroups with different configurations
      cluster.addNodegroupCapacity('CpuNodegroup', {
        minSize: 1,
        instanceTypes: [ec2.InstanceType.of(ec2.InstanceClass.C5, ec2.InstanceSize.XLARGE)],
        labels: {
          workload: 'cpu-intensive',
        },
      });

      cluster.addNodegroupCapacity('MemoryNodegroup', {
        minSize: 1,
        instanceTypes: [ec2.InstanceType.of(ec2.InstanceClass.R5, ec2.InstanceSize.XLARGE)],
        labels: {
          workload: 'memory-intensive',
        },
      });

      // THEN
      const template = Template.fromStack(stack);

      // Verify Auto Mode configuration
      template.hasResourceProperties('AWS::EKS::Cluster', {
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

      // Verify both nodegroups exist with correct configurations
      template.resourceCountIs('AWS::EKS::Nodegroup', 2);

      template.hasResourceProperties('AWS::EKS::Nodegroup', {
        ScalingConfig: {
          MinSize: 1,
        },
        InstanceTypes: ['c5.xlarge'],
        Labels: {
          workload: 'cpu-intensive',
        },
      });

      template.hasResourceProperties('AWS::EKS::Nodegroup', {
        ScalingConfig: {
          MinSize: 1,
        },
        InstanceTypes: ['r5.xlarge'],
        Labels: {
          workload: 'memory-intensive',
        },
      });
    });
  });
});
