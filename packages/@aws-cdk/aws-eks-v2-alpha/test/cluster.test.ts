import * as fs from 'fs';
import * as path from 'path';
import * as cdk8s from 'cdk8s';
import { Construct } from 'constructs';
import * as YAML from 'yaml';
import { KubectlV33Layer } from '@aws-cdk/lambda-layer-kubectl-v33';
import { testFixture, testFixtureNoVpc } from './util';
import { Match, Template } from 'aws-cdk-lib/assertions';
import * as asg from 'aws-cdk-lib/aws-autoscaling';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib/core';
import * as eks from '../lib';
import { HelmChart } from '../lib';
import { KubectlProvider } from '../lib/kubectl-provider';
import { BottleRocketImage } from '../lib/private/bottlerocket';

/* eslint-disable max-len */

const CLUSTER_VERSION = eks.KubernetesVersion.V1_33;
const commonProps = {
  version: CLUSTER_VERSION,
  defaultCapacity: 0,
  defaultCapacityType: eks.DefaultCapacityType.NODEGROUP,
};

describe('cluster', () => {
  test('can configure and access ALB controller', () => {
    const { stack } = testFixture();

    const cluster = new eks.Cluster(stack, 'Cluster', {
      version: CLUSTER_VERSION,
      albController: {
        version: eks.AlbControllerVersion.V2_4_1,
      },
      kubectlProviderOptions: {
        kubectlLayer: new KubectlV33Layer(stack, 'kubectlLayer'),
      },
    });

    Template.fromStack(stack).hasResourceProperties('Custom::AWSCDK-EKS-HelmChart', {
      Chart: 'aws-load-balancer-controller',
    });
    expect(cluster.albController).toBeDefined();
  });

  describe('imported Vpc from unparseable list tokens', () => {
    let stack: cdk.Stack;
    let vpc: ec2.IVpc;

    beforeEach(() => {
      stack = new cdk.Stack();
      const vpcId = cdk.Fn.importValue('myVpcId');
      const availabilityZones = cdk.Fn.split(',', cdk.Fn.importValue('myAvailabilityZones'));
      const publicSubnetIds = cdk.Fn.split(',', cdk.Fn.importValue('myPublicSubnetIds'));
      const privateSubnetIds = cdk.Fn.split(',', cdk.Fn.importValue('myPrivateSubnetIds'));
      const isolatedSubnetIds = cdk.Fn.split(',', cdk.Fn.importValue('myIsolatedSubnetIds'));

      vpc = ec2.Vpc.fromVpcAttributes(stack, 'importedVpc', {
        vpcId,
        availabilityZones,
        publicSubnetIds,
        privateSubnetIds,
        isolatedSubnetIds,
      });
    });

    test('throws if selecting more than one subnet group', () => {
      expect(() => new eks.Cluster(stack, 'Cluster', {
        vpc: vpc,
        vpcSubnets: [{ subnetType: ec2.SubnetType.PUBLIC }, { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS }],
        ...commonProps,
      })).toThrow(/cannot select multiple subnet groups/);
    });

    test('synthesis works if only one subnet group is selected', () => {
      // WHEN
      new eks.Cluster(stack, 'Cluster', {
        vpc: vpc,
        vpcSubnets: [{ subnetType: ec2.SubnetType.PUBLIC }],
        ...commonProps,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::EKS::Cluster', {
        ResourcesVpcConfig: {
          SubnetIds: {
            'Fn::Split': [
              ',',
              { 'Fn::ImportValue': 'myPublicSubnetIds' },
            ],
          },
        },
      });
    });
  });

  test('throws when accessing cluster security group for imported cluster without cluster security group id', () => {
    const { stack } = testFixture();

    const cluster = eks.Cluster.fromClusterAttributes(stack, 'Cluster', {
      clusterName: 'cluster',
    });

    expect(() => cluster.clusterSecurityGroup).toThrow(/"clusterSecurityGroup" is not defined for this imported cluster/);
  });

  test('can access cluster security group for imported cluster with cluster security group id', () => {
    const { stack } = testFixture();

    const clusterSgId = 'cluster-sg-id';

    const cluster = eks.Cluster.fromClusterAttributes(stack, 'Cluster', {
      clusterName: 'cluster',
      clusterSecurityGroupId: clusterSgId,
    });

    const clusterSg = cluster.clusterSecurityGroup;

    expect(clusterSg.securityGroupId).toEqual(clusterSgId);
  });

  test('cluster security group is attached when adding self-managed nodes', () => {
    // GIVEN
    const { stack, vpc } = testFixture();
    const cluster = new eks.Cluster(stack, 'Cluster', {
      vpc,
      ...commonProps,
      prune: false,
    });

    // WHEN
    cluster.addAutoScalingGroupCapacity('self-managed', {
      instanceType: new ec2.InstanceType('t2.medium'),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LaunchConfiguration', {
      SecurityGroups: [
        { 'Fn::GetAtt': ['ClusterselfmanagedInstanceSecurityGroup64468C3A', 'GroupId'] },
        { 'Fn::GetAtt': ['ClusterEB0386A7', 'ClusterSecurityGroupId'] },
      ],
    });
  });

  test('security group of self-managed asg is not tagged with owned', () => {
    // GIVEN
    const { stack, vpc } = testFixture();
    const cluster = new eks.Cluster(stack, 'Cluster', {
      vpc,
      ...commonProps,
    });

    // WHEN
    cluster.addAutoScalingGroupCapacity('self-managed', {
      instanceType: new ec2.InstanceType('t2.medium'),
    });

    let template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::EC2::SecurityGroup', {
      Tags: [{ Key: 'Name', Value: 'Stack/Cluster/self-managed' }],
    });
  });

  test('connect autoscaling group with imported cluster', () => {
    // GIVEN
    const { stack, vpc } = testFixture();
    const cluster = new eks.Cluster(stack, 'Cluster', {
      vpc,
      ...commonProps,
      prune: false,
    });

    const importedCluster = eks.Cluster.fromClusterAttributes(stack, 'ImportedCluster', {
      clusterName: cluster.clusterName,
      clusterSecurityGroupId: cluster.clusterSecurityGroupId,
    });

    const selfManaged = new asg.AutoScalingGroup(stack, 'self-managed', {
      instanceType: new ec2.InstanceType('t2.medium'),
      vpc: vpc,
      machineImage: new ec2.AmazonLinuxImage(),
    });

    // WHEN
    importedCluster.connectAutoScalingGroupCapacity(selfManaged, {});

    Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LaunchConfiguration', {
      SecurityGroups: [
        { 'Fn::GetAtt': ['selfmanagedInstanceSecurityGroupEA6D80C9', 'GroupId'] },
        { 'Fn::GetAtt': ['ClusterEB0386A7', 'ClusterSecurityGroupId'] },
      ],
    });
  });

  test('cluster security group is attached when connecting self-managed nodes', () => {
    // GIVEN
    const { stack, vpc } = testFixture();
    const cluster = new eks.Cluster(stack, 'Cluster', {
      vpc,
      ...commonProps,
      prune: false,
    });

    const selfManaged = new asg.AutoScalingGroup(stack, 'self-managed', {
      instanceType: new ec2.InstanceType('t2.medium'),
      vpc: vpc,
      machineImage: new ec2.AmazonLinuxImage(),
    });

    // WHEN
    cluster.connectAutoScalingGroupCapacity(selfManaged, {});

    Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LaunchConfiguration', {
      SecurityGroups: [
        { 'Fn::GetAtt': ['selfmanagedInstanceSecurityGroupEA6D80C9', 'GroupId'] },
        { 'Fn::GetAtt': ['ClusterEB0386A7', 'ClusterSecurityGroupId'] },
      ],
    });
  });

  test('throws when a non cdk8s chart construct is added as cdk8s chart', () => {
    const { stack } = testFixture();

    const cluster = new eks.Cluster(stack, 'Cluster', {
      ...commonProps,
      prune: false,
    });

    // create a plain construct, not a cdk8s chart
    const someConstruct = new Construct(stack, 'SomeConstruct');

    expect(() => cluster.addCdk8sChart('chart', someConstruct)).toThrow(/Invalid cdk8s chart. Must contain a \'toJson\' method, but found undefined/);
  });

  test('cdk8s chart can be added to cluster', () => {
    const { stack } = testFixture();

    const cluster = new eks.Cluster(stack, 'Cluster', {
      ...commonProps,
      prune: false,
      kubectlProviderOptions: {
        kubectlLayer: new KubectlV33Layer(stack, 'kubectlLayer'),
      },
    });

    const app = new cdk8s.App();
    const chart = new cdk8s.Chart(app, 'Chart');

    new cdk8s.ApiObject(chart, 'FakePod', {
      apiVersion: 'v1',
      kind: 'Pod',
      metadata: {
        name: 'fake-pod',
        labels: {
          // adding aws-cdk token to cdk8s chart
          clusterName: cluster.clusterName,
        },
      },
    });

    cluster.addCdk8sChart('cdk8s-chart', chart);

    Template.fromStack(stack).hasResourceProperties('Custom::AWSCDK-EKS-KubernetesResource', {
      Manifest: {
        'Fn::Join': [
          '',
          [
            '[{"apiVersion":"v1","kind":"Pod","metadata":{"labels":{"clusterName":"',
            {
              Ref: 'ClusterEB0386A7',
            },
            '"},"name":"fake-pod"}}]',
          ],
        ],
      },
    });
  });

  test('cluster connections include both control plane and cluster security group', () => {
    const { stack } = testFixture();

    const cluster = new eks.Cluster(stack, 'Cluster', {
      ...commonProps,
      prune: false,
    });

    expect(cluster.connections.securityGroups.map(sg => stack.resolve(sg.securityGroupId))).toEqual([
      { 'Fn::GetAtt': ['ClusterEB0386A7', 'ClusterSecurityGroupId'] },
      { 'Fn::GetAtt': ['ClusterControlPlaneSecurityGroupD274242C', 'GroupId'] },
    ]);
  });

  test('can declare a security group from a different stack', () => {
    class ClusterStack extends cdk.Stack {
      public eksCluster: eks.Cluster;

      constructor(scope: Construct, id: string, props: { sg: ec2.ISecurityGroup; vpc: ec2.IVpc }) {
        super(scope, id);
        this.eksCluster = new eks.Cluster(this, 'Cluster', {
          ...commonProps,
          prune: false,
          securityGroup: props.sg,
          vpc: props.vpc,
        });
      }
    }

    class NetworkStack extends cdk.Stack {
      public readonly securityGroup: ec2.ISecurityGroup;
      public readonly vpc: ec2.IVpc;

      constructor(scope: Construct, id: string) {
        super(scope, id);
        this.vpc = new ec2.Vpc(this, 'Vpc');
        this.securityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', { vpc: this.vpc });
      }
    }

    const { app } = testFixture();
    const networkStack = new NetworkStack(app, 'NetworkStack');
    new ClusterStack(app, 'ClusterStack', { sg: networkStack.securityGroup, vpc: networkStack.vpc });

    // make sure we can synth (no circular dependencies between the stacks)
    app.synth();
  });

  test('can declare a manifest with a token from a different stack than the cluster that depends on the cluster stack', () => {
    class ClusterStack extends cdk.Stack {
      public eksCluster: eks.Cluster;

      constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        this.eksCluster = new eks.Cluster(this, 'Cluster', {
          ...commonProps,
          prune: false,
          kubectlProviderOptions: {
            kubectlLayer: new KubectlV33Layer(this, 'kubectlLayer'),
          },
        });
      }
    }

    class ManifestStack extends cdk.Stack {
      constructor(scope: Construct, id: string, props: cdk.StackProps & { cluster: eks.Cluster }) {
        super(scope, id, props);

        // this role creates a dependency between this stack and the cluster stack
        const role = new iam.Role(this, 'CrossRole', {
          assumedBy: new iam.ServicePrincipal('sqs.amazonaws.com'),
          roleName: props.cluster.clusterArn,
        });

        // make sure this manifest doesn't create a dependency between the cluster stack
        // and this stack
        new eks.KubernetesManifest(this, 'cross-stack', {
          manifest: [{
            kind: 'ConfigMap',
            apiVersion: 'v1',
            metadata: {
              name: 'config-map',
            },
            data: {
              foo: role.roleArn,
            },
          }],
          cluster: props.cluster,
        });
      }
    }

    const { app } = testFixture();
    const clusterStack = new ClusterStack(app, 'ClusterStack');
    new ManifestStack(app, 'ManifestStack', { cluster: clusterStack.eksCluster });

    // make sure we can synth (no circular dependencies between the stacks)
    app.synth();
  });

  test('can declare a chart with a token from a different stack than the cluster that depends on the cluster stack', () => {
    class ClusterStack extends cdk.Stack {
      public eksCluster: eks.Cluster;

      constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        this.eksCluster = new eks.Cluster(this, 'Cluster', {
          version: CLUSTER_VERSION,
          prune: false,
          kubectlProviderOptions: {
            kubectlLayer: new KubectlV33Layer(this, 'kubectlLayer'),
          },
        });
      }
    }

    class ChartStack extends cdk.Stack {
      constructor(scope: Construct, id: string, props: cdk.StackProps & { cluster: eks.Cluster }) {
        super(scope, id, props);

        // this role creates a dependency between this stack and the cluster stack
        const role = new iam.Role(this, 'CrossRole', {
          assumedBy: new iam.ServicePrincipal('sqs.amazonaws.com'),
          roleName: props.cluster.clusterArn,
        });

        // make sure this chart doesn't create a dependency between the cluster stack
        // and this stack
        new eks.HelmChart(this, 'cross-stack', {
          chart: role.roleArn,
          cluster: props.cluster,
        });
      }
    }

    const { app } = testFixture();
    const clusterStack = new ClusterStack(app, 'ClusterStack');
    new ChartStack(app, 'ChartStack', { cluster: clusterStack.eksCluster });

    // make sure we can synth (no circular dependencies between the stacks)
    app.synth();
  });

  test('can declare a HelmChart in a different stack than the cluster', () => {
    class ClusterStack extends cdk.Stack {
      public eksCluster: eks.Cluster;

      constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        this.eksCluster = new eks.Cluster(this, 'Cluster', {
          version: CLUSTER_VERSION,
          prune: false,
          kubectlProviderOptions: {
            kubectlLayer: new KubectlV33Layer(this, 'kubectlLayer'),
          },
        });
      }
    }

    class ChartStack extends cdk.Stack {
      constructor(scope: Construct, id: string, props: cdk.StackProps & { cluster: eks.Cluster }) {
        super(scope, id, props);

        const resource = new cdk.CfnResource(this, 'resource', { type: 'MyType' });
        new eks.HelmChart(this, `chart-${id}`, { cluster: props.cluster, chart: resource.ref });
      }
    }

    const { app } = testFixture();
    const clusterStack = new ClusterStack(app, 'ClusterStack');
    new ChartStack(app, 'ChartStack', { cluster: clusterStack.eksCluster });

    // make sure we can synth (no circular dependencies between the stacks)
    app.synth();
  });

  test('can declare a ServiceAccount in a different stack than the cluster', () => {
    class ClusterStack extends cdk.Stack {
      public eksCluster: eks.Cluster;

      constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        this.eksCluster = new eks.Cluster(this, 'EKSCluster', {
          version: CLUSTER_VERSION,
          prune: false,
          kubectlProviderOptions: {
            kubectlLayer: new KubectlV33Layer(this, 'kubectlLayer'),
          },
        });
      }
    }

    class AppStack extends cdk.Stack {
      constructor(scope: Construct, id: string, props: cdk.StackProps & { cluster: eks.Cluster }) {
        super(scope, id, props);

        new eks.ServiceAccount(this, 'testAccount', { cluster: props.cluster, name: 'test-account', namespace: 'test' });
      }
    }

    const { app } = testFixture();
    const clusterStack = new ClusterStack(app, 'EKSCluster');
    new AppStack(app, 'KubeApp', { cluster: clusterStack.eksCluster });

    // make sure we can synth (no circular dependencies between the stacks)
    app.synth();
  });

  test('a default cluster spans all subnets', () => {
    // GIVEN
    const { stack, vpc } = testFixture();

    // WHEN
    new eks.Cluster(stack, 'Cluster', { vpc, ...commonProps, prune: false });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EKS::Cluster', {
      RoleArn: { 'Fn::GetAtt': ['ClusterRoleFA261979', 'Arn'] },
      Version: CLUSTER_VERSION.version,
      ResourcesVpcConfig: {
        SecurityGroupIds: [{ 'Fn::GetAtt': ['ClusterControlPlaneSecurityGroupD274242C', 'GroupId'] }],
        SubnetIds: [
          { Ref: 'VPCPublicSubnet1SubnetB4246D30' },
          { Ref: 'VPCPublicSubnet2Subnet74179F39' },
          { Ref: 'VPCPrivateSubnet1Subnet8BCA10E0' },
          { Ref: 'VPCPrivateSubnet2SubnetCFCDAA7A' },
        ],
      },
    });
  });

  test('if "vpc" is not specified, vpc with default configuration will be created', () => {
    // GIVEN
    const { stack } = testFixtureNoVpc();

    // WHEN
    new eks.Cluster(stack, 'cluster', { version: CLUSTER_VERSION, prune: false });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPC', Match.anyValue());
  });

  describe('no default capacity as auto mode is implicitly enabled', () => {
    test('no default capacity by default', () => {
      // GIVEN
      const { stack } = testFixtureNoVpc();

      // WHEN
      const cluster = new eks.Cluster(stack, 'cluster', { version: CLUSTER_VERSION, prune: false });

      // THEN
      expect(cluster.defaultNodegroup).toBeUndefined();
      Template.fromStack(stack).resourceCountIs('AWS::EKS::Nodegroup', 0);
    });

    test('quantity and type can be customized', () => {
      // GIVEN
      const { stack } = testFixtureNoVpc();

      // WHEN
      const cluster = new eks.Cluster(stack, 'cluster', {
        defaultCapacityType: eks.DefaultCapacityType.NODEGROUP,
        defaultCapacity: 10,
        defaultCapacityInstance: new ec2.InstanceType('m2.xlarge'),
        version: CLUSTER_VERSION,
        prune: false,
      });

      // THEN
      expect(cluster.defaultNodegroup).toBeDefined();
      Template.fromStack(stack).hasResourceProperties('AWS::EKS::Nodegroup', {
        ScalingConfig: {
          DesiredSize: 10,
          MaxSize: 10,
          MinSize: 10,
        },
      });
      // expect(stack).toHaveResource('AWS::AutoScaling::LaunchConfiguration', { InstanceType: 'm2.xlarge' }));
    });

    test('defaultCapacity=0 will not allocate at all', () => {
      // GIVEN
      const { stack } = testFixtureNoVpc();

      // WHEN
      const cluster = new eks.Cluster(stack, 'cluster', {
        ...commonProps,
        prune: false,
      });

      // THEN
      expect(cluster.defaultCapacity).toBeUndefined();
      Template.fromStack(stack).resourceCountIs('AWS::AutoScaling::AutoScalingGroup', 0);
      Template.fromStack(stack).resourceCountIs('AWS::AutoScaling::LaunchConfiguration', 0);
    });
  });

  test('creating a cluster tags the private VPC subnets', () => {
    // GIVEN
    const { stack, vpc } = testFixture();

    // WHEN
    new eks.Cluster(stack, 'Cluster', {
      vpc,
      ...commonProps,
      prune: false,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::Subnet', {
      Tags: [
        { Key: 'aws-cdk:subnet-name', Value: 'Private' },
        { Key: 'aws-cdk:subnet-type', Value: 'Private' },
        { Key: 'kubernetes.io/role/internal-elb', Value: '1' },
        { Key: 'Name', Value: 'Stack/VPC/PrivateSubnet1' },
      ],
    });
  });

  test('creating a cluster tags the public VPC subnets', () => {
    // GIVEN
    const { stack, vpc } = testFixture();

    // WHEN
    new eks.Cluster(stack, 'Cluster', {
      vpc,
      ...commonProps,
      prune: false,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::Subnet', {
      MapPublicIpOnLaunch: true,
      Tags: [
        { Key: 'aws-cdk:subnet-name', Value: 'Public' },
        { Key: 'aws-cdk:subnet-type', Value: 'Public' },
        { Key: 'kubernetes.io/role/elb', Value: '1' },
        { Key: 'Name', Value: 'Stack/VPC/PublicSubnet1' },
      ],
    });
  });

  test('adding capacity creates an ASG without a rolling update policy', () => {
    // GIVEN
    const { stack, vpc } = testFixture();
    const cluster = new eks.Cluster(stack, 'Cluster', {
      vpc,
      ...commonProps,
      prune: false,
    });

    // WHEN
    cluster.addAutoScalingGroupCapacity('Default', {
      instanceType: new ec2.InstanceType('t2.medium'),
    });

    Template.fromStack(stack).hasResource('AWS::AutoScaling::AutoScalingGroup', {
      UpdatePolicy: { AutoScalingScheduledAction: { IgnoreUnmodifiedGroupSizeProperties: true } },
    });
  });

  test('adding capacity creates an ASG with tags', () => {
    // GIVEN
    const { stack, vpc } = testFixture();
    const cluster = new eks.Cluster(stack, 'Cluster', {
      vpc,
      ...commonProps,
      prune: false,
    });

    // WHEN
    cluster.addAutoScalingGroupCapacity('Default', {
      instanceType: new ec2.InstanceType('t2.medium'),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::AutoScalingGroup', {
      Tags: [
        {
          Key: { 'Fn::Join': ['', ['kubernetes.io/cluster/', { Ref: 'ClusterEB0386A7' }]] },
          PropagateAtLaunch: true,
          Value: 'owned',
        },
        {
          Key: 'Name',
          PropagateAtLaunch: true,
          Value: 'Stack/Cluster/Default',
        },
      ],
    });
  });

  test('create nodegroup with existing role', () => {
    // GIVEN
    const { stack } = testFixtureNoVpc();

    // WHEN
    const cluster = new eks.Cluster(stack, 'cluster', {
      defaultCapacityType: eks.DefaultCapacityType.NODEGROUP,
      defaultCapacity: 10,
      defaultCapacityInstance: new ec2.InstanceType('m2.xlarge'),
      version: CLUSTER_VERSION,
      prune: false,
    });

    const existingRole = new iam.Role(stack, 'ExistingRole', {
      assumedBy: new iam.AccountRootPrincipal(),
    });

    new eks.Nodegroup(stack, 'Nodegroup', {
      cluster,
      nodeRole: existingRole,
    });

    // THEN
    expect(cluster.defaultNodegroup).toBeDefined();
    Template.fromStack(stack).hasResourceProperties('AWS::EKS::Nodegroup', {
      ScalingConfig: {
        DesiredSize: 10,
        MaxSize: 10,
        MinSize: 10,
      },
    });
  });

  test('adding bottlerocket capacity creates an ASG with tags', () => {
    // GIVEN
    const { stack, vpc } = testFixture();
    const cluster = new eks.Cluster(stack, 'Cluster', {
      vpc,
      ...commonProps,
      prune: false,
    });

    // WHEN
    cluster.addAutoScalingGroupCapacity('Bottlerocket', {
      instanceType: new ec2.InstanceType('t2.medium'),
      machineImageType: eks.MachineImageType.BOTTLEROCKET,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::AutoScalingGroup', {
      Tags: [
        {
          Key: { 'Fn::Join': ['', ['kubernetes.io/cluster/', { Ref: 'ClusterEB0386A7' }]] },
          PropagateAtLaunch: true,
          Value: 'owned',
        },
        {
          Key: 'Name',
          PropagateAtLaunch: true,
          Value: 'Stack/Cluster/Bottlerocket',
        },
      ],
    });
  });

  test('adding bottlerocket capacity with bootstrapOptions throws error', () => {
    // GIVEN
    const { stack, vpc } = testFixture();
    const cluster = new eks.Cluster(stack, 'Cluster', {
      vpc,
      ...commonProps,
      prune: false,
    });

    expect(() => cluster.addAutoScalingGroupCapacity('Bottlerocket', {
      instanceType: new ec2.InstanceType('t2.medium'),
      machineImageType: eks.MachineImageType.BOTTLEROCKET,
      bootstrapOptions: {},
    })).toThrow(/bootstrapOptions is not supported for Bottlerocket/);
  });

  test('import cluster with existing kubectl provider function', () => {
    const { stack } = testFixture();

    const handlerRole = iam.Role.fromRoleArn(stack, 'HandlerRole', 'arn:aws:iam::123456789012:role/lambda-role');

    const kubectlProvider = KubectlProvider.fromKubectlProviderAttributes(stack, 'KubectlProvider', {
      serviceToken: 'arn:aws:lambda:us-east-2:123456789012:function:my-function:1',
      role: handlerRole,
    });

    const cluster = eks.Cluster.fromClusterAttributes(stack, 'Cluster', {
      clusterName: 'cluster',
      kubectlProvider: kubectlProvider,
    });

    expect(cluster.kubectlProvider).toEqual(kubectlProvider);
  });

  describe('import cluster with existing kubectl provider function should work as expected with resources relying on kubectl getOrCreate', () => {
    test('creates helm chart', () => {
      const { stack } = testFixture();

      const handlerRole = iam.Role.fromRoleArn(stack, 'HandlerRole', 'arn:aws:iam::123456789012:role/lambda-role');
      const kubectlProvider = KubectlProvider.fromKubectlProviderAttributes(stack, 'KubectlProvider', {
        serviceToken: 'arn:aws:lambda:us-east-2:123456789012:function:my-function:1',
        role: handlerRole,
      });

      const cluster = eks.Cluster.fromClusterAttributes(stack, 'Cluster', {
        clusterName: 'cluster',
        kubectlProvider: kubectlProvider,
      });

      new eks.HelmChart(stack, 'Chart', {
        cluster: cluster,
        chart: 'chart',
      });

      Template.fromStack(stack).hasResourceProperties('Custom::AWSCDK-EKS-HelmChart', {
        ServiceToken: kubectlProvider.serviceToken,
      });
    });

    test('creates Kubernetes patch', () => {
      const { stack } = testFixture();

      const handlerRole = iam.Role.fromRoleArn(stack, 'HandlerRole', 'arn:aws:iam::123456789012:role/lambda-role');
      const kubectlProvider = KubectlProvider.fromKubectlProviderAttributes(stack, 'KubectlProvider', {
        serviceToken: 'arn:aws:lambda:us-east-2:123456789012:function:my-function:1',
        role: handlerRole,
      });

      const cluster = eks.Cluster.fromClusterAttributes(stack, 'Cluster', {
        clusterName: 'cluster',
        kubectlProvider: kubectlProvider,
      });

      new eks.HelmChart(stack, 'Chart', {
        cluster: cluster,
        chart: 'chart',
      });

      new eks.KubernetesPatch(stack, 'Patch', {
        cluster: cluster,
        applyPatch: {},
        restorePatch: {},
        resourceName: 'PatchResource',
      });

      Template.fromStack(stack).hasResourceProperties('Custom::AWSCDK-EKS-KubernetesPatch', {
        ServiceToken: kubectlProvider.serviceToken,
      });
    });

    test('creates Kubernetes object value', () => {
      const { stack } = testFixture();

      const handlerRole = iam.Role.fromRoleArn(stack, 'HandlerRole', 'arn:aws:iam::123456789012:role/lambda-role');
      const kubectlProvider = KubectlProvider.fromKubectlProviderAttributes(stack, 'KubectlProvider', {
        serviceToken: 'arn:aws:lambda:us-east-2:123456789012:function:my-function:1',
        role: handlerRole,
      });

      const cluster = eks.Cluster.fromClusterAttributes(stack, 'Cluster', {
        clusterName: 'cluster',
        kubectlProvider: kubectlProvider,
      });

      new eks.HelmChart(stack, 'Chart', {
        cluster: cluster,
        chart: 'chart',
      });

      new eks.KubernetesPatch(stack, 'Patch', {
        cluster: cluster,
        applyPatch: {},
        restorePatch: {},
        resourceName: 'PatchResource',
      });

      new eks.KubernetesManifest(stack, 'Manifest', {
        cluster: cluster,
        manifest: [],
      });

      new eks.KubernetesObjectValue(stack, 'ObjectValue', {
        cluster: cluster,
        jsonPath: '',
        objectName: 'name',
        objectType: 'type',
      });

      Template.fromStack(stack).hasResourceProperties('Custom::AWSCDK-EKS-KubernetesObjectValue', {
        ServiceToken: kubectlProvider.serviceToken,
      });

      expect(cluster.kubectlProvider).not.toBeInstanceOf(eks.KubectlProvider);
    });
  });

  test('exercise export/import', () => {
    // GIVEN
    const { stack: stack1, vpc, app } = testFixture();
    const stack2 = new cdk.Stack(app, 'stack2', { env: { region: 'us-east-1' } });
    const cluster = new eks.Cluster(stack1, 'Cluster', {
      vpc,
      ...commonProps,
      prune: false,
    });

    // WHEN
    const imported = eks.Cluster.fromClusterAttributes(stack2, 'Imported', {
      vpc: cluster.vpc,
      clusterEndpoint: cluster.clusterEndpoint,
      clusterName: cluster.clusterName,
      securityGroupIds: cluster.connections.securityGroups.map(x => x.securityGroupId),
      clusterCertificateAuthorityData: cluster.clusterCertificateAuthorityData,
      clusterSecurityGroupId: cluster.clusterSecurityGroupId,
      clusterEncryptionConfigKeyArn: cluster.clusterEncryptionConfigKeyArn,
    });

    // this should cause an export/import
    new cdk.CfnOutput(stack2, 'ClusterARN', { value: imported.clusterArn });

    // THEN
    Template.fromStack(stack2).templateMatches({
      Outputs: {
        ClusterARN: {
          Value: {
            'Fn::Join': [
              '',
              [
                'arn:',
                {
                  Ref: 'AWS::Partition',
                },
                ':eks:us-east-1:',
                {
                  Ref: 'AWS::AccountId',
                },
                ':cluster/',
                {
                  'Fn::ImportValue': 'Stack:ExportsOutputRefClusterEB0386A796A0E3FE',
                },
              ],
            ],
          },
        },
      },
    });
  });

  test('addManifest can be used to apply k8s manifests on this cluster', () => {
    // GIVEN
    const { stack, vpc } = testFixture();
    const cluster = new eks.Cluster(stack, 'Cluster', {
      vpc,
      ...commonProps,
      prune: false,
      kubectlProviderOptions: {
        kubectlLayer: new KubectlV33Layer(stack, 'kubectlLayer'),
      },
    });

    // WHEN
    cluster.addManifest('manifest1', { foo: 123 });
    cluster.addManifest('manifest2', { bar: 123 }, { boor: [1, 2, 3] });

    // THEN
    Template.fromStack(stack).hasResourceProperties(eks.KubernetesManifest.RESOURCE_TYPE, {
      Manifest: '[{"foo":123}]',
    });

    Template.fromStack(stack).hasResourceProperties(eks.KubernetesManifest.RESOURCE_TYPE, {
      Manifest: '[{"bar":123},{"boor":[1,2,3]}]',
    });
  });

  test('kubectl resources can be created in a separate stack', () => {
    // GIVEN
    const { stack, app } = testFixture();
    const cluster = new eks.Cluster(stack, 'cluster', {
      version: CLUSTER_VERSION,
      prune: false,
      kubectlProviderOptions: {
        kubectlLayer: new KubectlV33Layer(stack, 'kubectlLayer'),
      },
    }); // cluster is under stack2

    // WHEN resource is under stack2
    const stack2 = new cdk.Stack(app, 'stack2', { env: { account: stack.account, region: stack.region } });
    new eks.KubernetesManifest(stack2, 'myresource', {
      cluster,
      manifest: [{ foo: 'bar' }],
    });

    // THEN
    app.synth(); // no cyclic dependency (see https://github.com/aws/aws-cdk/issues/7231)

    // expect a single resource in the 2nd stack
    Template.fromStack(stack2).templateMatches({
      Resources: {
        myresource49C6D325: {
          Type: 'Custom::AWSCDK-EKS-KubernetesResource',
          Properties: {
            ServiceToken: {
              'Fn::ImportValue': 'Stack:ExportsOutputFnGetAttclusterKubectlProviderframeworkonEvent7E8470F1Arn6086AAA4',
            },
            Manifest: '[{\"foo\":\"bar\"}]',
            ClusterName: { 'Fn::ImportValue': 'Stack:ExportsOutputRefcluster611F8AFFA07FC079' },
          },
          UpdateReplacePolicy: 'Delete',
          DeletionPolicy: 'Delete',
        },
      },
    });
  });

  describe('outputs', () => {
    test('no outputs are synthesized by default', () => {
      // GIVEN
      const { app, stack } = testFixtureNoVpc();

      // WHEN
      new eks.Cluster(stack, 'Cluster', { version: CLUSTER_VERSION, prune: false });

      // THEN
      const assembly = app.synth();
      const template = assembly.getStackByName(stack.stackName).template;
      expect(template.Outputs).toBeUndefined(); // no outputs
    });

    describe('boostrap user-data', () => {
      test('rendered by default for ASGs', () => {
        // GIVEN
        const { app, stack } = testFixtureNoVpc();
        const cluster = new eks.Cluster(stack, 'Cluster', {
          ...commonProps,
          prune: false,
        });

        // WHEN
        cluster.addAutoScalingGroupCapacity('MyCapcity', { instanceType: new ec2.InstanceType('m3.xlargs') });

        // THEN
        const template = app.synth().getStackByName(stack.stackName).template;
        const userData = template.Resources.ClusterMyCapcityLaunchConfig58583345.Properties.UserData;
        expect(userData).toEqual({ 'Fn::Base64': { 'Fn::Join': ['', ['#!/bin/bash\nset -o xtrace\n/etc/eks/bootstrap.sh ', { Ref: 'ClusterEB0386A7' }, ' --kubelet-extra-args "--node-labels lifecycle=OnDemand" --apiserver-endpoint \'', { 'Fn::GetAtt': ['ClusterEB0386A7', 'Endpoint'] }, '\' --b64-cluster-ca \'', { 'Fn::GetAtt': ['ClusterEB0386A7', 'CertificateAuthorityData'] }, '\' --use-max-pods true\n/opt/aws/bin/cfn-signal --exit-code $? --stack Stack --resource ClusterMyCapcityASGD4CD8B97 --region us-east-1']] } });
      });

      test('not rendered if bootstrap is disabled', () => {
        // GIVEN
        const { app, stack } = testFixtureNoVpc();
        const cluster = new eks.Cluster(stack, 'Cluster', {
          ...commonProps,
          prune: false,
        });

        // WHEN
        cluster.addAutoScalingGroupCapacity('MyCapcity', {
          instanceType: new ec2.InstanceType('m3.xlargs'),
          bootstrapEnabled: false,
        });

        // THEN
        const template = app.synth().getStackByName(stack.stackName).template;
        const userData = template.Resources.ClusterMyCapcityLaunchConfig58583345.Properties.UserData;
        expect(userData).toEqual({ 'Fn::Base64': '#!/bin/bash' });
      });

      // cursory test for options: see test.user-data.ts for full suite
      test('bootstrap options', () => {
        // GIVEN
        const { app, stack } = testFixtureNoVpc();
        const cluster = new eks.Cluster(stack, 'Cluster', {
          ...commonProps,
          prune: false,
        });

        // WHEN
        cluster.addAutoScalingGroupCapacity('MyCapcity', {
          instanceType: new ec2.InstanceType('m3.xlargs'),
          bootstrapOptions: {
            kubeletExtraArgs: '--node-labels FOO=42',
          },
        });

        // THEN
        const template = app.synth().getStackByName(stack.stackName).template;
        const userData = template.Resources.ClusterMyCapcityLaunchConfig58583345.Properties.UserData;
        expect(userData).toEqual({ 'Fn::Base64': { 'Fn::Join': ['', ['#!/bin/bash\nset -o xtrace\n/etc/eks/bootstrap.sh ', { Ref: 'ClusterEB0386A7' }, ' --kubelet-extra-args "--node-labels lifecycle=OnDemand  --node-labels FOO=42" --apiserver-endpoint \'', { 'Fn::GetAtt': ['ClusterEB0386A7', 'Endpoint'] }, '\' --b64-cluster-ca \'', { 'Fn::GetAtt': ['ClusterEB0386A7', 'CertificateAuthorityData'] }, '\' --use-max-pods true\n/opt/aws/bin/cfn-signal --exit-code $? --stack Stack --resource ClusterMyCapcityASGD4CD8B97 --region us-east-1']] } });
      });

      describe('spot instances', () => {
        test('nodes labeled an tainted accordingly', () => {
          // GIVEN
          const { app, stack } = testFixtureNoVpc();
          const cluster = new eks.Cluster(stack, 'Cluster', {
            ...commonProps,
            prune: false,
            kubectlProviderOptions: {
              kubectlLayer: new KubectlV33Layer(stack, 'kubectlLayer'),
            },
          });

          // WHEN
          cluster.addAutoScalingGroupCapacity('MyCapcity', {
            instanceType: new ec2.InstanceType('m3.xlargs'),
            spotPrice: '0.01',
          });

          // THEN
          const template = app.synth().getStackByName(stack.stackName).template;
          const userData = template.Resources.ClusterMyCapcityLaunchConfig58583345.Properties.UserData;
          expect(userData).toEqual({ 'Fn::Base64': { 'Fn::Join': ['', ['#!/bin/bash\nset -o xtrace\n/etc/eks/bootstrap.sh ', { Ref: 'ClusterEB0386A7' }, ' --kubelet-extra-args "--node-labels lifecycle=Ec2Spot --register-with-taints=spotInstance=true:PreferNoSchedule" --apiserver-endpoint \'', { 'Fn::GetAtt': ['ClusterEB0386A7', 'Endpoint'] }, '\' --b64-cluster-ca \'', { 'Fn::GetAtt': ['ClusterEB0386A7', 'CertificateAuthorityData'] }, '\' --use-max-pods true\n/opt/aws/bin/cfn-signal --exit-code $? --stack Stack --resource ClusterMyCapcityASGD4CD8B97 --region us-east-1']] } });
        });
      });
    });

    test('if bootstrap is disabled cannot specify options', () => {
      // GIVEN
      const { stack } = testFixtureNoVpc();
      const cluster = new eks.Cluster(stack, 'Cluster', {
        ...commonProps,
        prune: false,
      });

      // THEN
      expect(() => cluster.addAutoScalingGroupCapacity('MyCapcity', {
        instanceType: new ec2.InstanceType('m3.xlargs'),
        bootstrapEnabled: false,
        bootstrapOptions: { awsApiRetryAttempts: 10 },
      })).toThrow(/Cannot specify "bootstrapOptions" if "bootstrapEnabled" is false/);
    });

    test('EksOptimizedImage() with no nodeType always uses STANDARD with LATEST_KUBERNETES_VERSION', () => {
      // GIVEN
      const { app, stack } = testFixtureNoVpc();
      const LATEST_KUBERNETES_VERSION = '1.24';

      // WHEN
      new eks.EksOptimizedImage().getImage(stack);

      // THEN
      const assembly = app.synth();
      const parameters = assembly.getStackByName(stack.stackName).template.Parameters;
      expect(Object.entries(parameters).some(
        ([k, v]) => k.startsWith('SsmParameterValueawsserviceeksoptimizedami') &&
          (v as any).Default.includes('/amazon-linux-2/'),
      )).toEqual(true);
      expect(Object.entries(parameters).some(
        ([k, v]) => k.startsWith('SsmParameterValueawsserviceeksoptimizedami') &&
          (v as any).Default.includes(LATEST_KUBERNETES_VERSION),
      )).toEqual(true);
    });

    test('EksOptimizedImage() with specific kubernetesVersion return correct AMI', () => {
      // GIVEN
      const { app, stack } = testFixtureNoVpc();

      // WHEN
      new eks.EksOptimizedImage({ kubernetesVersion: CLUSTER_VERSION.version }).getImage(stack);

      // THEN
      const assembly = app.synth();
      const parameters = assembly.getStackByName(stack.stackName).template.Parameters;
      expect(Object.entries(parameters).some(
        ([k, v]) => k.startsWith('SsmParameterValueawsserviceeksoptimizedami') &&
          (v as any).Default.includes('/amazon-linux-2/'),
      )).toEqual(true);
      expect(Object.entries(parameters).some(
        ([k, v]) => k.startsWith('SsmParameterValueawsserviceeksoptimizedami') &&
          (v as any).Default.includes('/1.33/'),
      )).toEqual(true);
    });

    test('default cluster capacity with ARM64 instance type comes with nodegroup with correct AmiType', () => {
      // GIVEN
      const { stack } = testFixtureNoVpc();

      // WHEN
      new eks.Cluster(stack, 'cluster', {
        defaultCapacityType: eks.DefaultCapacityType.NODEGROUP,
        defaultCapacity: 1,
        version: CLUSTER_VERSION,
        prune: false,
        defaultCapacityInstance: new ec2.InstanceType('m6g.medium'),
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::EKS::Nodegroup', {
        AmiType: 'AL2_ARM_64',
      });
    });

    test('addNodegroup with ARM64 instance type comes with nodegroup with correct AmiType', () => {
      // GIVEN
      const { stack } = testFixtureNoVpc();

      // WHEN
      new eks.Cluster(stack, 'cluster', {
        ...commonProps,
        prune: false,
        defaultCapacityInstance: new ec2.InstanceType('m6g.medium'),
      }).addNodegroupCapacity('ng', {
        instanceTypes: [new ec2.InstanceType('m6g.medium')],
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::EKS::Nodegroup', {
        AmiType: 'AL2_ARM_64',
      });
    });

    test('addNodegroupCapacity with T4g instance type comes with nodegroup with correct AmiType', () => {
      // GIVEN
      const { stack } = testFixtureNoVpc();

      // WHEN
      new eks.Cluster(stack, 'cluster', {
        ...commonProps,
        prune: false,
        defaultCapacityInstance: new ec2.InstanceType('t4g.medium'),
      }).addNodegroupCapacity('ng', {
        instanceTypes: [new ec2.InstanceType('t4g.medium')],
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::EKS::Nodegroup', {
        AmiType: 'AL2_ARM_64',
      });
    });

    test('addAutoScalingGroupCapacity with T4g instance type comes with nodegroup with correct AmiType', () => {
      // GIVEN
      const { app, stack } = testFixtureNoVpc();

      // WHEN
      new eks.Cluster(stack, 'cluster', {
        ...commonProps,
        prune: false,
      }).addAutoScalingGroupCapacity('ng', {
        instanceType: new ec2.InstanceType('t4g.medium'),
      });

      // THEN
      const assembly = app.synth();
      const parameters = assembly.getStackByName(stack.stackName).template.Parameters;
      expect(Object.entries(parameters).some(
        ([k, v]) => k.startsWith('SsmParameterValueawsserviceeksoptimizedami') &&
          (v as any).Default.includes('amazon-linux-2-arm64/'),
      )).toEqual(true);
    });

    test('addNodegroupCapacity with C7g instance type comes with nodegroup with correct AmiType', () => {
      // GIVEN
      const { stack } = testFixtureNoVpc();

      // WHEN
      new eks.Cluster(stack, 'cluster', {
        ...commonProps,
        prune: false,
        defaultCapacityInstance: new ec2.InstanceType('c7g.large'),
      }).addNodegroupCapacity('ng', {
        instanceTypes: [new ec2.InstanceType('c7g.large')],
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::EKS::Nodegroup', {
        AmiType: 'AL2_ARM_64',
      });
    });

    test('addAutoScalingGroupCapacity with C7g instance type comes with nodegroup with correct AmiType', () => {
      // GIVEN
      const { app, stack } = testFixtureNoVpc();

      // WHEN
      new eks.Cluster(stack, 'cluster', {
        ...commonProps,
        prune: false,
      }).addAutoScalingGroupCapacity('ng', {
        instanceType: new ec2.InstanceType('c7g.large'),
      });

      // THEN
      const assembly = app.synth();
      const parameters = assembly.getStackByName(stack.stackName).template.Parameters;
      expect(Object.entries(parameters).some(
        ([k, v]) => k.startsWith('SsmParameterValueawsserviceeksoptimizedami') &&
          (v as any).Default.includes('amazon-linux-2-arm64/'),
      )).toEqual(true);
    });

    test('EKS-Optimized AMI with GPU support when addAutoScalingGroupCapacity', () => {
      // GIVEN
      const { app, stack } = testFixtureNoVpc();

      // WHEN
      new eks.Cluster(stack, 'cluster', {
        ...commonProps,
        prune: false,
      }).addAutoScalingGroupCapacity('GPUCapacity', {
        instanceType: new ec2.InstanceType('g4dn.xlarge'),
      });

      // THEN
      const assembly = app.synth();
      const parameters = assembly.getStackByName(stack.stackName).template.Parameters;
      expect(Object.entries(parameters).some(
        ([k, v]) => k.startsWith('SsmParameterValueawsserviceeksoptimizedami') && (v as any).Default.includes('amazon-linux-2-gpu'),
      )).toEqual(true);
    });

    test('EKS-Optimized AMI with ARM64 when addAutoScalingGroupCapacity', () => {
      // GIVEN
      const { app, stack } = testFixtureNoVpc();

      // WHEN
      new eks.Cluster(stack, 'cluster', {
        ...commonProps,
        prune: false,
      }).addAutoScalingGroupCapacity('ARMCapacity', {
        instanceType: new ec2.InstanceType('m6g.medium'),
      });

      // THEN
      const assembly = app.synth();
      const parameters = assembly.getStackByName(stack.stackName).template.Parameters;
      expect(Object.entries(parameters).some(
        ([k, v]) => k.startsWith('SsmParameterValueawsserviceeksoptimizedami') && (v as any).Default.includes('/amazon-linux-2-arm64/'),
      )).toEqual(true);
    });

    test('BottleRocketImage() with specific kubernetesVersion return correct AMI', () => {
      // GIVEN
      const { app, stack } = testFixtureNoVpc();

      // WHEN
      new BottleRocketImage({ kubernetesVersion: CLUSTER_VERSION.version }).getImage(stack);

      // THEN
      const assembly = app.synth();
      const parameters = assembly.getStackByName(stack.stackName).template.Parameters;
      expect(Object.entries(parameters).some(
        ([k, v]) => k.startsWith('SsmParameterValueawsservicebottlerocketaws') &&
          (v as any).Default.includes('/bottlerocket/'),
      )).toEqual(true);
      expect(Object.entries(parameters).some(
        ([k, v]) => k.startsWith('SsmParameterValueawsservicebottlerocketaws') &&
          (v as any).Default.includes('/aws-k8s-1.33/'),
      )).toEqual(true);
    });

    test('coreDnsComputeType will patch the coreDNS configuration to use a "fargate" compute type and restore to "ec2" upon removal', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      new eks.Cluster(stack, 'MyCluster', {
        coreDnsComputeType: eks.CoreDnsComputeType.FARGATE,
        version: CLUSTER_VERSION,
        prune: false,
        kubectlProviderOptions: {
          kubectlLayer: new KubectlV33Layer(stack, 'kubectlLayer'),
        },
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('Custom::AWSCDK-EKS-KubernetesPatch', {
        ResourceName: 'deployment/coredns',
        ResourceNamespace: 'kube-system',
        ApplyPatchJson: '{"spec":{"template":{"metadata":{"annotations":{"eks.amazonaws.com/compute-type":"fargate"}}}}}',
        RestorePatchJson: '{"spec":{"template":{"metadata":{"annotations":{"eks.amazonaws.com/compute-type":"ec2"}}}}}',
        ClusterName: {
          Ref: 'MyCluster4C1BA579',
        },
      });
    });

    test('if openIDConnectProvider a new OpenIDConnectProvider resource is created and exposed', () => {
      // GIVEN
      const { stack } = testFixtureNoVpc();
      const cluster = new eks.Cluster(stack, 'Cluster', {
        ...commonProps,
        prune: false,
      });

      // WHEN
      const provider = cluster.openIdConnectProvider;

      // THEN
      expect(provider).toEqual(cluster.openIdConnectProvider);
      Template.fromStack(stack).hasResourceProperties('Custom::AWSCDKOpenIdConnectProvider', {
        ServiceToken: {
          'Fn::GetAtt': [
            'CustomAWSCDKOpenIdConnectProviderCustomResourceProviderHandlerF2C543E0',
            'Arn',
          ],
        },
        ClientIDList: [
          'sts.amazonaws.com',
        ],
        Url: {
          'Fn::GetAtt': [
            'ClusterEB0386A7',
            'OpenIdConnectIssuerUrl',
          ],
        },
      });
    });
    test('inf1 instances are supported', () => {
      // GIVEN
      const { stack } = testFixtureNoVpc();
      const cluster = new eks.Cluster(stack, 'Cluster', {
        ...commonProps,
        prune: false,
        kubectlProviderOptions: {
          kubectlLayer: new KubectlV33Layer(stack, 'kubectlLayer'),
        },
      });

      // WHEN
      cluster.addAutoScalingGroupCapacity('InferenceInstances', {
        instanceType: new ec2.InstanceType('inf1.2xlarge'),
        minCapacity: 1,
      });
      const fileContents = fs.readFileSync(path.join(__dirname, '..', 'lib', 'addons', 'neuron-device-plugin.yaml'), 'utf8');
      const sanitized = YAML.parse(fileContents);

      // THEN
      Template.fromStack(stack).hasResourceProperties(eks.KubernetesManifest.RESOURCE_TYPE, {
        Manifest: JSON.stringify([sanitized]),
      });
    });
    test('inf2 instances are supported', () => {
      // GIVEN
      const { stack } = testFixtureNoVpc();
      const cluster = new eks.Cluster(stack, 'Cluster', {
        ...commonProps,
        prune: false,
        kubectlProviderOptions: {
          kubectlLayer: new KubectlV33Layer(stack, 'kubectlLayer'),
        },
      });

      // WHEN
      cluster.addAutoScalingGroupCapacity('InferenceInstances', {
        instanceType: new ec2.InstanceType('inf2.xlarge'),
        minCapacity: 1,
      });
      const fileContents = fs.readFileSync(path.join(__dirname, '..', 'lib', 'addons', 'neuron-device-plugin.yaml'), 'utf8');
      const sanitized = YAML.parse(fileContents);

      // THEN
      Template.fromStack(stack).hasResourceProperties(eks.KubernetesManifest.RESOURCE_TYPE, {
        Manifest: JSON.stringify([sanitized]),
      });
    });
    test('trn1 instances are supported', () => {
      // GIVEN
      const { stack } = testFixtureNoVpc();
      const cluster = new eks.Cluster(stack, 'Cluster', {
        ...commonProps,
        prune: false,
        kubectlProviderOptions: {
          kubectlLayer: new KubectlV33Layer(stack, 'kubectlLayer'),
        },
      });

      // WHEN
      cluster.addAutoScalingGroupCapacity('TrainiumInstances', {
        instanceType: new ec2.InstanceType('trn1.2xlarge'),
        minCapacity: 1,
      });
      const fileContents = fs.readFileSync(path.join(__dirname, '..', 'lib', 'addons', 'neuron-device-plugin.yaml'), 'utf8');
      const sanitized = YAML.parse(fileContents);

      // THEN
      Template.fromStack(stack).hasResourceProperties(eks.KubernetesManifest.RESOURCE_TYPE, {
        Manifest: JSON.stringify([sanitized]),
      });
    });
    test('trn1n instances are supported', () => {
      // GIVEN
      const { stack } = testFixtureNoVpc();
      const cluster = new eks.Cluster(stack, 'Cluster', {
        ...commonProps,
        prune: false,
        kubectlProviderOptions: {
          kubectlLayer: new KubectlV33Layer(stack, 'kubectlLayer'),
        },
      });

      // WHEN
      cluster.addAutoScalingGroupCapacity('TrainiumInstances', {
        instanceType: new ec2.InstanceType('trn1n.2xlarge'),
        minCapacity: 1,
      });
      const fileContents = fs.readFileSync(path.join(__dirname, '..', 'lib', 'addons', 'neuron-device-plugin.yaml'), 'utf8');
      const sanitized = YAML.parse(fileContents);

      // THEN
      Template.fromStack(stack).hasResourceProperties(eks.KubernetesManifest.RESOURCE_TYPE, {
        Manifest: JSON.stringify([sanitized]),
      });
    });

    test('inf1 instances are supported in addNodegroupCapacity', () => {
      // GIVEN
      const { stack } = testFixtureNoVpc();
      const cluster = new eks.Cluster(stack, 'Cluster', {
        ...commonProps,
        prune: false,
        kubectlProviderOptions: {
          kubectlLayer: new KubectlV33Layer(stack, 'kubectlLayer'),
        },
      });

      // WHEN
      cluster.addNodegroupCapacity('InferenceInstances', {
        instanceTypes: [new ec2.InstanceType('inf1.2xlarge')],
      });
      const fileContents = fs.readFileSync(path.join(__dirname, '..', 'lib', 'addons', 'neuron-device-plugin.yaml'), 'utf8');
      const sanitized = YAML.parse(fileContents);

      // THEN
      Template.fromStack(stack).hasResourceProperties(eks.KubernetesManifest.RESOURCE_TYPE, {
        Manifest: JSON.stringify([sanitized]),
      });
    });
    test('inf2 instances are supported in addNodegroupCapacity', () => {
      // GIVEN
      const { stack } = testFixtureNoVpc();
      const cluster = new eks.Cluster(stack, 'Cluster', {
        ...commonProps,
        prune: false,
        kubectlProviderOptions: {
          kubectlLayer: new KubectlV33Layer(stack, 'kubectlLayer'),
        },
      });

      // WHEN
      cluster.addNodegroupCapacity('InferenceInstances', {
        instanceTypes: [new ec2.InstanceType('inf2.xlarge')],
      });
      const fileContents = fs.readFileSync(path.join(__dirname, '..', 'lib', 'addons', 'neuron-device-plugin.yaml'), 'utf8');
      const sanitized = YAML.parse(fileContents);

      // THEN
      Template.fromStack(stack).hasResourceProperties(eks.KubernetesManifest.RESOURCE_TYPE, {
        Manifest: JSON.stringify([sanitized]),
      });
    });

    test('kubectl resources are always created after all fargate profiles', () => {
      // GIVEN
      const { stack, app } = testFixture();
      const cluster = new eks.Cluster(stack, 'Cluster', {
        version: CLUSTER_VERSION,
        prune: false,
        kubectlProviderOptions: {
          kubectlLayer: new KubectlV33Layer(stack, 'kubectlLayer'),
        },
      });

      // WHEN
      cluster.addFargateProfile('profile1', { selectors: [{ namespace: 'profile1' }] });
      cluster.addManifest('resource1', { foo: 123 });
      cluster.addFargateProfile('profile2', { selectors: [{ namespace: 'profile2' }] });
      new eks.HelmChart(stack, 'chart', { cluster, chart: 'mychart' });
      cluster.addFargateProfile('profile3', { selectors: [{ namespace: 'profile3' }] });
      new eks.KubernetesPatch(stack, 'patch1', {
        cluster,
        applyPatch: { foo: 123 },
        restorePatch: { bar: 123 },
        resourceName: 'foo/bar',
      });
      cluster.addFargateProfile('profile4', { selectors: [{ namespace: 'profile4' }] });

      // THEN
      const template = app.synth().getStackArtifact(stack.artifactId).template;

      const barrier = template.Resources.ClusterKubectlReadyBarrier200052AF;

      expect(barrier.DependsOn).toEqual([
        'Clusterfargateprofileprofile1PodExecutionRoleE85F87B5',
        'Clusterfargateprofileprofile129AEA3C6',
        'Clusterfargateprofileprofile2PodExecutionRole22670AF8',
        'Clusterfargateprofileprofile233B9A117',
        'Clusterfargateprofileprofile3PodExecutionRole475C0D8F',
        'Clusterfargateprofileprofile3D06F3076',
        'Clusterfargateprofileprofile4PodExecutionRole086057FB',
        'Clusterfargateprofileprofile4A0E3BBE8',
        'ClusterEB0386A7',
      ]);

      const kubectlResources = ['chartF2447AFC', 'patch1B964AC93', 'Clustermanifestresource10B1C9505'];

      // check that all kubectl resources depend on the barrier
      for (const r of kubectlResources) {
        expect(template.Resources[r].DependsOn).toEqual(['ClusterKubectlReadyBarrier200052AF']);
      }
    });

    test('kubectl provider role have right policy', () => {
      // GIVEN
      const { stack } = testFixture();
      const c1 = new eks.Cluster(stack, 'Cluster1', {
        version: CLUSTER_VERSION,
        prune: false,
        kubectlProviderOptions: {
          kubectlLayer: new KubectlV33Layer(stack, 'kubectlLayer'),
        },
      });

      // WHEN
      // activate kubectl provider
      c1.addManifest('c1a', { foo: 123 });
      c1.addManifest('c1b', { foo: 123 });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: [
            {
              Action: 'eks:DescribeCluster',
              Effect: 'Allow',
              Resource: {
                'Fn::GetAtt': [
                  'Cluster192CD0375',
                  'Arn',
                ],
              },
            },
          ],
          Version: '2012-10-17',
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
        AssumeRolePolicyDocument: {
          Statement: [
            {
              Action: 'sts:AssumeRole',
              Effect: 'Allow',
              Principal: { Service: 'lambda.amazonaws.com' },
            },
          ],
          Version: '2012-10-17',
        },
        ManagedPolicyArns: [
          {
            'Fn::Join': ['', [
              'arn:',
              { Ref: 'AWS::Partition' },
              ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
            ]],
          },
          {
            'Fn::Join': ['', [
              'arn:',
              { Ref: 'AWS::Partition' },
              ':iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole',
            ]],
          },
          {
            'Fn::Join': ['', [
              'arn:',
              { Ref: 'AWS::Partition' },
              ':iam::aws:policy/AmazonEC2ContainerRegistryReadOnly',
            ]],
          },
          {
            'Fn::If': [
              'Cluster1KubectlProviderHandlerHasEcrPublic0B1C9820',
              {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':iam::aws:policy/AmazonElasticContainerRegistryPublicReadOnly',
                  ],
                ],
              },
              {
                Ref: 'AWS::NoValue',
              },
            ],
          },
        ],
      });
    });
  });

  test('kubectl provider passes security group to provider', () => {
    const { stack } = testFixture();

    new eks.Cluster(stack, 'Cluster1', {
      version: CLUSTER_VERSION,
      prune: false,
      endpointAccess: eks.EndpointAccess.PRIVATE,
      kubectlProviderOptions: {
        kubectlLayer: new KubectlV33Layer(stack, 'kubectlLayer'),
        environment: {
          Foo: 'Bar',
        },
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      VpcConfig: {
        SecurityGroupIds: [{ 'Fn::GetAtt': ['Cluster192CD0375', 'ClusterSecurityGroupId'] }],
      },
    });
  });

  test('kubectl provider passes environment to lambda', () => {
    const { stack } = testFixture();

    const cluster = new eks.Cluster(stack, 'Cluster1', {
      version: CLUSTER_VERSION,
      prune: false,
      endpointAccess: eks.EndpointAccess.PRIVATE,
      kubectlProviderOptions: {
        kubectlLayer: new KubectlV33Layer(stack, 'kubectlLayer'),
        environment: {
          Foo: 'Bar',
        },
      },
    });

    cluster.addManifest('resource', {
      kind: 'ConfigMap',
      apiVersion: 'v1',
      data: {
        hello: 'world',
      },
      metadata: {
        name: 'config-map',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      Environment: {
        Variables: {
          Foo: 'Bar',
        },
      },
    });
  });

  describe('kubectl provider passes iam role environment to kubectl lambda', () => {
    test('new cluster', () => {
      const { stack } = testFixture();

      const kubectlRole = new iam.Role(stack, 'KubectlIamRole', {
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      });

      // using _ syntax to silence warning about _cluster not being used, when it is
      const cluster = new eks.Cluster(stack, 'Cluster1', {
        version: CLUSTER_VERSION,
        prune: false,
        endpointAccess: eks.EndpointAccess.PRIVATE,
        kubectlProviderOptions: {
          kubectlLayer: new KubectlV33Layer(stack, 'kubectlLayer'),
          role: kubectlRole,
        },
      });

      cluster.addManifest('resource', {
        kind: 'ConfigMap',
        apiVersion: 'v1',
        data: {
          hello: 'world',
        },
        metadata: {
          name: 'config-map',
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
        Role: {
          'Fn::GetAtt': ['Cluster1KubectlProviderframeworkonEventServiceRole67819AA9', 'Arn'],
        },
      });
    });

    test('imported cluster', () => {
      const clusterName = 'my-cluster';
      const stack = new cdk.Stack();

      const handlerRole = iam.Role.fromRoleArn(stack, 'HandlerRole', 'arn:aws:iam::123456789012:role/lambda-role');

      const kubectlProvider = KubectlProvider.fromKubectlProviderAttributes(stack, 'KubectlProvider', {
        serviceToken: 'arn:aws:lambda:us-east-2:123456789012:function:my-function:1',
        role: handlerRole,
      });

      const cluster = eks.Cluster.fromClusterAttributes(stack, 'Imported', {
        clusterName,
        kubectlProvider: kubectlProvider,
      });

      const chart = 'hello-world';
      cluster.addHelmChart('test-chart', {
        chart,
      });

      Template.fromStack(stack).hasResourceProperties(HelmChart.RESOURCE_TYPE, {
        ClusterName: clusterName,
        Release: 'importedcharttestchartf3acd6e5',
        Chart: chart,
        Namespace: 'default',
        CreateNamespace: true,
      });
    });
  });

  describe('endpoint access', () => {
    test('public restricted', () => {
      expect(() => {
        eks.EndpointAccess.PUBLIC.onlyFrom('1.2.3.4/32');
      }).toThrow(/Cannot restric public access to endpoint when private access is disabled. Use PUBLIC_AND_PRIVATE.onlyFrom\(\) instead./);
    });

    test('public non restricted without private subnets', () => {
      const { stack } = testFixture();

      new eks.Cluster(stack, 'Cluster', {
        version: CLUSTER_VERSION,
        prune: false,
        endpointAccess: eks.EndpointAccess.PUBLIC,
        vpcSubnets: [{ subnetType: ec2.SubnetType.PUBLIC }],
        kubectlProviderOptions: {
          kubectlLayer: new KubectlV33Layer(stack, 'kubectlLayer'),
        },
      });

      // we don't attach vpc config in case endpoint is public only, regardless of whether
      // the vpc has private subnets or not.
      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
        VpcConfig: Match.absent(),
      });
    });

    test('public non restricted with private subnets', () => {
      const { stack } = testFixture();

      new eks.Cluster(stack, 'Cluster', {
        version: CLUSTER_VERSION,
        endpointAccess: eks.EndpointAccess.PUBLIC,
        kubectlProviderOptions: {
          kubectlLayer: new KubectlV33Layer(stack, 'kubectlLayer'),
        },
      });

      // we don't attach vpc config in case endpoint is public only, regardless of whether
      // the vpc has private subnets or not.
      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
        VpcConfig: Match.absent(),
      });
    });

    test('private without private subnets', () => {
      const { stack } = testFixture();

      expect(() => {
        new eks.Cluster(stack, 'Cluster', {
          version: CLUSTER_VERSION,
          prune: false,
          endpointAccess: eks.EndpointAccess.PRIVATE,
          vpcSubnets: [{ subnetType: ec2.SubnetType.PUBLIC }],
        });
      }).toThrow(/Vpc must contain private subnets when public endpoint access is disabled/);
    });

    test('private with private subnets', () => {
      const { stack } = testFixture();

      new eks.Cluster(stack, 'Cluster', {
        version: CLUSTER_VERSION,
        prune: false,
        endpointAccess: eks.EndpointAccess.PRIVATE,
        kubectlProviderOptions: {
          kubectlLayer: new KubectlV33Layer(stack, 'kubectlLayer'),
        },
      });

      const functions = Template.fromStack(stack).findResources('AWS::Lambda::Function');
      expect(functions.ClusterKubectlProviderframeworkonEvent68E0CF80.Properties.VpcConfig.SubnetIds.length).not.toEqual(0);
      expect(functions.ClusterKubectlProviderframeworkonEvent68E0CF80.Properties.VpcConfig.SecurityGroupIds.length).not.toEqual(0);
    });

    test('private and non restricted public without private subnets', () => {
      const { stack } = testFixture();

      new eks.Cluster(stack, 'Cluster', {
        version: CLUSTER_VERSION,
        prune: false,
        endpointAccess: eks.EndpointAccess.PUBLIC_AND_PRIVATE,
        vpcSubnets: [{ subnetType: ec2.SubnetType.PUBLIC }],
        kubectlProviderOptions: {
          kubectlLayer: new KubectlV33Layer(stack, 'kubectlLayer'),
        },
      });

      // we don't have private subnets, but we don't need them since public access
      // is not restricted.
      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
        VpcConfig: Match.absent(),
      });
    });

    test('private and non restricted public with private subnets', () => {
      const { stack } = testFixture();

      new eks.Cluster(stack, 'Cluster', {
        version: CLUSTER_VERSION,
        prune: false,
        endpointAccess: eks.EndpointAccess.PUBLIC_AND_PRIVATE,
        kubectlProviderOptions: {
          kubectlLayer: new KubectlV33Layer(stack, 'kubectlLayer'),
        },
      });

      // we have private subnets so we should use them.
      const functions = Template.fromStack(stack).findResources('AWS::Lambda::Function');
      expect(functions.ClusterKubectlProviderframeworkonEvent68E0CF80.Properties.VpcConfig.SubnetIds.length).not.toEqual(0);
      expect(functions.ClusterKubectlProviderframeworkonEvent68E0CF80.Properties.VpcConfig.SecurityGroupIds.length).not.toEqual(0);
    });

    test('private and restricted public without private subnets', () => {
      const { stack } = testFixture();

      expect(() => {
        new eks.Cluster(stack, 'Cluster', {
          version: CLUSTER_VERSION,
          prune: false,
          endpointAccess: eks.EndpointAccess.PUBLIC_AND_PRIVATE.onlyFrom('1.2.3.4/32'),
          vpcSubnets: [{ subnetType: ec2.SubnetType.PUBLIC }],
        });
      }).toThrow(/Vpc must contain private subnets when public endpoint access is restricted/);
    });

    test('private and restricted public with private subnets', () => {
      const { stack } = testFixture();

      new eks.Cluster(stack, 'Cluster', {
        version: CLUSTER_VERSION,
        prune: false,
        endpointAccess: eks.EndpointAccess.PUBLIC_AND_PRIVATE.onlyFrom('1.2.3.4/32'),
        kubectlProviderOptions: {
          kubectlLayer: new KubectlV33Layer(stack, 'kubectlLayer'),
        },
      });

      // we have private subnets so we should use them.
      const functions = Template.fromStack(stack).findResources('AWS::Lambda::Function');
      expect(functions.ClusterKubectlProviderframeworkonEvent68E0CF80.Properties.VpcConfig.SubnetIds.length).not.toEqual(0);
      expect(functions.ClusterKubectlProviderframeworkonEvent68E0CF80.Properties.VpcConfig.SecurityGroupIds.length).not.toEqual(0);
    });

    test('private endpoint access selects only private subnets from looked up vpc', () => {
      const vpcId = 'vpc-12345';
      // can't use the regular fixture because it also adds a VPC to the stack, which prevents
      // us from setting context.
      const stack = new cdk.Stack(new cdk.App(), 'Stack', {
        env: {
          account: '11112222',
          region: 'us-east-1',
        },
      });
      stack.node.setContext(`vpc-provider:account=${stack.account}:filter.vpc-id=${vpcId}:region=${stack.region}:returnAsymmetricSubnets=true`, {
        vpcId: vpcId,
        vpcCidrBlock: '10.0.0.0/16',
        subnetGroups: [
          {
            name: 'Private',
            type: 'Private',
            subnets: [
              {
                subnetId: 'subnet-private-in-us-east-1a',
                cidr: '10.0.1.0/24',
                availabilityZone: 'us-east-1a',
                routeTableId: 'rtb-06068e4c4049921ef',
              },
            ],
          },
          {
            name: 'Public',
            type: 'Public',
            subnets: [
              {
                subnetId: 'subnet-public-in-us-east-1c',
                cidr: '10.0.0.0/24',
                availabilityZone: 'us-east-1c',
                routeTableId: 'rtb-0ff08e62195198dbb',
              },
            ],
          },
        ],
      });
      const vpc = ec2.Vpc.fromLookup(stack, 'Vpc', {
        vpcId: vpcId,
      });

      new eks.Cluster(stack, 'Cluster', {
        vpc,
        version: CLUSTER_VERSION,
        prune: false,
        endpointAccess: eks.EndpointAccess.PRIVATE,
        kubectlProviderOptions: {
          kubectlLayer: new KubectlV33Layer(stack, 'kubectlLayer'),
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
        VpcConfig: { SubnetIds: ['subnet-private-in-us-east-1a'] },
      });
    });

    test('private endpoint access selects only private subnets from looked up vpc with concrete subnet selection', () => {
      const vpcId = 'vpc-12345';
      // can't use the regular fixture because it also adds a VPC to the stack, which prevents
      // us from setting context.
      const stack = new cdk.Stack(new cdk.App(), 'Stack', {
        env: {
          account: '11112222',
          region: 'us-east-1',
        },
      });

      stack.node.setContext(`vpc-provider:account=${stack.account}:filter.vpc-id=${vpcId}:region=${stack.region}:returnAsymmetricSubnets=true`, {
        vpcId: vpcId,
        vpcCidrBlock: '10.0.0.0/16',
        subnetGroups: [
          {
            name: 'Private',
            type: 'Private',
            subnets: [
              {
                subnetId: 'subnet-private-in-us-east-1a',
                cidr: '10.0.1.0/24',
                availabilityZone: 'us-east-1a',
                routeTableId: 'rtb-06068e4c4049921ef',
              },
            ],
          },
          {
            name: 'Public',
            type: 'Public',
            subnets: [
              {
                subnetId: 'subnet-public-in-us-east-1c',
                cidr: '10.0.0.0/24',
                availabilityZone: 'us-east-1c',
                routeTableId: 'rtb-0ff08e62195198dbb',
              },
            ],
          },
        ],
      });

      const vpc = ec2.Vpc.fromLookup(stack, 'Vpc', {
        vpcId: vpcId,
      });

      new eks.Cluster(stack, 'Cluster', {
        vpc,
        version: CLUSTER_VERSION,
        prune: false,
        endpointAccess: eks.EndpointAccess.PRIVATE,
        vpcSubnets: [{
          subnets: [
            ec2.Subnet.fromSubnetId(stack, 'Private', 'subnet-private-in-us-east-1a'),
            ec2.Subnet.fromSubnetId(stack, 'Public', 'subnet-public-in-us-east-1c'),
          ],
        }],
        kubectlProviderOptions: {
          kubectlLayer: new KubectlV33Layer(stack, 'kubectlLayer'),
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
        VpcConfig: { SubnetIds: ['subnet-private-in-us-east-1a'] },
      });
    });

    test('private endpoint access selects only private subnets from managed vpc with concrete subnet selection', () => {
      const { stack } = testFixture();

      const vpc = new ec2.Vpc(stack, 'Vpc');

      new eks.Cluster(stack, 'Cluster', {
        vpc,
        version: CLUSTER_VERSION,
        prune: false,
        endpointAccess: eks.EndpointAccess.PRIVATE,
        vpcSubnets: [{
          subnets: [
            vpc.privateSubnets[0],
            vpc.publicSubnets[1],
            ec2.Subnet.fromSubnetId(stack, 'Private', 'subnet-unknown'),
          ],
        }],
        kubectlProviderOptions: {
          kubectlLayer: new KubectlV33Layer(stack, 'kubectlLayer'),
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
        VpcConfig: {
          SubnetIds: [
            { Ref: 'VpcPrivateSubnet1Subnet536B997A' },
            'subnet-unknown',
          ],
        },
      });
    });

    test('private endpoint access considers specific subnet selection', () => {
      const { stack } = testFixture();
      new eks.Cluster(stack, 'Cluster', {
        version: CLUSTER_VERSION,
        prune: false,
        endpointAccess:
          eks.EndpointAccess.PRIVATE,
        vpcSubnets: [{
          subnets: [ec2.PrivateSubnet.fromSubnetAttributes(stack, 'Private1', {
            subnetId: 'subnet1',
            availabilityZone: 'us-east-1a',
          })],
        }],
        kubectlProviderOptions: {
          kubectlLayer: new KubectlV33Layer(stack, 'kubectlLayer'),
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
        VpcConfig: { SubnetIds: ['subnet1'] },
      });
    });

    test('can configure private endpoint access', () => {
      // GIVEN
      const { stack } = testFixture();
      new eks.Cluster(stack, 'Cluster1', { version: CLUSTER_VERSION, endpointAccess: eks.EndpointAccess.PRIVATE, prune: false });

      const app = stack.node.root as cdk.App;
      const template = app.synth().getStackArtifact(stack.stackName).template;
      expect(template.Resources.Cluster192CD0375.Properties.ResourcesVpcConfig.EndpointPrivateAccess).toEqual(true);
      expect(template.Resources.Cluster192CD0375.Properties.ResourcesVpcConfig.EndpointPublicAccess).toEqual(false);
    });

    test('kubectl provider chooses only private subnets', () => {
      const { stack } = testFixture();

      const vpc = new ec2.Vpc(stack, 'Vpc', {
        maxAzs: 2,
        natGateways: 1,
        subnetConfiguration: [
          {
            subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
            name: 'Private1',
          },
          {
            subnetType: ec2.SubnetType.PUBLIC,
            name: 'Public1',
          },
        ],
      });

      const cluster = new eks.Cluster(stack, 'Cluster1', {
        version: CLUSTER_VERSION,
        prune: false,
        endpointAccess: eks.EndpointAccess.PRIVATE,
        vpc,
        kubectlProviderOptions: {
          kubectlLayer: new KubectlV33Layer(stack, 'kubectlLayer'),
        },
      });

      cluster.addManifest('resource', {
        kind: 'ConfigMap',
        apiVersion: 'v1',
        data: {
          hello: 'world',
        },
        metadata: {
          name: 'config-map',
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
        VpcConfig: {
          SecurityGroupIds: [
            {
              'Fn::GetAtt': ['Cluster192CD0375', 'ClusterSecurityGroupId'],
            },
          ],
          SubnetIds: [
            {
              Ref: 'VpcPrivate1Subnet1SubnetC688B2B1',
            },
            {
              Ref: 'VpcPrivate1Subnet2SubnetA2AF15C7',
            },
          ],
        },
      });
    });

    test('kubectl provider considers vpc subnet selection', () => {
      const { stack } = testFixture();

      const subnetConfiguration: ec2.SubnetConfiguration[] = [];

      for (let i = 0; i < 20; i++) {
        subnetConfiguration.push({
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
          name: `Private${i}`,
        },
        );
      }

      subnetConfiguration.push({
        subnetType: ec2.SubnetType.PUBLIC,
        name: 'Public1',
      });

      const vpc2 = new ec2.Vpc(stack, 'Vpc', {
        maxAzs: 2,
        natGateways: 1,
        subnetConfiguration,
      });

      const cluster = new eks.Cluster(stack, 'Cluster1', {
        version: CLUSTER_VERSION,
        prune: false,
        endpointAccess: eks.EndpointAccess.PRIVATE,
        vpc: vpc2,
        vpcSubnets: [{ subnetGroupName: 'Private1' }, { subnetGroupName: 'Private2' }],
        kubectlProviderOptions: {
          kubectlLayer: new KubectlV33Layer(stack, 'kubectlLayer'),
        },
      });

      cluster.addManifest('resource', {
        kind: 'ConfigMap',
        apiVersion: 'v1',
        data: {
          hello: 'world',
        },
        metadata: {
          name: 'config-map',
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
        VpcConfig: {
          SecurityGroupIds: [
            {
              'Fn::GetAtt': ['Cluster192CD0375', 'ClusterSecurityGroupId'],
            },
          ],
          SubnetIds: [
            {
              Ref: 'VpcPrivate1Subnet1SubnetC688B2B1',
            },
            {
              Ref: 'VpcPrivate1Subnet2SubnetA2AF15C7',
            },
            {
              Ref: 'VpcPrivate2Subnet1SubnetE13E2E30',
            },
            {
              Ref: 'VpcPrivate2Subnet2Subnet158A38AB',
            },
          ],
        },
      });
    });

    test('throw when private access is configured without dns support enabled for the VPC', () => {
      const { stack } = testFixture();

      expect(() => {
        new eks.Cluster(stack, 'Cluster', {
          vpc: new ec2.Vpc(stack, 'Vpc', {
            enableDnsSupport: false,
          }),
          version: CLUSTER_VERSION,
          prune: false,
        });
      }).toThrow(/Private endpoint access requires the VPC to have DNS support and DNS hostnames enabled/);
    });

    test('throw when private access is configured without dns hostnames enabled for the VPC', () => {
      const { stack } = testFixture();

      expect(() => {
        new eks.Cluster(stack, 'Cluster', {
          vpc: new ec2.Vpc(stack, 'Vpc', {
            enableDnsHostnames: false,
          }),
          version: CLUSTER_VERSION,
          prune: false,
        });
      }).toThrow(/Private endpoint access requires the VPC to have DNS support and DNS hostnames enabled/);
    });

    test('throw when cidrs are configured without public access endpoint', () => {
      expect(() => {
        eks.EndpointAccess.PRIVATE.onlyFrom('1.2.3.4/5');
      }).toThrow(/CIDR blocks can only be configured when public access is enabled/);
    });
  });

  test('getServiceLoadBalancerAddress', () => {
    const { stack } = testFixture();
    const cluster = new eks.Cluster(stack, 'Cluster1', {
      version: CLUSTER_VERSION,
      prune: false,
      kubectlProviderOptions: {
        kubectlLayer: new KubectlV33Layer(stack, 'kubectlLayer'),
      },
    });

    const loadBalancerAddress = cluster.getServiceLoadBalancerAddress('myservice');

    new cdk.CfnOutput(stack, 'LoadBalancerAddress', {
      value: loadBalancerAddress,
    });

    const expectedKubernetesGetId = 'Cluster1myserviceLoadBalancerAddress198CCB03';

    let template = Template.fromStack(stack);
    const resources = template.findResources('Custom::AWSCDK-EKS-KubernetesObjectValue');

    // make sure the custom resource is created correctly
    expect(resources[expectedKubernetesGetId].Properties).toEqual({
      ServiceToken: {
        'Fn::GetAtt': [
          'Cluster1KubectlProviderframeworkonEventBB398CAE',
          'Arn',
        ],
      },
      ClusterName: {
        Ref: 'Cluster192CD0375',
      },
      ObjectType: 'service',
      ObjectName: 'myservice',
      ObjectNamespace: 'default',
      JsonPath: '.status.loadBalancer.ingress[0].hostname',
      TimeoutSeconds: 300,
    });

    // make sure the attribute points to the expected custom resource and extracts the correct attribute
    template.hasOutput('LoadBalancerAddress', {
      Value: { 'Fn::GetAtt': [expectedKubernetesGetId, 'Value'] },
    });
  });

  test('custom kubectl layer can be provided', () => {
    // GIVEN
    const { stack } = testFixture();

    // WHEN
    const layer = lambda.LayerVersion.fromLayerVersionArn(stack, 'MyLayer', 'arn:of:layer');
    new eks.Cluster(stack, 'Cluster1', {
      version: CLUSTER_VERSION,
      prune: false,
      kubectlProviderOptions: {
        kubectlLayer: layer,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      Layers: [
        { Ref: 'Cluster1KubectlProviderAwsCliLayer5CF50321' },
        'arn:of:layer',
      ],
    });
  });

  test('custom awscli layer can be provided', () => {
    // GIVEN
    const { stack } = testFixture();

    // WHEN
    const layer = lambda.LayerVersion.fromLayerVersionArn(stack, 'MyLayer', 'arn:of:layer');
    new eks.Cluster(stack, 'Cluster1', {
      version: CLUSTER_VERSION,
      prune: false,
      kubectlProviderOptions: {
        awscliLayer: layer,
        kubectlLayer: new KubectlV33Layer(stack, 'kubectlLayer'),
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      Layers: [
        'arn:of:layer',
        { Ref: 'kubectlLayer44321E08' },
      ],
    });
  });

  test('create a cluster using custom resource with secrets encryption using KMS CMK', () => {
    // GIVEN
    const { stack, vpc } = testFixture();

    // WHEN
    new eks.Cluster(stack, 'Cluster', {
      vpc,
      version: CLUSTER_VERSION,
      prune: false,
      secretsEncryptionKey: new kms.Key(stack, 'Key'),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EKS::Cluster', {
      EncryptionConfig: [{
        Provider: {
          KeyArn: {
            'Fn::GetAtt': [
              'Key961B73FD',
              'Arn',
            ],
          },
        },
        Resources: ['secrets'],
      }],
    });
  });

  test('create a cluster using custom kubernetes network config', () => {
    // GIVEN
    const { stack } = testFixture();
    const customCidr = '172.16.0.0/12';

    // WHEN
    new eks.Cluster(stack, 'Cluster', {
      version: CLUSTER_VERSION,
      serviceIpv4Cidr: customCidr,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EKS::Cluster', {
      KubernetesNetworkConfig: {
        ServiceIpv4Cidr: customCidr,
      },
    });
  });

  describe('AccessConfig', () => {
    // bootstrapClusterCreatorAdminPermissions can be explicitly enabled or disabled
    test.each([
      [true, true],
      [false, false],
    ])('bootstrapClusterCreatorAdminPermissions(%s) should work',
      (a, b) => {
        // GIVEN
        const { stack } = testFixture();

        // WHEN
        new eks.Cluster(stack, 'Cluster', {
          version: CLUSTER_VERSION,
          bootstrapClusterCreatorAdminPermissions: a,
        });

        // THEN
        Template.fromStack(stack).hasResourceProperties('AWS::EKS::Cluster', {
          AccessConfig: {
            BootstrapClusterCreatorAdminPermissions: b,
          },
        });
      },
    );
  });

  describe('AccessEntry', () => {
    // cluster can grantAccess();
    test('cluster can grantAccess', () => {
      // GIVEN
      const { stack, vpc } = testFixture();
      // WHEN
      const mastersRole = new iam.Role(stack, 'role', { assumedBy: new iam.AccountRootPrincipal() });
      new eks.Cluster(stack, 'Cluster', {
        vpc,
        mastersRole,
        version: CLUSTER_VERSION,
      });
      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::EKS::AccessEntry', {
        AccessPolicies: [
          {
            AccessScope: {
              Type: 'cluster',
            },
            PolicyArn: {
              'Fn::Join': [
                '', [
                  'arn:',
                  { Ref: 'AWS::Partition' },
                  ':eks::aws:cluster-access-policy/AmazonEKSClusterAdminPolicy',
                ],
              ],
            },
          },
        ],
      });
    });
  });
});
