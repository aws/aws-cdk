import * as fs from 'fs';
import * as path from 'path';
import { countResources, expect, haveResource, haveResourceLike, not } from '@aws-cdk/assert';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as YAML from 'yaml';
import * as eks from '../lib';
import { KubectlLayer } from '../lib/kubectl-layer';
import { testFixture, testFixtureNoVpc } from './util';

/* eslint-disable max-len */

const CLUSTER_VERSION = eks.KubernetesVersion.V1_16;

export = {
  'a default cluster spans all subnets'(test: Test) {
    // GIVEN
    const { stack, vpc } = testFixture();

    // WHEN
    new eks.Cluster(stack, 'Cluster', { vpc, kubectlEnabled: false, defaultCapacity: 0, version: CLUSTER_VERSION });

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

  'create custom cluster correctly in any aws region'(test: Test) {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'stack', { env: { region: 'us-east-1' } });

    // WHEN
    const vpc = new ec2.Vpc(stack, 'VPC');
    new eks.Cluster(stack, 'Cluster', { vpc, kubectlEnabled: true, defaultCapacity: 0, version: CLUSTER_VERSION });
    const layer = KubectlLayer.getOrCreate(stack, {});

    // THEN
    expect(stack).to(haveResource('Custom::AWSCDK-EKS-Cluster'));
    expect(stack).to(haveResourceLike('AWS::Serverless::Application', {
      Location: {
        ApplicationId: 'arn:aws:serverlessrepo:us-east-1:903779448426:applications/lambda-layer-kubectl',
      },
    }));
    test.equal(layer.isChina(), false);
    test.done();
  },

  'create custom cluster correctly in any aws region in china'(test: Test) {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'stack', { env: { region: 'cn-north-1' } });

    // WHEN
    const vpc = new ec2.Vpc(stack, 'VPC');
    new eks.Cluster(stack, 'Cluster', { vpc, kubectlEnabled: true, defaultCapacity: 0, version: CLUSTER_VERSION });
    new KubectlLayer(stack, 'NewLayer');
    const layer = KubectlLayer.getOrCreate(stack);

    // THEN
    expect(stack).to(haveResource('Custom::AWSCDK-EKS-Cluster'));
    expect(stack).to(haveResourceLike('AWS::Serverless::Application', {
      Location: {
        ApplicationId: 'arn:aws-cn:serverlessrepo:cn-north-1:487369736442:applications/lambda-layer-kubectl',
      },
    }));
    test.equal(layer.isChina(), true);
    test.done();
  },

  'if "vpc" is not specified, vpc with default configuration will be created'(test: Test) {
    // GIVEN
    const { stack } = testFixtureNoVpc();

    // WHEN
    new eks.Cluster(stack, 'cluster', { version: CLUSTER_VERSION }) ;

    // THEN
    expect(stack).to(haveResource('AWS::EC2::VPC'));
    test.done();
  },

  'default capacity': {

    'x2 m5.large by default'(test: Test) {
      // GIVEN
      const { stack } = testFixtureNoVpc();

      // WHEN
      const cluster = new eks.Cluster(stack, 'cluster', { version: CLUSTER_VERSION });

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
      const cluster = new eks.Cluster(stack, 'cluster', {
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
      const cluster = new eks.Cluster(stack, 'cluster', { defaultCapacity: 0, version: CLUSTER_VERSION });

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
    new eks.Cluster(stack, 'Cluster', { vpc, kubectlEnabled: false, defaultCapacity: 0, version: CLUSTER_VERSION });

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
    new eks.Cluster(stack, 'Cluster', { vpc, kubectlEnabled: false, defaultCapacity: 0, version: CLUSTER_VERSION });

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
    const cluster = new eks.Cluster(stack, 'Cluster', {
      vpc, kubectlEnabled: false,
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
    const cluster = new eks.Cluster(stack, 'cluster', {
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
    const cluster = new eks.Cluster(stack, 'Cluster', {
      vpc,
      kubectlEnabled: false,
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
    const cluster = new eks.Cluster(stack, 'Cluster', {
      vpc,
      kubectlEnabled: false,
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
    const cluster = new eks.Cluster(stack1, 'Cluster', {
      vpc,
      kubectlEnabled: false,
      defaultCapacity: 0,
      version: CLUSTER_VERSION,
    });

    // WHEN
    const imported = eks.Cluster.fromClusterAttributes(stack2, 'Imported', {
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
    const cluster = new eks.Cluster(stack, 'Cluster', {
      vpc,
      kubectlEnabled: false,
      defaultCapacity: 0,
      version: CLUSTER_VERSION,
    });

    test.throws(() => cluster.awsAuth, /Cannot define aws-auth mappings if kubectl is disabled/);
    test.throws(() => cluster.addResource('foo', {}), /Unable to perform this operation since kubectl is not enabled for this cluster/);
    test.throws(() => cluster.addCapacity('boo', { instanceType: new ec2.InstanceType('r5d.24xlarge'), mapRole: true }),
      /Cannot map instance IAM role to RBAC if kubectl is disabled for the cluster/);
    test.throws(() => new eks.HelmChart(stack, 'MyChart', { cluster, chart: 'chart' }), /Unable to perform this operation since kubectl is not enabled for this cluster/);
    test.throws(() => cluster.openIdConnectProvider, /Cannot specify a OpenID Connect Provider if kubectl is disabled/);
    test.done();
  },

  'mastersRole can be used to map an IAM role to "system:masters" (required kubectl)'(test: Test) {
    // GIVEN
    const { stack, vpc } = testFixture();
    const role = new iam.Role(stack, 'role', { assumedBy: new iam.AnyPrincipal() });

    // WHEN
    new eks.Cluster(stack, 'Cluster', {
      vpc,
      mastersRole: role,
      defaultCapacity: 0,
      version: CLUSTER_VERSION,
    });

    // THEN
    expect(stack).to(haveResource(eks.KubernetesResource.RESOURCE_TYPE, {
      Manifest: {
        'Fn::Join': [
          '',
          [
            '[{"apiVersion":"v1","kind":"ConfigMap","metadata":{"name":"aws-auth","namespace":"kube-system"},"data":{"mapRoles":"[{\\"rolearn\\":\\"',
            {
              'Fn::GetAtt': [
                'roleC7B7E775',
                'Arn',
              ],
            },
            '\\",\\"username\\":\\"',
            {
              'Fn::GetAtt': [
                'roleC7B7E775',
                'Arn',
              ],
            },
            '\\",\\"groups\\":[\\"system:masters\\"]}]","mapUsers":"[]","mapAccounts":"[]"}}]',
          ],
        ],
      },
    }));

    test.done();
  },

  'addResource can be used to apply k8s manifests on this cluster'(test: Test) {
    // GIVEN
    const { stack, vpc } = testFixture();
    const cluster = new eks.Cluster(stack, 'Cluster', {
      vpc,
      defaultCapacity: 0,
      version: CLUSTER_VERSION,
    });

    // WHEN
    cluster.addResource('manifest1', { foo: 123 });
    cluster.addResource('manifest2', { bar: 123 }, { boor: [1, 2, 3] });

    // THEN
    expect(stack).to(haveResource(eks.KubernetesResource.RESOURCE_TYPE, {
      Manifest: '[{"foo":123}]',
    }));

    expect(stack).to(haveResource(eks.KubernetesResource.RESOURCE_TYPE, {
      Manifest: '[{"bar":123},{"boor":[1,2,3]}]',
    }));

    test.done();
  },

  'kubectl resources can be created in a separate stack'(test: Test) {
    // GIVEN
    const { stack, app } = testFixture();
    const cluster = new eks.Cluster(stack, 'cluster', { version: CLUSTER_VERSION }); // cluster is under stack2

    // WHEN resource is under stack2
    const stack2 = new cdk.Stack(app, 'stack2', { env: { account: stack.account, region: stack.region } });
    new eks.KubernetesResource(stack2, 'myresource', {
      cluster,
      manifest: [{ foo: 'bar' }],
    });

    // THEN
    app.synth(); // no cyclic dependency (see https://github.com/aws/aws-cdk/issues/7231)

    // expect a single resource in the 2nd stack
    expect(stack2).toMatch({
      Resources: {
        myresource49C6D325: {
          Type: 'Custom::AWSCDK-EKS-KubernetesResource',
          Properties: {
            ServiceToken: {
              'Fn::ImportValue': 'Stack:ExportsOutputFnGetAttawscdkawseksKubectlProviderNestedStackawscdkawseksKubectlProviderNestedStackResourceA7AEBA6BOutputsStackawscdkawseksKubectlProviderframeworkonEvent8897FD9BArn49BEF20C',
            },
            Manifest: '[{\"foo\":\"bar\"}]',
            ClusterName: { 'Fn::ImportValue': 'Stack:ExportsOutputRefclusterC5B25D0D98D553F5' },
            RoleArn: { 'Fn::ImportValue': 'Stack:ExportsOutputFnGetAttclusterCreationRole2B3B5002ArnF05122FC' },
          },
          UpdateReplacePolicy: 'Delete',
          DeletionPolicy: 'Delete',
        },
      },
    });

    test.done();
  },

  'when kubectl is enabled (default) adding capacity will automatically map its IAM role'(test: Test) {
    // GIVEN
    const { stack, vpc } = testFixture();
    const cluster = new eks.Cluster(stack, 'Cluster', {
      vpc,
      defaultCapacity: 0,
      version: CLUSTER_VERSION,
    });

    // WHEN
    cluster.addCapacity('default', {
      instanceType: new ec2.InstanceType('t2.nano'),
    });

    // THEN
    expect(stack).to(haveResource(eks.KubernetesResource.RESOURCE_TYPE, {
      Manifest: {
        'Fn::Join': [
          '',
          [
            '[{"apiVersion":"v1","kind":"ConfigMap","metadata":{"name":"aws-auth","namespace":"kube-system"},"data":{"mapRoles":"[{\\"rolearn\\":\\"',
            {
              'Fn::GetAtt': [
                'ClusterdefaultInstanceRoleF20A29CD',
                'Arn',
              ],
            },
            '\\",\\"username\\":\\"system:node:{{EC2PrivateDNSName}}\\",\\"groups\\":[\\"system:bootstrappers\\",\\"system:nodes\\"]}]","mapUsers":"[]","mapAccounts":"[]"}}]',
          ],
        ],
      },
    }));

    test.done();
  },

  'addCapacity will *not* map the IAM role if mapRole is false'(test: Test) {
    // GIVEN
    const { stack, vpc } = testFixture();
    const cluster = new eks.Cluster(stack, 'Cluster', {
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
    const cluster = new eks.Cluster(stack, 'Cluster', {
      vpc,
      kubectlEnabled: false,
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
      new eks.Cluster(stack, 'Cluster', { version: CLUSTER_VERSION });

      // THEN
      const assembly = app.synth();
      const template = assembly.getStackByName(stack.stackName).template;
      test.deepEqual(template.Outputs, {
        ClusterConfigCommand43AAE40F: { Value: { 'Fn::Join': ['', ['aws eks update-kubeconfig --name ', { Ref: 'Cluster9EE0221C' }, ' --region us-east-1']] } },
        ClusterGetTokenCommand06AE992E: { Value: { 'Fn::Join': ['', ['aws eks get-token --cluster-name ', { Ref: 'Cluster9EE0221C' }, ' --region us-east-1']] } },
      });
      test.done();
    },

    'if masters role is defined, it should be included in the config command'(test: Test) {
      // GIVEN
      const { app, stack } = testFixtureNoVpc();

      // WHEN
      const mastersRole = new iam.Role(stack, 'masters', { assumedBy: new iam.AccountRootPrincipal() });
      new eks.Cluster(stack, 'Cluster', {
        mastersRole,
        version: CLUSTER_VERSION,
      });

      // THEN
      const assembly = app.synth();
      const template = assembly.getStackByName(stack.stackName).template;
      test.deepEqual(template.Outputs, {
        ClusterConfigCommand43AAE40F: { Value: { 'Fn::Join': ['', ['aws eks update-kubeconfig --name ', { Ref: 'Cluster9EE0221C' }, ' --region us-east-1 --role-arn ', { 'Fn::GetAtt': ['masters0D04F23D', 'Arn'] }]] } },
        ClusterGetTokenCommand06AE992E: { Value: { 'Fn::Join': ['', ['aws eks get-token --cluster-name ', { Ref: 'Cluster9EE0221C' }, ' --region us-east-1 --role-arn ', { 'Fn::GetAtt': ['masters0D04F23D', 'Arn'] }]] } },
      });
      test.done();
    },

    'if `outputConfigCommand=false` will disabled the output'(test: Test) {
      // GIVEN
      const { app, stack } = testFixtureNoVpc();

      // WHEN
      const mastersRole = new iam.Role(stack, 'masters', { assumedBy: new iam.AccountRootPrincipal() });
      new eks.Cluster(stack, 'Cluster', {
        mastersRole,
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
      new eks.Cluster(stack, 'Cluster', {
        outputConfigCommand: false,
        outputClusterName: true,
        version: CLUSTER_VERSION,
      });

      // THEN
      const assembly = app.synth();
      const template = assembly.getStackByName(stack.stackName).template;
      test.deepEqual(template.Outputs, {
        ClusterClusterNameEB26049E: { Value: { Ref: 'Cluster9EE0221C' } },
      });
      test.done();
    },

    '`outputMastersRoleArn` can be used to synthesize an output with the arn of the masters role if defined'(test: Test) {
      // GIVEN
      const { app, stack } = testFixtureNoVpc();

      // WHEN
      new eks.Cluster(stack, 'Cluster', {
        outputConfigCommand: false,
        outputMastersRoleArn: true,
        mastersRole: new iam.Role(stack, 'masters', { assumedBy: new iam.AccountRootPrincipal() }),
        version: CLUSTER_VERSION,
      });

      // THEN
      const assembly = app.synth();
      const template = assembly.getStackByName(stack.stackName).template;
      test.deepEqual(template.Outputs, {
        ClusterMastersRoleArnB15964B1: { Value: { 'Fn::GetAtt': ['masters0D04F23D', 'Arn'] } },
      });
      test.done();
    },

    'boostrap user-data': {

      'rendered by default for ASGs'(test: Test) {
        // GIVEN
        const { app, stack } = testFixtureNoVpc();
        const cluster = new eks.Cluster(stack, 'Cluster', { defaultCapacity: 0, version: CLUSTER_VERSION });

        // WHEN
        cluster.addCapacity('MyCapcity', { instanceType: new ec2.InstanceType('m3.xlargs') });

        // THEN
        const template = app.synth().getStackByName(stack.stackName).template;
        const userData = template.Resources.ClusterMyCapcityLaunchConfig58583345.Properties.UserData;
        test.deepEqual(userData, { 'Fn::Base64': { 'Fn::Join': ['', ['#!/bin/bash\nset -o xtrace\n/etc/eks/bootstrap.sh ', { Ref: 'Cluster9EE0221C' }, ' --kubelet-extra-args "--node-labels lifecycle=OnDemand" --use-max-pods true\n/opt/aws/bin/cfn-signal --exit-code $? --stack Stack --resource ClusterMyCapcityASGD4CD8B97 --region us-east-1']] } });
        test.done();
      },

      'not rendered if bootstrap is disabled'(test: Test) {
        // GIVEN
        const { app, stack } = testFixtureNoVpc();
        const cluster = new eks.Cluster(stack, 'Cluster', { defaultCapacity: 0, version: CLUSTER_VERSION });

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
        const cluster = new eks.Cluster(stack, 'Cluster', { defaultCapacity: 0, version: CLUSTER_VERSION });

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
        test.deepEqual(userData, { 'Fn::Base64': { 'Fn::Join': ['', ['#!/bin/bash\nset -o xtrace\n/etc/eks/bootstrap.sh ', { Ref: 'Cluster9EE0221C' }, ' --kubelet-extra-args "--node-labels lifecycle=OnDemand  --node-labels FOO=42" --use-max-pods true\n/opt/aws/bin/cfn-signal --exit-code $? --stack Stack --resource ClusterMyCapcityASGD4CD8B97 --region us-east-1']] } });
        test.done();
      },

      'spot instances': {

        'nodes labeled an tainted accordingly'(test: Test) {
          // GIVEN
          const { app, stack } = testFixtureNoVpc();
          const cluster = new eks.Cluster(stack, 'Cluster', { defaultCapacity: 0, version: CLUSTER_VERSION });

          // WHEN
          cluster.addCapacity('MyCapcity', {
            instanceType: new ec2.InstanceType('m3.xlargs'),
            spotPrice: '0.01',
          });

          // THEN
          const template = app.synth().getStackByName(stack.stackName).template;
          const userData = template.Resources.ClusterMyCapcityLaunchConfig58583345.Properties.UserData;
          test.deepEqual(userData, { 'Fn::Base64': { 'Fn::Join': ['', ['#!/bin/bash\nset -o xtrace\n/etc/eks/bootstrap.sh ', { Ref: 'Cluster9EE0221C' }, ' --kubelet-extra-args "--node-labels lifecycle=Ec2Spot --register-with-taints=spotInstance=true:PreferNoSchedule" --use-max-pods true\n/opt/aws/bin/cfn-signal --exit-code $? --stack Stack --resource ClusterMyCapcityASGD4CD8B97 --region us-east-1']] } });
          test.done();
        },

        'if kubectl is enabled, the interrupt handler is added'(test: Test) {
          // GIVEN
          const { stack } = testFixtureNoVpc();
          const cluster = new eks.Cluster(stack, 'Cluster', { defaultCapacity: 0, version: CLUSTER_VERSION });

          // WHEN
          cluster.addCapacity('MyCapcity', {
            instanceType: new ec2.InstanceType('m3.xlarge'),
            spotPrice: '0.01',
          });

          // THEN
          expect(stack).to(haveResource(eks.HelmChart.RESOURCE_TYPE, {
            Release: 'stackclusterchartspotinterrupthandlerdec62e07',
            Chart: 'aws-node-termination-handler',
            Values: '{\"nodeSelector.lifecycle\":\"Ec2Spot\"}',
            Namespace: 'kube-system',
            Repository: 'https://aws.github.io/eks-charts',
          }));
          test.done();
        },

        'its possible to add two capacities with spot instances and only one stop handler will be installed'(test: Test) {
          // GIVEN
          const { stack } = testFixtureNoVpc();
          const cluster = new eks.Cluster(stack, 'Cluster', { defaultCapacity: 0, version: CLUSTER_VERSION });

          // WHEN
          cluster.addCapacity('Spot1', {
            instanceType: new ec2.InstanceType('m3.xlarge'),
            spotPrice: '0.01',
          });

          cluster.addCapacity('Spot2', {
            instanceType: new ec2.InstanceType('m4.xlarge'),
            spotPrice: '0.01',
          });

          // THEN
          expect(stack).to(countResources(eks.HelmChart.RESOURCE_TYPE, 1));
          test.done();
        },

        'if kubectl is disabled, interrupt handler is not added'(test: Test) {
          // GIVEN
          const { stack } = testFixtureNoVpc();
          const cluster = new eks.Cluster(stack, 'Cluster', {
            defaultCapacity: 0,
            kubectlEnabled: false,
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
      const cluster = new eks.Cluster(stack, 'Cluster', { defaultCapacity: 0, version: CLUSTER_VERSION });

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
      new eks.Cluster(stack, 'cluster', {
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

    'when using custom resource a creation role & policy is defined'(test: Test) {
      // GIVEN
      const { stack } = testFixture();

      // WHEN
      new eks.Cluster(stack, 'MyCluster', {
        clusterName: 'my-cluster-name',
        version: CLUSTER_VERSION,
      });

      // THEN
      expect(stack).to(haveResource('Custom::AWSCDK-EKS-Cluster', {
        Config: {
          name: 'my-cluster-name',
          roleArn: { 'Fn::GetAtt': ['MyClusterRoleBA20FE72', 'Arn'] },
          version: '1.16',
          resourcesVpcConfig: {
            securityGroupIds: [{ 'Fn::GetAtt': ['MyClusterControlPlaneSecurityGroup6B658F79', 'GroupId'] }],
            subnetIds: [
              { Ref: 'MyClusterDefaultVpcPublicSubnet1SubnetFAE5A9B6' },
              { Ref: 'MyClusterDefaultVpcPublicSubnet2SubnetF6D028A0' },
              { Ref: 'MyClusterDefaultVpcPrivateSubnet1SubnetE1D0DCDB' },
              { Ref: 'MyClusterDefaultVpcPrivateSubnet2Subnet11FEA8D0' },
            ],
          },
        },
      }));

      // role can be assumed by 3 lambda handlers (2 for the cluster resource and 1 for the kubernetes resource)
      expect(stack).to(haveResource('AWS::IAM::Role', {
        AssumeRolePolicyDocument: {
          Statement: [
            {
              Action: 'sts:AssumeRole',
              Effect: 'Allow',
              Principal: {
                AWS: [
                  {
                    'Fn::GetAtt': [
                      'awscdkawseksClusterResourceProviderNestedStackawscdkawseksClusterResourceProviderNestedStackResource9827C454',
                      'Outputs.StackawscdkawseksClusterResourceProviderOnEventHandlerServiceRole3AEE0A43Arn',
                    ],
                  },
                  {
                    'Fn::GetAtt': [
                      'awscdkawseksClusterResourceProviderNestedStackawscdkawseksClusterResourceProviderNestedStackResource9827C454',
                      'Outputs.StackawscdkawseksClusterResourceProviderIsCompleteHandlerServiceRole8E7F1C11Arn',
                    ],
                  },
                ],
              },
            },
            {
              Action: 'sts:AssumeRole',
              Effect: 'Allow',
              Principal: {
                AWS: {
                  'Fn::GetAtt': [
                    'awscdkawseksKubectlProviderNestedStackawscdkawseksKubectlProviderNestedStackResourceA7AEBA6B',
                    'Outputs.StackawscdkawseksKubectlProviderHandlerServiceRole2C52B3ECArn',
                  ],
                },
              },
            },
          ],
          Version: '2012-10-17',
        },
      }));

      // policy allows creation role to pass the cluster role and to interact with the cluster (given we know the explicit cluster name)
      expect(stack).to(haveResource('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: [
            {
              Action: 'iam:PassRole',
              Effect: 'Allow',
              Resource: {
                'Fn::GetAtt': [
                  'MyClusterRoleBA20FE72',
                  'Arn',
                ],
              },
            },
            {
              Action: [
                'ec2:DescribeSubnets',
                'ec2:DescribeRouteTables',
              ],
              Effect: 'Allow',
              Resource: '*',
            },
            {
              Action: [
                'eks:CreateCluster',
                'eks:DescribeCluster',
                'eks:DescribeUpdate',
                'eks:DeleteCluster',
                'eks:UpdateClusterVersion',
                'eks:UpdateClusterConfig',
                'eks:CreateFargateProfile',
                'eks:TagResource',
                'eks:UntagResource',
              ],
              Effect: 'Allow',
              Resource: [{
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
                    ':cluster/my-cluster-name',
                  ],
                ],
              }, {
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
                    ':cluster/my-cluster-name/*',
                  ],
                ],
              }],
            },
            {
              Action: [
                'eks:DescribeFargateProfile',
                'eks:DeleteFargateProfile',
              ],
              Effect: 'Allow',
              Resource: {
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
                    ':fargateprofile/my-cluster-name/*',
                  ],
                ],
              },
            },
            {
              Action: ['iam:GetRole', 'iam:listAttachedRolePolicies'],
              Effect: 'Allow',
              Resource: '*',
            },
            {
              Action: 'iam:CreateServiceLinkedRole',
              Effect: 'Allow',
              Resource: '*',
            },
            {
              Action: 'ec2:DescribeVpcs',
              Effect: 'Allow',
              Resource: {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':ec2:us-east-1:',
                    {
                      Ref: 'AWS::AccountId',
                    },
                    ':vpc/',
                    {
                      Ref: 'MyClusterDefaultVpc76C24A38',
                    },
                  ],
                ],
              },
            },
          ],
          Version: '2012-10-17',
        },
      }));
      test.done();
    },

    'if an explicit cluster name is not provided, the creation role policy is wider (allows interacting with all clusters)'(test: Test) {
      // GIVEN
      const { stack } = testFixture();

      // WHEN
      new eks.Cluster(stack, 'MyCluster', { version: CLUSTER_VERSION });

      // THEN
      expect(stack).to(haveResource('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: [
            {
              Action: 'iam:PassRole',
              Effect: 'Allow',
              Resource: {
                'Fn::GetAtt': [
                  'MyClusterRoleBA20FE72',
                  'Arn',
                ],
              },
            },
            {
              Action: [
                'ec2:DescribeSubnets',
                'ec2:DescribeRouteTables',
              ],
              Effect: 'Allow',
              Resource: '*',
            },
            {
              Action: [
                'eks:CreateCluster',
                'eks:DescribeCluster',
                'eks:DescribeUpdate',
                'eks:DeleteCluster',
                'eks:UpdateClusterVersion',
                'eks:UpdateClusterConfig',
                'eks:CreateFargateProfile',
                'eks:TagResource',
                'eks:UntagResource',
              ],
              Effect: 'Allow',
              Resource: ['*'],
            },
            {
              Action: [
                'eks:DescribeFargateProfile',
                'eks:DeleteFargateProfile',
              ],
              Effect: 'Allow',
              Resource: '*',
            },
            {
              Action: ['iam:GetRole', 'iam:listAttachedRolePolicies'],
              Effect: 'Allow',
              Resource: '*',
            },
            {
              Action: 'iam:CreateServiceLinkedRole',
              Effect: 'Allow',
              Resource: '*',
            },
            {
              Action: 'ec2:DescribeVpcs',
              Effect: 'Allow',
              Resource: {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':ec2:us-east-1:',
                    {
                      Ref: 'AWS::AccountId',
                    },
                    ':vpc/',
                    {
                      Ref: 'MyClusterDefaultVpc76C24A38',
                    },
                  ],
                ],
              },
            },
          ],
          Version: '2012-10-17',
        },
      }));
      test.done();
    },

    'if helm charts are used, its resource provider is allowed to assume the creation role'(test: Test) {
      // GIVEN
      const { stack } = testFixture();
      const cluster = new eks.Cluster(stack, 'MyCluster', {
        clusterName: 'my-cluster-name',
        version: CLUSTER_VERSION,
      });

      // WHEN
      cluster.addChart('MyChart', {
        chart: 'foo',
      });

      // THEN

      // role can be assumed by 4 principals: two for the cluster resource, one
      // for kubernetes resource and one for the helm resource.
      expect(stack).to(haveResource('AWS::IAM::Role', {
        AssumeRolePolicyDocument: {
          Statement: [
            {
              Action: 'sts:AssumeRole',
              Effect: 'Allow',
              Principal: {
                AWS: [
                  {
                    'Fn::GetAtt': [
                      'awscdkawseksClusterResourceProviderNestedStackawscdkawseksClusterResourceProviderNestedStackResource9827C454',
                      'Outputs.StackawscdkawseksClusterResourceProviderOnEventHandlerServiceRole3AEE0A43Arn',
                    ],
                  },
                  {
                    'Fn::GetAtt': [
                      'awscdkawseksClusterResourceProviderNestedStackawscdkawseksClusterResourceProviderNestedStackResource9827C454',
                      'Outputs.StackawscdkawseksClusterResourceProviderIsCompleteHandlerServiceRole8E7F1C11Arn',
                    ],
                  },
                ],
              },
            },
            {
              Action: 'sts:AssumeRole',
              Effect: 'Allow',
              Principal: {
                AWS: {
                  'Fn::GetAtt': [
                    'awscdkawseksKubectlProviderNestedStackawscdkawseksKubectlProviderNestedStackResourceA7AEBA6B',
                    'Outputs.StackawscdkawseksKubectlProviderHandlerServiceRole2C52B3ECArn',
                  ],
                },
              },
            },
          ],
          Version: '2012-10-17',
        },
      }));
      test.done();
    },

    'coreDnsComputeType will patch the coreDNS configuration to use a "fargate" compute type and restore to "ec2" upon removal'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      new eks.Cluster(stack, 'MyCluster', {
        coreDnsComputeType: eks.CoreDnsComputeType.FARGATE,
        version: CLUSTER_VERSION,
      });

      // THEN
      expect(stack).to(haveResource('Custom::AWSCDK-EKS-KubernetesPatch', {
        ResourceName: 'deployment/coredns',
        ResourceNamespace: 'kube-system',
        ApplyPatchJson: '{"spec":{"template":{"metadata":{"annotations":{"eks.amazonaws.com/compute-type":"fargate"}}}}}',
        RestorePatchJson: '{"spec":{"template":{"metadata":{"annotations":{"eks.amazonaws.com/compute-type":"ec2"}}}}}',
        ClusterName: {
          Ref: 'MyCluster8AD82BF8',
        },
        RoleArn: {
          'Fn::GetAtt': [
            'MyClusterCreationRoleB5FA4FF3',
            'Arn',
          ],
        },
      }));
      test.done();
    },
    'if openIDConnectProvider a new OpenIDConnectProvider resource is created and exposed'(test: Test) {
      // GIVEN
      const { stack } = testFixtureNoVpc();
      const cluster = new eks.Cluster(stack, 'Cluster', { defaultCapacity: 0, version: CLUSTER_VERSION });

      // WHEN
      const provider = cluster.openIdConnectProvider;

      // THEN
      test.equal(provider, cluster.openIdConnectProvider, 'openIdConnect provider is different and created more than once.');
      expect(stack).to(haveResource('Custom::AWSCDKOpenIdConnectProvider', {
        ServiceToken: {
          'Fn::GetAtt': [
            'CustomAWSCDKOpenIdConnectProviderCustomResourceProviderHandlerF2C543E0',
            'Arn',
          ],
        },
        ClientIDList: [
          'sts.amazonaws.com',
        ],
        ThumbprintList: [
          '9e99a48a9960b14926bb7f3b02e22da2b0ab7280',
        ],
        Url: {
          'Fn::GetAtt': [
            'Cluster9EE0221C',
            'OpenIdConnectIssuerUrl',
          ],
        },
      }));
      test.done();
    },
    'inference instances are supported'(test: Test) {
      // GIVEN
      const { stack } = testFixtureNoVpc();
      const cluster = new eks.Cluster(stack, 'Cluster', { defaultCapacity: 0, version: CLUSTER_VERSION });

      // WHEN
      cluster.addCapacity('InferenceInstances', {
        instanceType: new ec2.InstanceType('inf1.2xlarge'),
        minCapacity: 1,
      });
      const fileContents = fs.readFileSync(path.join(__dirname, '../lib', 'addons/neuron-device-plugin.yaml'), 'utf8');
      const sanitized = YAML.parse(fileContents);

      // THEN
      expect(stack).to(haveResource(eks.KubernetesResource.RESOURCE_TYPE, {
        Manifest: JSON.stringify([sanitized]),
      }));
      test.done();
    },

    'kubectl resources are always created after all fargate profiles'(test: Test) {
      // GIVEN
      const { stack, app } = testFixture();
      const cluster = new eks.Cluster(stack, 'Cluster', { version: CLUSTER_VERSION });

      // WHEN
      cluster.addFargateProfile('profile1', { selectors: [{ namespace: 'profile1' }] });
      cluster.addResource('resource1', { foo: 123 });
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

      test.deepEqual(barrier.DependsOn, [
        'Clusterfargateprofileprofile1PodExecutionRoleE85F87B5',
        'Clusterfargateprofileprofile129AEA3C6',
        'Clusterfargateprofileprofile2PodExecutionRole22670AF8',
        'Clusterfargateprofileprofile233B9A117',
        'Clusterfargateprofileprofile3PodExecutionRole475C0D8F',
        'Clusterfargateprofileprofile3D06F3076',
        'Clusterfargateprofileprofile4PodExecutionRole086057FB',
        'Clusterfargateprofileprofile4A0E3BBE8',
        'ClusterCreationRoleDefaultPolicyE8BDFC7B',
        'ClusterCreationRole360249B6',
        'Cluster9EE0221C',
      ]);

      const kubectlResources = ['chartF2447AFC', 'patch1B964AC93', 'Clustermanifestresource10B1C9505', 'ClusterAwsAuthmanifestFE51F8AE'];

      // check that all kubectl resources depend on the barrier
      for (const r of kubectlResources) {
        test.deepEqual(template.Resources[r].DependsOn, ['ClusterKubectlReadyBarrier200052AF']);
      }

      test.done();
    },

    'kubectl provider role is trusted to assume cluster creation role'(test: Test) {
      // GIVEN
      const { stack, app } = testFixture();
      const c1 = new eks.Cluster(stack, 'Cluster1', { version: CLUSTER_VERSION });
      const c2 = new eks.Cluster(stack, 'Cluster2', { version: CLUSTER_VERSION });

      // WHEN

      // activate kubectl provider
      c1.addResource('c1a', { foo: 123 });
      c1.addResource('c1b', { foo: 123 });
      c2.addResource('c2', { foo: 123 });

      // THEN
      const template = app.synth().getStackArtifact(stack.artifactId).template;

      const creationRoleToKubectlRole = {
        Cluster1CreationRoleA231BE8D: 'Outputs.StackawscdkawseksKubectlProviderHandlerServiceRole2C52B3ECArn',
        Cluster2CreationRole9254EAB6: 'Outputs.StackawscdkawseksKubectlProviderHandlerServiceRole2C52B3ECArn',
      };

      // verify that the kubectl role appears as the 2nd IAM trust policy statement
      for (const [creationRole, kubectlRole] of Object.entries(creationRoleToKubectlRole)) {
        const trustPolicy = template.Resources[creationRole].Properties.AssumeRolePolicyDocument.Statement;
        test.equal(trustPolicy.length, 2, 'expecting the creation role\'s trust policy to include two statements');
        test.deepEqual(trustPolicy[1].Principal.AWS['Fn::GetAtt'][1], kubectlRole);
      }
      test.done();
    },
  },
};
