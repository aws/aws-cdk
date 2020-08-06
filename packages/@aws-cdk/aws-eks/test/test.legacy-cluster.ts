import { expect, haveResource, haveResourceLike, not } from '@aws-cdk/assert';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as eks from '../lib';
import { testFixture, testFixtureNoVpc } from './util';

/* eslint-disable max-len */

const CLUSTER_VERSION = eks.KubernetesVersion.V1_16;

export = {
  'a default cluster spans all subnets'(test: Test) {
    // GIVEN
    const { stack, vpc } = testFixture();

    // WHEN
    new eks.LegacyCluster(stack, 'Cluster', { vpc, defaultCapacity: 0, version: CLUSTER_VERSION });

    // THEN
    expect(stack).to(haveResourceLike('AWS::EKS::Cluster', {
      ResourcesVpcConfig: {
        SubnetIds: [
          { Ref: 'VPCPublicSubnet1SubnetB4246D30' },
          { Ref: 'VPCPublicSubnet2Subnet74179F39' },
          { Ref: 'VPCPrivateSubnet1Subnet8BCA10E0' },
          { Ref: 'VPCPrivateSubnet2SubnetCFCDAA7A' },
        ],
      },
    }));

    test.done();
  },

  'if "vpc" is not specified, vpc with default configuration will be created'(test: Test) {
    // GIVEN
    const { stack } = testFixtureNoVpc();

    // WHEN
    new eks.LegacyCluster(stack, 'cluster', { version: CLUSTER_VERSION }) ;

    // THEN
    expect(stack).to(haveResource('AWS::EC2::VPC'));
    test.done();
  },

  'default capacity': {

    'x2 m5.large by default'(test: Test) {
      // GIVEN
      const { stack } = testFixtureNoVpc();

      // WHEN
      const cluster = new eks.LegacyCluster(stack, 'cluster', { version: CLUSTER_VERSION });

      // THEN
      test.ok(cluster.defaultNodegroup);
      expect(stack).to(haveResource('AWS::EKS::Nodegroup', {
        InstanceTypes: [
          'm5.large',
        ],
        ScalingConfig: {
          DesiredSize: 2,
          MaxSize: 2,
          MinSize: 2,
        },
      }));
      test.done();
    },

    'quantity and type can be customized'(test: Test) {
      // GIVEN
      const { stack } = testFixtureNoVpc();

      // WHEN
      const cluster = new eks.LegacyCluster(stack, 'cluster', {
        defaultCapacity: 10,
        defaultCapacityInstance: new ec2.InstanceType('m2.xlarge'),
        version: CLUSTER_VERSION,
      });

      // THEN
      test.ok(cluster.defaultNodegroup);
      expect(stack).to(haveResource('AWS::EKS::Nodegroup', {
        ScalingConfig: {
          DesiredSize: 10,
          MaxSize: 10,
          MinSize: 10,
        },
      }));
      // expect(stack).to(haveResource('AWS::AutoScaling::LaunchConfiguration', { InstanceType: 'm2.xlarge' }));
      test.done();
    },

    'defaultCapacity=0 will not allocate at all'(test: Test) {
      // GIVEN
      const { stack } = testFixtureNoVpc();

      // WHEN
      const cluster = new eks.LegacyCluster(stack, 'cluster', { defaultCapacity: 0, version: CLUSTER_VERSION });

      // THEN
      test.ok(!cluster.defaultCapacity);
      expect(stack).notTo(haveResource('AWS::AutoScaling::AutoScalingGroup'));
      expect(stack).notTo(haveResource('AWS::AutoScaling::LaunchConfiguration'));
      test.done();
    },
  },

  'creating a cluster tags the private VPC subnets'(test: Test) {
    // GIVEN
    const { stack, vpc } = testFixture();

    // WHEN
    new eks.LegacyCluster(stack, 'Cluster', { vpc, defaultCapacity: 0, version: CLUSTER_VERSION });

    // THEN
    expect(stack).to(haveResource('AWS::EC2::Subnet', {
      Tags: [
        { Key: 'aws-cdk:subnet-name', Value: 'Private' },
        { Key: 'aws-cdk:subnet-type', Value: 'Private' },
        { Key: 'kubernetes.io/role/internal-elb', Value: '1' },
        { Key: 'Name', Value: 'Stack/VPC/PrivateSubnet1' },
      ],
    }));

    test.done();
  },

  'creating a cluster tags the public VPC subnets'(test: Test) {
    // GIVEN
    const { stack, vpc } = testFixture();

    // WHEN
    new eks.LegacyCluster(stack, 'Cluster', { vpc, defaultCapacity: 0, version: CLUSTER_VERSION });

    // THEN
    expect(stack).to(haveResource('AWS::EC2::Subnet', {
      MapPublicIpOnLaunch: true,
      Tags: [
        { Key: 'aws-cdk:subnet-name', Value: 'Public' },
        { Key: 'aws-cdk:subnet-type', Value: 'Public' },
        { Key: 'kubernetes.io/role/elb', Value: '1' },
        { Key: 'Name', Value: 'Stack/VPC/PublicSubnet1' },
      ],
    }));

    test.done();
  },

  'adding capacity creates an ASG with tags'(test: Test) {
    // GIVEN
    const { stack, vpc } = testFixture();
    const cluster = new eks.LegacyCluster(stack, 'Cluster', {
      vpc,
      defaultCapacity: 0,
      version: CLUSTER_VERSION,
    });

    // WHEN
    cluster.addCapacity('Default', {
      instanceType: new ec2.InstanceType('t2.medium'),
    });

    // THEN
    expect(stack).to(haveResource('AWS::AutoScaling::AutoScalingGroup', {
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
    }));

    test.done();
  },

  'create nodegroup with existing role'(test: Test) {
    // GIVEN
    const { stack } = testFixtureNoVpc();

    // WHEN
    const cluster = new eks.LegacyCluster(stack, 'cluster', {
      defaultCapacity: 10,
      defaultCapacityInstance: new ec2.InstanceType('m2.xlarge'),
      version: CLUSTER_VERSION,
    });

    const existingRole = new iam.Role(stack, 'ExistingRole', {
      assumedBy: new iam.AccountRootPrincipal(),
    });

    new eks.Nodegroup(stack, 'Nodegroup', {
      cluster,
      nodeRole: existingRole,
    });

    // THEN
    test.ok(cluster.defaultNodegroup);
    expect(stack).to(haveResource('AWS::EKS::Nodegroup', {
      ScalingConfig: {
        DesiredSize: 10,
        MaxSize: 10,
        MinSize: 10,
      },
    }));
    test.done();
  },

  'adding bottlerocket capacity creates an ASG with tags'(test: Test) {
    // GIVEN
    const { stack, vpc } = testFixture();
    const cluster = new eks.LegacyCluster(stack, 'Cluster', {
      vpc,
      defaultCapacity: 0,
      version: CLUSTER_VERSION,
    });

    // WHEN
    cluster.addCapacity('Bottlerocket', {
      instanceType: new ec2.InstanceType('t2.medium'),
      machineImageType: eks.MachineImageType.BOTTLEROCKET,
    });

    // THEN
    expect(stack).to(haveResource('AWS::AutoScaling::AutoScalingGroup', {
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
    }));
    test.done();
  },

  'adding bottlerocket capacity with bootstrapOptions throws error'(test: Test) {
    // GIVEN
    const { stack, vpc } = testFixture();
    const cluster = new eks.LegacyCluster(stack, 'Cluster', {
      vpc,
      defaultCapacity: 0,
      version: CLUSTER_VERSION,
    });

    test.throws(() => cluster.addCapacity('Bottlerocket', {
      instanceType: new ec2.InstanceType('t2.medium'),
      machineImageType: eks.MachineImageType.BOTTLEROCKET,
      bootstrapOptions: {},
    }), /bootstrapOptions is not supported for Bottlerocket/);
    test.done();
  },

  'exercise export/import'(test: Test) {
    // GIVEN
    const { stack: stack1, vpc, app } = testFixture();
    const stack2 = new cdk.Stack(app, 'stack2', { env: { region: 'us-east-1' } });
    const cluster = new eks.LegacyCluster(stack1, 'Cluster', {
      vpc,
      defaultCapacity: 0,
      version: CLUSTER_VERSION,
    });

    // WHEN
    const imported = eks.LegacyCluster.fromClusterAttributes(stack2, 'Imported', {
      clusterArn: cluster.clusterArn,
      vpc: cluster.vpc,
      clusterEndpoint: cluster.clusterEndpoint,
      clusterName: cluster.clusterName,
      securityGroups: cluster.connections.securityGroups,
      clusterCertificateAuthorityData: cluster.clusterCertificateAuthorityData,
      clusterSecurityGroupId: cluster.clusterSecurityGroupId,
      clusterEncryptionConfigKeyArn: cluster.clusterEncryptionConfigKeyArn,
    });

    // this should cause an export/import
    new cdk.CfnOutput(stack2, 'ClusterARN', { value: imported.clusterArn });

    // THEN
    expect(stack2).toMatch({
      Outputs: {
        ClusterARN: {
          Value: {
            'Fn::ImportValue': 'Stack:ExportsOutputFnGetAttClusterEB0386A7Arn2F2E3C3F',
          },
        },
      },
    });
    test.done();
  },

  'disabled features when kubectl is disabled'(test: Test) {
    // GIVEN
    const { stack, vpc } = testFixture();
    const cluster = new eks.LegacyCluster(stack, 'Cluster', {
      vpc,
      defaultCapacity: 0,
      version: CLUSTER_VERSION,
    });

    test.throws(() => cluster.addCapacity('boo', { instanceType: new ec2.InstanceType('r5d.24xlarge'), mapRole: true }),
      /Cannot map instance IAM role to RBAC if kubectl is disabled for the cluster/);
    test.done();
  },

  'addCapacity will *not* map the IAM role if mapRole is false'(test: Test) {
    // GIVEN
    const { stack, vpc } = testFixture();
    const cluster = new eks.LegacyCluster(stack, 'Cluster', {
      vpc,
      defaultCapacity: 0,
      version: CLUSTER_VERSION,
    });

    // WHEN
    cluster.addCapacity('default', {
      instanceType: new ec2.InstanceType('t2.nano'),
      mapRole: false,
    });

    // THEN
    expect(stack).to(not(haveResource(eks.KubernetesResource.RESOURCE_TYPE)));
    test.done();
  },

  'addCapacity will *not* map the IAM role if kubectl is disabled'(test: Test) {
    // GIVEN
    const { stack, vpc } = testFixture();
    const cluster = new eks.LegacyCluster(stack, 'Cluster', {
      vpc,
      defaultCapacity: 0,
      version: CLUSTER_VERSION,
    });

    // WHEN
    cluster.addCapacity('default', {
      instanceType: new ec2.InstanceType('t2.nano'),
    });

    // THEN
    expect(stack).to(not(haveResource(eks.KubernetesResource.RESOURCE_TYPE)));
    test.done();
  },

  'outputs': {
    'aws eks update-kubeconfig is the only output synthesized by default'(test: Test) {
      // GIVEN
      const { app, stack } = testFixtureNoVpc();

      // WHEN
      new eks.LegacyCluster(stack, 'Cluster', { version: CLUSTER_VERSION });

      // THEN
      const assembly = app.synth();
      const template = assembly.getStackByName(stack.stackName).template;
      test.deepEqual(template.Outputs, {
        ClusterConfigCommand43AAE40F: { Value: { 'Fn::Join': ['', ['aws eks update-kubeconfig --name ', { Ref: 'ClusterEB0386A7' }, ' --region us-east-1']] } },
        ClusterGetTokenCommand06AE992E: { Value: { 'Fn::Join': ['', ['aws eks get-token --cluster-name ', { Ref: 'ClusterEB0386A7' }, ' --region us-east-1']] } },
      });
      test.done();
    },

    'if `outputConfigCommand=false` will disabled the output'(test: Test) {
      // GIVEN
      const { app, stack } = testFixtureNoVpc();

      // WHEN
      new eks.LegacyCluster(stack, 'Cluster', {
        outputConfigCommand: false,
        version: CLUSTER_VERSION,
      });

      // THEN
      const assembly = app.synth();
      const template = assembly.getStackByName(stack.stackName).template;
      test.ok(!template.Outputs); // no outputs
      test.done();
    },

    '`outputClusterName` can be used to synthesize an output with the cluster name'(test: Test) {
      // GIVEN
      const { app, stack } = testFixtureNoVpc();

      // WHEN
      new eks.LegacyCluster(stack, 'Cluster', {
        outputConfigCommand: false,
        outputClusterName: true,
        version: CLUSTER_VERSION,
      });

      // THEN
      const assembly = app.synth();
      const template = assembly.getStackByName(stack.stackName).template;
      test.deepEqual(template.Outputs, {
        ClusterClusterNameEB26049E: { Value: { Ref: 'ClusterEB0386A7' } },
      });
      test.done();
    },

    'boostrap user-data': {

      'rendered by default for ASGs'(test: Test) {
        // GIVEN
        const { app, stack } = testFixtureNoVpc();
        const cluster = new eks.LegacyCluster(stack, 'Cluster', { defaultCapacity: 0, version: CLUSTER_VERSION });

        // WHEN
        cluster.addCapacity('MyCapcity', { instanceType: new ec2.InstanceType('m3.xlargs') });

        // THEN
        const template = app.synth().getStackByName(stack.stackName).template;
        const userData = template.Resources.ClusterMyCapcityLaunchConfig58583345.Properties.UserData;
        test.deepEqual(userData, { 'Fn::Base64': { 'Fn::Join': ['', ['#!/bin/bash\nset -o xtrace\n/etc/eks/bootstrap.sh ', { Ref: 'ClusterEB0386A7' }, ' --kubelet-extra-args "--node-labels lifecycle=OnDemand" --use-max-pods true\n/opt/aws/bin/cfn-signal --exit-code $? --stack Stack --resource ClusterMyCapcityASGD4CD8B97 --region us-east-1']] } });
        test.done();
      },

      'not rendered if bootstrap is disabled'(test: Test) {
        // GIVEN
        const { app, stack } = testFixtureNoVpc();
        const cluster = new eks.LegacyCluster(stack, 'Cluster', { defaultCapacity: 0, version: CLUSTER_VERSION });

        // WHEN
        cluster.addCapacity('MyCapcity', {
          instanceType: new ec2.InstanceType('m3.xlargs'),
          bootstrapEnabled: false,
        });

        // THEN
        const template = app.synth().getStackByName(stack.stackName).template;
        const userData = template.Resources.ClusterMyCapcityLaunchConfig58583345.Properties.UserData;
        test.deepEqual(userData, { 'Fn::Base64': '#!/bin/bash' });
        test.done();
      },

      // cursory test for options: see test.user-data.ts for full suite
      'bootstrap options'(test: Test) {
        // GIVEN
        const { app, stack } = testFixtureNoVpc();
        const cluster = new eks.LegacyCluster(stack, 'Cluster', { defaultCapacity: 0, version: CLUSTER_VERSION });

        // WHEN
        cluster.addCapacity('MyCapcity', {
          instanceType: new ec2.InstanceType('m3.xlargs'),
          bootstrapOptions: {
            kubeletExtraArgs: '--node-labels FOO=42',
          },
        });

        // THEN
        const template = app.synth().getStackByName(stack.stackName).template;
        const userData = template.Resources.ClusterMyCapcityLaunchConfig58583345.Properties.UserData;
        test.deepEqual(userData, { 'Fn::Base64': { 'Fn::Join': ['', ['#!/bin/bash\nset -o xtrace\n/etc/eks/bootstrap.sh ', { Ref: 'ClusterEB0386A7' }, ' --kubelet-extra-args "--node-labels lifecycle=OnDemand  --node-labels FOO=42" --use-max-pods true\n/opt/aws/bin/cfn-signal --exit-code $? --stack Stack --resource ClusterMyCapcityASGD4CD8B97 --region us-east-1']] } });
        test.done();
      },

      'spot instances': {

        'nodes labeled an tainted accordingly'(test: Test) {
          // GIVEN
          const { app, stack } = testFixtureNoVpc();
          const cluster = new eks.LegacyCluster(stack, 'Cluster', { defaultCapacity: 0, version: CLUSTER_VERSION });

          // WHEN
          cluster.addCapacity('MyCapcity', {
            instanceType: new ec2.InstanceType('m3.xlargs'),
            spotPrice: '0.01',
          });

          // THEN
          const template = app.synth().getStackByName(stack.stackName).template;
          const userData = template.Resources.ClusterMyCapcityLaunchConfig58583345.Properties.UserData;
          test.deepEqual(userData, { 'Fn::Base64': { 'Fn::Join': ['', ['#!/bin/bash\nset -o xtrace\n/etc/eks/bootstrap.sh ', { Ref: 'ClusterEB0386A7' }, ' --kubelet-extra-args "--node-labels lifecycle=Ec2Spot --register-with-taints=spotInstance=true:PreferNoSchedule" --use-max-pods true\n/opt/aws/bin/cfn-signal --exit-code $? --stack Stack --resource ClusterMyCapcityASGD4CD8B97 --region us-east-1']] } });
          test.done();
        },

        'if kubectl is disabled, interrupt handler is not added'(test: Test) {
          // GIVEN
          const { stack } = testFixtureNoVpc();
          const cluster = new eks.LegacyCluster(stack, 'Cluster', {
            defaultCapacity: 0,
            version: CLUSTER_VERSION,
          });

          // WHEN
          cluster.addCapacity('MyCapcity', {
            instanceType: new ec2.InstanceType('m3.xlargs'),
            spotPrice: '0.01',
          });

          // THEN
          expect(stack).notTo(haveResource(eks.KubernetesResource.RESOURCE_TYPE));
          test.done();
        },

      },

    },

    'if bootstrap is disabled cannot specify options'(test: Test) {
      // GIVEN
      const { stack } = testFixtureNoVpc();
      const cluster = new eks.LegacyCluster(stack, 'Cluster', { defaultCapacity: 0, version: CLUSTER_VERSION });

      // THEN
      test.throws(() => cluster.addCapacity('MyCapcity', {
        instanceType: new ec2.InstanceType('m3.xlargs'),
        bootstrapEnabled: false,
        bootstrapOptions: { awsApiRetryAttempts: 10 },
      }), /Cannot specify "bootstrapOptions" if "bootstrapEnabled" is false/);
      test.done();
    },

    'EksOptimizedImage() with no nodeType always uses STANDARD with LATEST_KUBERNETES_VERSION'(test: Test) {
      // GIVEN
      const { app, stack } = testFixtureNoVpc();
      const LATEST_KUBERNETES_VERSION = '1.14';

      // WHEN
      new eks.EksOptimizedImage().getImage(stack);

      // THEN
      const assembly = app.synth();
      const parameters = assembly.getStackByName(stack.stackName).template.Parameters;
      test.ok(Object.entries(parameters).some(
        ([k, v]) => k.startsWith('SsmParameterValueawsserviceeksoptimizedami') &&
          (v as any).Default.includes('/amazon-linux-2/'),
      ), 'EKS STANDARD AMI should be in ssm parameters');
      test.ok(Object.entries(parameters).some(
        ([k, v]) => k.startsWith('SsmParameterValueawsserviceeksoptimizedami') &&
          (v as any).Default.includes(LATEST_KUBERNETES_VERSION),
      ), 'LATEST_KUBERNETES_VERSION should be in ssm parameters');
      test.done();
    },

    'EksOptimizedImage() with specific kubernetesVersion return correct AMI'(test: Test) {
      // GIVEN
      const { app, stack } = testFixtureNoVpc();

      // WHEN
      new eks.EksOptimizedImage({ kubernetesVersion: '1.15' }).getImage(stack);

      // THEN
      const assembly = app.synth();
      const parameters = assembly.getStackByName(stack.stackName).template.Parameters;
      test.ok(Object.entries(parameters).some(
        ([k, v]) => k.startsWith('SsmParameterValueawsserviceeksoptimizedami') &&
          (v as any).Default.includes('/amazon-linux-2/'),
      ), 'EKS STANDARD AMI should be in ssm parameters');
      test.ok(Object.entries(parameters).some(
        ([k, v]) => k.startsWith('SsmParameterValueawsserviceeksoptimizedami') &&
          (v as any).Default.includes('/1.15/'),
      ), 'kubernetesVersion should be in ssm parameters');
      test.done();
    },

    'EKS-Optimized AMI with GPU support when addCapacity'(test: Test) {
      // GIVEN
      const { app, stack } = testFixtureNoVpc();

      // WHEN
      new eks.LegacyCluster(stack, 'cluster', {
        defaultCapacity: 0,
        version: CLUSTER_VERSION,
      }).addCapacity('GPUCapacity', {
        instanceType: new ec2.InstanceType('g4dn.xlarge'),
      });

      // THEN
      const assembly = app.synth();
      const parameters = assembly.getStackByName(stack.stackName).template.Parameters;
      test.ok(Object.entries(parameters).some(
        ([k, v]) => k.startsWith('SsmParameterValueawsserviceeksoptimizedami') && (v as any).Default.includes('amazon-linux-2-gpu'),
      ), 'EKS AMI with GPU should be in ssm parameters');
      test.done();
    },
  },
};
