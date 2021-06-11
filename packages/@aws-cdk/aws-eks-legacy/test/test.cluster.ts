import { expect, haveResource, haveResourceLike, not } from '@aws-cdk/assert-internal';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as eks from '../lib';
import { spotInterruptHandler } from '../lib/spot-interrupt-handler';
import { testFixture, testFixtureNoVpc } from './util';

/* eslint-disable max-len */

export = {
  'a default cluster spans all subnets'(test: Test) {
    // GIVEN
    const { stack, vpc } = testFixture();

    // WHEN
    new eks.Cluster(stack, 'Cluster', { vpc, kubectlEnabled: false, defaultCapacity: 0 });

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
    new eks.Cluster(stack, 'cluster');

    // THEN
    expect(stack).to(haveResource('AWS::EC2::VPC'));
    test.done();
  },

  'default capacity': {

    'x2 m5.large by default'(test: Test) {
      // GIVEN
      const { stack } = testFixtureNoVpc();

      // WHEN
      const cluster = new eks.Cluster(stack, 'cluster');

      // THEN
      test.ok(cluster.defaultCapacity);
      expect(stack).to(haveResource('AWS::AutoScaling::AutoScalingGroup', { DesiredCapacity: '2' }));
      expect(stack).to(haveResource('AWS::AutoScaling::LaunchConfiguration', { InstanceType: 'm5.large' }));
      test.done();
    },

    'quantity and type can be customized'(test: Test) {
      // GIVEN
      const { stack } = testFixtureNoVpc();

      // WHEN
      const cluster = new eks.Cluster(stack, 'cluster', {
        defaultCapacity: 10,
        defaultCapacityInstance: new ec2.InstanceType('m2.xlarge'),
      });

      // THEN
      test.ok(cluster.defaultCapacity);
      expect(stack).to(haveResource('AWS::AutoScaling::AutoScalingGroup', { DesiredCapacity: '10' }));
      expect(stack).to(haveResource('AWS::AutoScaling::LaunchConfiguration', { InstanceType: 'm2.xlarge' }));
      test.done();
    },

    'defaultCapacity=0 will not allocate at all'(test: Test) {
      // GIVEN
      const { stack } = testFixtureNoVpc();

      // WHEN
      const cluster = new eks.Cluster(stack, 'cluster', { defaultCapacity: 0 });

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
    new eks.Cluster(stack, 'Cluster', { vpc, kubectlEnabled: false, defaultCapacity: 0 });

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
    new eks.Cluster(stack, 'Cluster', { vpc, kubectlEnabled: false, defaultCapacity: 0 });

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
    const cluster = new eks.Cluster(stack, 'Cluster', { vpc, kubectlEnabled: false, defaultCapacity: 0 });

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

  'exercise export/import'(test: Test) {
    // GIVEN
    const { stack: stack1, vpc, app } = testFixture();
    const stack2 = new cdk.Stack(app, 'stack2', { env: { region: 'us-east-1' } });
    const cluster = new eks.Cluster(stack1, 'Cluster', { vpc, kubectlEnabled: false, defaultCapacity: 0 });

    // WHEN
    const imported = eks.Cluster.fromClusterAttributes(stack2, 'Imported', {
      clusterArn: cluster.clusterArn,
      vpc: cluster.vpc,
      clusterEndpoint: cluster.clusterEndpoint,
      clusterName: cluster.clusterName,
      securityGroups: cluster.connections.securityGroups,
      clusterCertificateAuthorityData: cluster.clusterCertificateAuthorityData,
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
    const cluster = new eks.Cluster(stack, 'Cluster', { vpc, kubectlEnabled: false, defaultCapacity: 0 });

    test.throws(() => cluster.awsAuth, /Cannot define aws-auth mappings if kubectl is disabled/);
    test.throws(() => cluster.addResource('foo', {}), /Cannot define a KubernetesManifest resource on a cluster with kubectl disabled/);
    test.throws(() => cluster.addCapacity('boo', { instanceType: new ec2.InstanceType('r5d.24xlarge'), mapRole: true }),
      /Cannot map instance IAM role to RBAC if kubectl is disabled for the cluster/);
    test.throws(() => new eks.HelmChart(stack, 'MyChart', { cluster, chart: 'chart' }), /Cannot define a Helm chart on a cluster with kubectl disabled/);
    test.done();
  },

  'mastersRole can be used to map an IAM role to "system:masters" (required kubectl)'(test: Test) {
    // GIVEN
    const { stack, vpc } = testFixture();
    const role = new iam.Role(stack, 'role', { assumedBy: new iam.AnyPrincipal() });

    // WHEN
    new eks.Cluster(stack, 'Cluster', { vpc, mastersRole: role, defaultCapacity: 0 });

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
    const cluster = new eks.Cluster(stack, 'Cluster', { vpc, defaultCapacity: 0 });

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

  'when kubectl is enabled (default) adding capacity will automatically map its IAM role'(test: Test) {
    // GIVEN
    const { stack, vpc } = testFixture();
    const cluster = new eks.Cluster(stack, 'Cluster', { vpc, defaultCapacity: 0 });

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
    const cluster = new eks.Cluster(stack, 'Cluster', { vpc, defaultCapacity: 0 });

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
    const cluster = new eks.Cluster(stack, 'Cluster', { vpc, kubectlEnabled: false, defaultCapacity: 0 });

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
      new eks.Cluster(stack, 'Cluster');

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
      new eks.Cluster(stack, 'Cluster', { mastersRole });

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
      });

      // THEN
      const assembly = app.synth();
      const template = assembly.getStackByName(stack.stackName).template;
      test.deepEqual(template.Outputs, {
        ClusterMastersRoleArnB15964B1: { Value: { 'Fn::GetAtt': ['masters0D04F23D', 'Arn'] } },
      });
      test.done();
    },

    'when adding capacity, instance role ARN will not be outputed only if we do not auto-map aws-auth'(test: Test) {
      // GIVEN
      const { app, stack } = testFixtureNoVpc();

      // WHEN
      new eks.Cluster(stack, 'Cluster', {
        outputConfigCommand: false,
        kubectlEnabled: false,
      });

      // THEN
      const assembly = app.synth();
      const template = assembly.getStackByName(stack.stackName).template;
      test.deepEqual(template.Outputs, {
        ClusterDefaultCapacityInstanceRoleARN7DADF219: {
          Value: { 'Fn::GetAtt': ['ClusterDefaultCapacityInstanceRole3E209969', 'Arn'] },
        },
      });
      test.done();
    },
  },

  'boostrap user-data': {

    'rendered by default for ASGs'(test: Test) {
      // GIVEN
      const { app, stack } = testFixtureNoVpc();
      const cluster = new eks.Cluster(stack, 'Cluster', { defaultCapacity: 0 });

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
      const cluster = new eks.Cluster(stack, 'Cluster', { defaultCapacity: 0 });

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
      const cluster = new eks.Cluster(stack, 'Cluster', { defaultCapacity: 0 });

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
        const cluster = new eks.Cluster(stack, 'Cluster', { defaultCapacity: 0 });

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
        const cluster = new eks.Cluster(stack, 'Cluster', { defaultCapacity: 0 });

        // WHEN
        cluster.addCapacity('MyCapcity', {
          instanceType: new ec2.InstanceType('m3.xlargs'),
          spotPrice: '0.01',
        });

        // THEN
        expect(stack).to(haveResource(eks.KubernetesResource.RESOURCE_TYPE, { Manifest: JSON.stringify(spotInterruptHandler()) }));
        test.done();
      },

      'if kubectl is disabled, interrupt handler is not added'(test: Test) {
        // GIVEN
        const { stack } = testFixtureNoVpc();
        const cluster = new eks.Cluster(stack, 'Cluster', { defaultCapacity: 0, kubectlEnabled: false });

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
    const cluster = new eks.Cluster(stack, 'Cluster', { defaultCapacity: 0 });

    // THEN
    test.throws(() => cluster.addCapacity('MyCapcity', {
      instanceType: new ec2.InstanceType('m3.xlargs'),
      bootstrapEnabled: false,
      bootstrapOptions: { awsApiRetryAttempts: 10 },
    }), /Cannot specify "bootstrapOptions" if "bootstrapEnabled" is false/);
    test.done();
  },

  'EKS-Optimized AMI with GPU support'(test: Test) {
    // GIVEN
    const { app, stack } = testFixtureNoVpc();

    // WHEN
    new eks.Cluster(stack, 'cluster', {
      defaultCapacity: 2,
      defaultCapacityInstance: new ec2.InstanceType('g4dn.xlarge'),
    });

    // THEN
    const assembly = app.synth();
    const parameters = assembly.getStackByName(stack.stackName).template.Parameters;
    test.ok(Object.entries(parameters).some(
      ([k, v]) => k.startsWith('SsmParameterValueawsserviceeksoptimizedami') && (v as any).Default.includes('amazon-linux2-gpu'),
    ), 'EKS AMI with GPU should be in ssm parameters');
    test.done();
  },
};
