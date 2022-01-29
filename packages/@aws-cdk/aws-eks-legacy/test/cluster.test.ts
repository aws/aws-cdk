import { Template } from '@aws-cdk/assertions';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import { describeDeprecated } from '@aws-cdk/cdk-build-tools';
import * as cdk from '@aws-cdk/core';
import * as eks from '../lib';
import { spotInterruptHandler } from '../lib/spot-interrupt-handler';
import { testFixture, testFixtureNoVpc } from './util';

/* eslint-disable max-len */

describeDeprecated('cluster', () => {
  test('a default cluster spans all subnets', () => {
    // GIVEN
    const { stack, vpc } = testFixture();

    // WHEN
    new eks.Cluster(stack, 'Cluster', { vpc, kubectlEnabled: false, defaultCapacity: 0 });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EKS::Cluster', {
      ResourcesVpcConfig: {
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
    new eks.Cluster(stack, 'cluster');

    // THEN
    Template.fromStack(stack).resourceCountIs('AWS::EC2::VPC', 1);

  });

  describe('default capacity', () => {

    test('x2 m5.large by default', () => {
      // GIVEN
      const { stack } = testFixtureNoVpc();

      // WHEN
      const cluster = new eks.Cluster(stack, 'cluster');

      // THEN
      expect(cluster.defaultCapacity).toBeDefined();
      Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::AutoScalingGroup', { DesiredCapacity: '2' });
      Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LaunchConfiguration', { InstanceType: 'm5.large' });

    });

    test('quantity and type can be customized', () => {
      // GIVEN
      const { stack } = testFixtureNoVpc();

      // WHEN
      const cluster = new eks.Cluster(stack, 'cluster', {
        defaultCapacity: 10,
        defaultCapacityInstance: new ec2.InstanceType('m2.xlarge'),
      });

      // THEN
      expect(cluster.defaultCapacity).toBeDefined();
      Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::AutoScalingGroup', { DesiredCapacity: '10' });
      Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LaunchConfiguration', { InstanceType: 'm2.xlarge' });

    });

    test('defaultCapacity=0 will not allocate at all', () => {
      // GIVEN
      const { stack } = testFixtureNoVpc();

      // WHEN
      const cluster = new eks.Cluster(stack, 'cluster', { defaultCapacity: 0 });

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
    new eks.Cluster(stack, 'Cluster', { vpc, kubectlEnabled: false, defaultCapacity: 0 });

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
    new eks.Cluster(stack, 'Cluster', { vpc, kubectlEnabled: false, defaultCapacity: 0 });

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

  test('adding capacity creates an ASG with tags', () => {
    // GIVEN
    const { stack, vpc } = testFixture();
    const cluster = new eks.Cluster(stack, 'Cluster', { vpc, kubectlEnabled: false, defaultCapacity: 0 });

    // WHEN
    cluster.addCapacity('Default', {
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

  test('exercise export/import', () => {
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
    Template.fromStack(stack2).templateMatches({
      Outputs: {
        ClusterARN: {
          Value: {
            'Fn::ImportValue': 'Stack:ExportsOutputFnGetAttClusterEB0386A7Arn2F2E3C3F',
          },
        },
      },
    });

  });

  test('disabled features when kubectl is disabled', () => {
    // GIVEN
    const { stack, vpc } = testFixture();
    const cluster = new eks.Cluster(stack, 'Cluster', { vpc, kubectlEnabled: false, defaultCapacity: 0 });

    expect(() => cluster.awsAuth).toThrow(/Cannot define aws-auth mappings if kubectl is disabled/);
    expect(() => cluster.addResource('foo', {})).toThrow(/Cannot define a KubernetesManifest resource on a cluster with kubectl disabled/);
    expect(() => cluster.addCapacity('boo', { instanceType: new ec2.InstanceType('r5d.24xlarge'), mapRole: true })).toThrow(
      /Cannot map instance IAM role to RBAC if kubectl is disabled for the cluster/);
    expect(() => new eks.HelmChart(stack, 'MyChart', { cluster, chart: 'chart' })).toThrow(/Cannot define a Helm chart on a cluster with kubectl disabled/);

  });

  test('mastersRole can be used to map an IAM role to "system:masters" (required kubectl)', () => {
    // GIVEN
    const { stack, vpc } = testFixture();
    const role = new iam.Role(stack, 'role', { assumedBy: new iam.AnyPrincipal() });

    // WHEN
    new eks.Cluster(stack, 'Cluster', { vpc, mastersRole: role, defaultCapacity: 0 });

    // THEN
    Template.fromStack(stack).hasResourceProperties(eks.KubernetesResource.RESOURCE_TYPE, {
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
    });


  });

  test('addResource can be used to apply k8s manifests on this cluster', () => {
    // GIVEN
    const { stack, vpc } = testFixture();
    const cluster = new eks.Cluster(stack, 'Cluster', { vpc, defaultCapacity: 0 });

    // WHEN
    cluster.addResource('manifest1', { foo: 123 });
    cluster.addResource('manifest2', { bar: 123 }, { boor: [1, 2, 3] });

    // THEN
    Template.fromStack(stack).hasResourceProperties(eks.KubernetesResource.RESOURCE_TYPE, {
      Manifest: '[{"foo":123}]',
    });

    Template.fromStack(stack).hasResourceProperties(eks.KubernetesResource.RESOURCE_TYPE, {
      Manifest: '[{"bar":123},{"boor":[1,2,3]}]',
    });


  });

  test('when kubectl is enabled (default) adding capacity will automatically map its IAM role', () => {
    // GIVEN
    const { stack, vpc } = testFixture();
    const cluster = new eks.Cluster(stack, 'Cluster', { vpc, defaultCapacity: 0 });

    // WHEN
    cluster.addCapacity('default', {
      instanceType: new ec2.InstanceType('t2.nano'),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties(eks.KubernetesResource.RESOURCE_TYPE, {
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
    });


  });

  test('addCapacity will *not* map the IAM role if mapRole is false', () => {
    // GIVEN
    const { stack, vpc } = testFixture();
    const cluster = new eks.Cluster(stack, 'Cluster', { vpc, defaultCapacity: 0 });

    // WHEN
    cluster.addCapacity('default', {
      instanceType: new ec2.InstanceType('t2.nano'),
      mapRole: false,
    });

    // THEN
    Template.fromStack(stack).resourceCountIs(eks.KubernetesResource.RESOURCE_TYPE, 0);

  });

  test('addCapacity will *not* map the IAM role if kubectl is disabled', () => {
    // GIVEN
    const { stack, vpc } = testFixture();
    const cluster = new eks.Cluster(stack, 'Cluster', { vpc, kubectlEnabled: false, defaultCapacity: 0 });

    // WHEN
    cluster.addCapacity('default', {
      instanceType: new ec2.InstanceType('t2.nano'),
    });

    // THEN
    Template.fromStack(stack).resourceCountIs(eks.KubernetesResource.RESOURCE_TYPE, 0);

  });

  describe('outputs', () => {
    test('aws eks update-kubeconfig is the only output synthesized by default', () => {
      // GIVEN
      const { app, stack } = testFixtureNoVpc();

      // WHEN
      new eks.Cluster(stack, 'Cluster');

      // THEN
      const assembly = app.synth();
      const template = assembly.getStackByName(stack.stackName).template;
      expect(template.Outputs).toEqual({
        ClusterConfigCommand43AAE40F: { Value: { 'Fn::Join': ['', ['aws eks update-kubeconfig --name ', { Ref: 'Cluster9EE0221C' }, ' --region us-east-1']] } },
        ClusterGetTokenCommand06AE992E: { Value: { 'Fn::Join': ['', ['aws eks get-token --cluster-name ', { Ref: 'Cluster9EE0221C' }, ' --region us-east-1']] } },
      });

    });

    test('if masters role is defined, it should be included in the config command', () => {
      // GIVEN
      const { app, stack } = testFixtureNoVpc();

      // WHEN
      const mastersRole = new iam.Role(stack, 'masters', { assumedBy: new iam.AccountRootPrincipal() });
      new eks.Cluster(stack, 'Cluster', { mastersRole });

      // THEN
      const assembly = app.synth();
      const template = assembly.getStackByName(stack.stackName).template;
      expect(template.Outputs).toEqual({
        ClusterConfigCommand43AAE40F: { Value: { 'Fn::Join': ['', ['aws eks update-kubeconfig --name ', { Ref: 'Cluster9EE0221C' }, ' --region us-east-1 --role-arn ', { 'Fn::GetAtt': ['masters0D04F23D', 'Arn'] }]] } },
        ClusterGetTokenCommand06AE992E: { Value: { 'Fn::Join': ['', ['aws eks get-token --cluster-name ', { Ref: 'Cluster9EE0221C' }, ' --region us-east-1 --role-arn ', { 'Fn::GetAtt': ['masters0D04F23D', 'Arn'] }]] } },
      });

    });

    test('if `outputConfigCommand=false` will disabled the output', () => {
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
      expect(template.Outputs).toBeUndefined(); // no outputs

    });

    test('`outputClusterName` can be used to synthesize an output with the cluster name', () => {
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
      expect(template.Outputs).toEqual({
        ClusterClusterNameEB26049E: { Value: { Ref: 'Cluster9EE0221C' } },
      });

    });

    test('`outputMastersRoleArn` can be used to synthesize an output with the arn of the masters role if defined', () => {
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
      expect(template.Outputs).toEqual({
        ClusterMastersRoleArnB15964B1: { Value: { 'Fn::GetAtt': ['masters0D04F23D', 'Arn'] } },
      });

    });

    test('when adding capacity, instance role ARN will not be outputed only if we do not auto-map aws-auth', () => {
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
      expect(template.Outputs).toEqual({
        ClusterDefaultCapacityInstanceRoleARN7DADF219: {
          Value: { 'Fn::GetAtt': ['ClusterDefaultCapacityInstanceRole3E209969', 'Arn'] },
        },
      });

    });
  });

  describe('boostrap user-data', () => {

    test('rendered by default for ASGs', () => {
      // GIVEN
      const { app, stack } = testFixtureNoVpc();
      const cluster = new eks.Cluster(stack, 'Cluster', { defaultCapacity: 0 });

      // WHEN
      cluster.addCapacity('MyCapcity', { instanceType: new ec2.InstanceType('m3.xlargs') });

      // THEN
      const template = app.synth().getStackByName(stack.stackName).template;
      const userData = template.Resources.ClusterMyCapcityLaunchConfig58583345.Properties.UserData;
      expect(userData).toEqual({ 'Fn::Base64': { 'Fn::Join': ['', ['#!/bin/bash\nset -o xtrace\n/etc/eks/bootstrap.sh ', { Ref: 'Cluster9EE0221C' }, ' --kubelet-extra-args "--node-labels lifecycle=OnDemand" --use-max-pods true\n/opt/aws/bin/cfn-signal --exit-code $? --stack Stack --resource ClusterMyCapcityASGD4CD8B97 --region us-east-1']] } });

    });

    test('not rendered if bootstrap is disabled', () => {
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
      expect(userData).toEqual({ 'Fn::Base64': '#!/bin/bash' });

    });

    // cursory test for options: see test.user-data.ts for full suite
    test('bootstrap options', () => {
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
      expect(userData).toEqual({ 'Fn::Base64': { 'Fn::Join': ['', ['#!/bin/bash\nset -o xtrace\n/etc/eks/bootstrap.sh ', { Ref: 'Cluster9EE0221C' }, ' --kubelet-extra-args "--node-labels lifecycle=OnDemand  --node-labels FOO=42" --use-max-pods true\n/opt/aws/bin/cfn-signal --exit-code $? --stack Stack --resource ClusterMyCapcityASGD4CD8B97 --region us-east-1']] } });

    });

    describe('spot instances', () => {

      test('nodes labeled an tainted accordingly', () => {
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
        expect(userData).toEqual({ 'Fn::Base64': { 'Fn::Join': ['', ['#!/bin/bash\nset -o xtrace\n/etc/eks/bootstrap.sh ', { Ref: 'Cluster9EE0221C' }, ' --kubelet-extra-args "--node-labels lifecycle=Ec2Spot --register-with-taints=spotInstance=true:PreferNoSchedule" --use-max-pods true\n/opt/aws/bin/cfn-signal --exit-code $? --stack Stack --resource ClusterMyCapcityASGD4CD8B97 --region us-east-1']] } });

      });

      test('if kubectl is enabled, the interrupt handler is added', () => {
        // GIVEN
        const { stack } = testFixtureNoVpc();
        const cluster = new eks.Cluster(stack, 'Cluster', { defaultCapacity: 0 });

        // WHEN
        cluster.addCapacity('MyCapcity', {
          instanceType: new ec2.InstanceType('m3.xlargs'),
          spotPrice: '0.01',
        });

        // THEN
        Template.fromStack(stack).hasResourceProperties(eks.KubernetesResource.RESOURCE_TYPE, { Manifest: JSON.stringify(spotInterruptHandler()) });

      });

      test('if kubectl is disabled, interrupt handler is not added', () => {
        // GIVEN
        const { stack } = testFixtureNoVpc();
        const cluster = new eks.Cluster(stack, 'Cluster', { defaultCapacity: 0, kubectlEnabled: false });

        // WHEN
        cluster.addCapacity('MyCapcity', {
          instanceType: new ec2.InstanceType('m3.xlargs'),
          spotPrice: '0.01',
        });

        // THEN
        Template.fromStack(stack).resourceCountIs(eks.KubernetesResource.RESOURCE_TYPE, 0);

      });

    });

  });

  test('if bootstrap is disabled cannot specify options', () => {
    // GIVEN
    const { stack } = testFixtureNoVpc();
    const cluster = new eks.Cluster(stack, 'Cluster', { defaultCapacity: 0 });

    // THEN
    expect(() => cluster.addCapacity('MyCapcity', {
      instanceType: new ec2.InstanceType('m3.xlargs'),
      bootstrapEnabled: false,
      bootstrapOptions: { awsApiRetryAttempts: 10 },
    })).toThrow(/Cannot specify "bootstrapOptions" if "bootstrapEnabled" is false/);

  });

  test('EKS-Optimized AMI with GPU support', () => {
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
    expect(Object.entries(parameters).some(
      ([k, v]) => k.startsWith('SsmParameterValueawsserviceeksoptimizedami') && (v as any).Default.includes('amazon-linux2-gpu'),
    )).toEqual(true);

  });
});
