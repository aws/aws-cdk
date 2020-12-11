import { countResources, expect, haveResource, haveResourceLike } from '@aws-cdk/assert';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as eks from '../lib';
import { testFixture } from './util';

/* eslint-disable max-len */

const CLUSTER_VERSION = eks.KubernetesVersion.V1_18;

export = {
  'create nodegroup correctly'(test: Test) {
    // GIVEN
    const { stack, vpc } = testFixture();

    // WHEN
    const cluster = new eks.Cluster(stack, 'Cluster', {
      vpc,
      kubectlEnabled: true,
      defaultCapacity: 0,
      version: CLUSTER_VERSION,
    });
    new eks.Nodegroup(stack, 'Nodegroup', { cluster });

    // THEN
    expect(stack).to(haveResourceLike('AWS::EKS::Nodegroup', {
      ClusterName: {
        Ref: 'Cluster9EE0221C',
      },
      NodeRole: {
        'Fn::GetAtt': [
          'NodegroupNodeGroupRole038A128B',
          'Arn',
        ],
      },
      Subnets: [
        {
          Ref: 'VPCPrivateSubnet1Subnet8BCA10E0',
        },
        {
          Ref: 'VPCPrivateSubnet2SubnetCFCDAA7A',
        },
      ],
      ForceUpdateEnabled: true,
      ScalingConfig: {
        DesiredSize: 2,
        MaxSize: 2,
        MinSize: 1,
      },
    },
    ));
    test.done();
  },
  'aws-auth will be updated'(test: Test) {
    // GIVEN
    const { stack, vpc } = testFixture();

    // WHEN
    const cluster = new eks.Cluster(stack, 'Cluster', {
      vpc,
      kubectlEnabled: true,
      defaultCapacity: 0,
      version: CLUSTER_VERSION,
    });
    new eks.Nodegroup(stack, 'Nodegroup', { cluster });

    // THEN
    // THEN
    expect(stack).to(haveResource(eks.KubernetesManifest.RESOURCE_TYPE, {
      Manifest: {
        'Fn::Join': [
          '',
          [
            '[{"apiVersion":"v1","kind":"ConfigMap","metadata":{"name":"aws-auth","namespace":"kube-system","labels":{"aws.cdk.eks/prune-c82ececabf77e03e3590f2ebe02adba8641d1b3e76":""}},"data":{"mapRoles":"[{\\"rolearn\\":\\"',
            {
              'Fn::GetAtt': [
                'ClusterMastersRole9AA35625',
                'Arn',
              ],
            },
            '\\",\\"username\\":\\"',
            {
              'Fn::GetAtt': [
                'ClusterMastersRole9AA35625',
                'Arn',
              ],
            },
            '\\",\\"groups\\":[\\"system:masters\\"]},{\\"rolearn\\":\\"',
            {
              'Fn::GetAtt': [
                'NodegroupNodeGroupRole038A128B',
                'Arn',
              ],
            },
            '\\",\\"username\\":\\"system:node:{{EC2PrivateDNSName}}\\",\\"groups\\":[\\"system:bootstrappers\\",\\"system:nodes\\"]}]","mapUsers":"[]","mapAccounts":"[]"}}]',
          ],
        ],
      },
      ClusterName: {
        Ref: 'Cluster9EE0221C',
      },
      RoleArn: {
        'Fn::GetAtt': [
          'ClusterCreationRole360249B6',
          'Arn',
        ],
      },
      PruneLabel: 'aws.cdk.eks/prune-c82ececabf77e03e3590f2ebe02adba8641d1b3e76',
    }));
    test.done();
  },
  'create nodegroup correctly with security groups provided'(test: Test) {
    // GIVEN
    const { stack, vpc } = testFixture();

    // WHEN
    const cluster = new eks.Cluster(stack, 'Cluster', {
      vpc,
      kubectlEnabled: true,
      defaultCapacity: 0,
      version: CLUSTER_VERSION,
    });
    new eks.Nodegroup(stack, 'Nodegroup', {
      cluster,
      remoteAccess: {
        sshKeyName: 'foo',
        sourceSecurityGroups: [new ec2.SecurityGroup(stack, 'SG', { vpc })],
      },
    });
    // THEN
    expect(stack).to(haveResource('AWS::EKS::Nodegroup', {
      RemoteAccess: {
        Ec2SshKey: 'foo',
        SourceSecurityGroups: [
          {
            'Fn::GetAtt': [
              'SGADB53937',
              'GroupId',
            ],
          },
        ],
      },
    },
    ));
    test.done();
  },
  'create nodegroup with forceUpdate disabled'(test: Test) {
    // GIVEN
    const { stack, vpc } = testFixture();

    // WHEN
    const cluster = new eks.Cluster(stack, 'Cluster', {
      vpc,
      kubectlEnabled: true,
      defaultCapacity: 0,
      version: CLUSTER_VERSION,
    });
    new eks.Nodegroup(stack, 'Nodegroup', { cluster, forceUpdate: false });

    // THEN
    expect(stack).to(haveResourceLike('AWS::EKS::Nodegroup', {
      ForceUpdateEnabled: false,
    },
    ));
    test.done();
  },
  'create nodegroups with kubectlEnabled is false'(test: Test) {
    // GIVEN
    const { stack, vpc } = testFixture();

    // WHEN
    const cluster = new eks.LegacyCluster(stack, 'Cluster', {
      vpc,
      defaultCapacity: 2,
      version: CLUSTER_VERSION,
    });
    // add a extra nodegroup
    cluster.addNodegroup('extra-ng');
    // THEN
    expect(stack).to(countResources('AWS::EKS::Nodegroup', 2));
    test.done();
  },
  'create nodegroup with instanceType provided'(test: Test) {
    // GIVEN
    const { stack, vpc } = testFixture();

    // WHEN
    const cluster = new eks.Cluster(stack, 'Cluster', {
      vpc,
      kubectlEnabled: true,
      defaultCapacity: 0,
      version: CLUSTER_VERSION,
    });
    new eks.Nodegroup(stack, 'Nodegroup', {
      cluster,
      instanceType: new ec2.InstanceType('m5.large'),
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::EKS::Nodegroup', {
      InstanceTypes: [
        'm5.large',
      ],
    },
    ));
    test.done();
  },
  'remoteAccess without security group provided'(test: Test) {
    // GIVEN
    const { stack, vpc } = testFixture();

    // WHEN
    const cluster = new eks.Cluster(stack, 'Cluster', {
      vpc,
      defaultCapacity: 0,
      version: CLUSTER_VERSION,
    });
    new eks.Nodegroup(stack, 'Nodegroup', {
      cluster,
      remoteAccess: {
        sshKeyName: 'foo',
      },
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::EKS::Nodegroup', {
      RemoteAccess: {
        Ec2SshKey: 'foo',
      },
    },
    ));
    test.done();
  },

  'import nodegroup correctly'(test: Test) {
    // GIVEN
    const { stack: stack1, vpc, app } = testFixture();
    const stack2 = new cdk.Stack(app, 'stack2', { env: { region: 'us-east-1' } });
    const cluster = new eks.Cluster(stack1, 'Cluster', {
      vpc,
      defaultCapacity: 0,
      version: CLUSTER_VERSION,
    });

    // WHEN
    // const cluster = new eks.Cluster(stack, 'Cluster', { vpc, kubectlEnabled: true, defaultCapacity: 0 });
    const ng = new eks.Nodegroup(stack1, 'Nodegroup', { cluster });
    const imported = eks.Nodegroup.fromNodegroupName(stack2, 'ImportedNg', ng.nodegroupName);
    new cdk.CfnOutput(stack2, 'NodegroupName', { value: imported.nodegroupName });

    // THEN
    expect(stack2).toMatch({
      Outputs: {
        NodegroupName: {
          Value: {
            'Fn::ImportValue': 'Stack:ExportsOutputRefNodegroup62B4B2C1EF8AB7C1',
          },
        },
      },
    });
    test.done();
  },
  'addNodegroup correctly'(test: Test) {
    // GIVEN
    const { stack, vpc } = testFixture();
    const cluster = new eks.Cluster(stack, 'Cluster', {
      vpc,
      kubectlEnabled: true,
      defaultCapacity: 0,
      version: CLUSTER_VERSION,
    });

    // WHEN
    cluster.addNodegroupCapacity('ng');

    // THEN
    expect(stack).to(haveResourceLike('AWS::EKS::Nodegroup', {
      ClusterName: {
        Ref: 'Cluster9EE0221C',
      },
      NodeRole: {
        'Fn::GetAtt': [
          'ClusterNodegroupngNodeGroupRoleDA0D35DA',
          'Arn',
        ],
      },
      Subnets: [
        {
          Ref: 'VPCPrivateSubnet1Subnet8BCA10E0',
        },
        {
          Ref: 'VPCPrivateSubnet2SubnetCFCDAA7A',
        },
      ],
      ForceUpdateEnabled: true,
      ScalingConfig: {
        DesiredSize: 2,
        MaxSize: 2,
        MinSize: 1,
      },
    },
    ));
    test.done();
  },
  'throws when desiredSize > maxSize'(test: Test) {
    // GIVEN
    const { stack, vpc } = testFixture();
    const cluster = new eks.Cluster(stack, 'Cluster', {
      vpc,
      kubectlEnabled: true,
      defaultCapacity: 0,
      version: CLUSTER_VERSION,
    });
    // THEN
    test.throws(() => cluster.addNodegroupCapacity('ng', { desiredSize: 3, maxSize: 2 }), /Desired capacity 3 can't be greater than max size 2/);
    test.done();
  },
  'throws when desiredSize < minSize'(test: Test) {
    // GIVEN
    const { stack, vpc } = testFixture();
    const cluster = new eks.Cluster(stack, 'Cluster', {
      vpc,
      kubectlEnabled: true,
      defaultCapacity: 0,
      version: CLUSTER_VERSION,
    });
    // THEN
    test.throws(() => cluster.addNodegroupCapacity('ng', { desiredSize: 2, minSize: 3 }), /Minimum capacity 3 can't be greater than desired size 2/);
    test.done();
  },
  'create nodegroup correctly with launch template'(test: Test) {
    // GIVEN
    const { stack, vpc } = testFixture();

    // WHEN
    const cluster = new eks.Cluster(stack, 'Cluster', {
      vpc,
      kubectlEnabled: true,
      defaultCapacity: 0,
      version: CLUSTER_VERSION,
    });
    const userData = ec2.UserData.forLinux();
    userData.addCommands(
      'set -o xtrace',
      `/etc/eks/bootstrap.sh ${cluster.clusterName}`,
    );
    const lt = new ec2.CfnLaunchTemplate(stack, 'LaunchTemplate', {
      launchTemplateData: {
        imageId: new eks.EksOptimizedImage().getImage(stack).imageId,
        instanceType: new ec2.InstanceType('t3.small').toString(),
        userData: cdk.Fn.base64(userData.render()),
      },
    });
    cluster.addNodegroupCapacity('ng-lt', {
      launchTemplateSpec: {
        id: lt.ref,
        version: lt.attrDefaultVersionNumber,
      },
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::EKS::Nodegroup', {
      LaunchTemplate: {
        Id: {
          Ref: 'LaunchTemplate',
        },
        Version: {
          'Fn::GetAtt': [
            'LaunchTemplate',
            'DefaultVersionNumber',
          ],
        },
      },
    },
    ));
    test.done();
  },
  'throws when both diskSize and launch template specified'(test: Test) {
    // GIVEN
    const { stack, vpc } = testFixture();

    // WHEN
    const cluster = new eks.Cluster(stack, 'Cluster', {
      vpc,
      kubectlEnabled: true,
      defaultCapacity: 0,
      version: CLUSTER_VERSION,
    });
    const userData = ec2.UserData.forLinux();
    userData.addCommands(
      'set -o xtrace',
      `/etc/eks/bootstrap.sh ${cluster.clusterName}`,
    );
    const lt = new ec2.CfnLaunchTemplate(stack, 'LaunchTemplate', {
      launchTemplateData: {
        imageId: new eks.EksOptimizedImage().getImage(stack).imageId,
        instanceType: new ec2.InstanceType('t3.small').toString(),
        userData: cdk.Fn.base64(userData.render()),
      },
    });
    // THEN
    test.throws(() =>
      cluster.addNodegroupCapacity('ng-lt', {
        diskSize: 100,
        launchTemplateSpec: {
          id: lt.ref,
          version: lt.attrDefaultVersionNumber,
        },
      }), /diskSize must be specified within the launch template/);
    test.done();
  },
  'throws when both instanceType and launch template specified'(test: Test) {
    // GIVEN
    const { stack, vpc } = testFixture();

    // WHEN
    const cluster = new eks.Cluster(stack, 'Cluster', {
      vpc,
      kubectlEnabled: true,
      defaultCapacity: 0,
      version: CLUSTER_VERSION,
    });
    const userData = ec2.UserData.forLinux();
    userData.addCommands(
      'set -o xtrace',
      `/etc/eks/bootstrap.sh ${cluster.clusterName}`,
    );
    const lt = new ec2.CfnLaunchTemplate(stack, 'LaunchTemplate', {
      launchTemplateData: {
        imageId: new eks.EksOptimizedImage().getImage(stack).imageId,
        instanceType: new ec2.InstanceType('t3.small').toString(),
        userData: cdk.Fn.base64(userData.render()),
      },
    });
    // THEN
    test.throws(() =>
      cluster.addNodegroupCapacity('ng-lt', {
        instanceType: new ec2.InstanceType('c5.large'),
        launchTemplateSpec: {
          id: lt.ref,
          version: lt.attrDefaultVersionNumber,
        },
      }), /Instance types must be specified within the launch template/);
    test.done();
  },
};
