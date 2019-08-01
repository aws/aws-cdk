import { countResources, expect, haveResource, haveResourceLike, not } from '@aws-cdk/assert';
import ec2 = require('@aws-cdk/aws-ec2');
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/core');
import { CfnOutput } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import eks = require('../lib');
import { KubernetesManifest } from '../lib';

// tslint:disable:max-line-length

export = {
  'a default cluster spans all subnets'(test: Test) {
    // GIVEN
    const { stack, vpc } = testFixture();

    // WHEN
    new eks.Cluster(stack, 'Cluster', { vpc, kubectlEnabled: false });

    // THEN
    expect(stack).to(haveResourceLike('AWS::EKS::Cluster', {
      ResourcesVpcConfig: {
        SubnetIds: [
          { Ref: "VPCPublicSubnet1SubnetB4246D30" },
          { Ref: "VPCPublicSubnet2Subnet74179F39" },
          { Ref: "VPCPrivateSubnet1Subnet8BCA10E0" },
          { Ref: "VPCPrivateSubnet2SubnetCFCDAA7A" },
        ]
      }
    }));

    test.done();
  },

  'creating a cluster tags the private VPC subnets'(test: Test) {
    // GIVEN
    const { stack, vpc } = testFixture();

    // WHEN
    new eks.Cluster(stack, 'Cluster', { vpc, kubectlEnabled: false });

    // THEN
    expect(stack).to(haveResource('AWS::EC2::Subnet', {
      Tags: [
        { Key: "Name", Value: "Stack/VPC/PrivateSubnet1" },
        { Key: "aws-cdk:subnet-name", Value: "Private" },
        { Key: "aws-cdk:subnet-type", Value: "Private" },
        { Key: "kubernetes.io/role/internal-elb", Value: "1" }
      ]
    }));

    test.done();
  },

  'adding capacity creates an ASG with tags'(test: Test) {
    // GIVEN
    const { stack, vpc } = testFixture();
    const cluster = new eks.Cluster(stack, 'Cluster', { vpc, kubectlEnabled: false });

    // WHEN
    cluster.addCapacity('Default', {
      instanceType: new ec2.InstanceType('t2.medium'),
    });

    // THEN
    expect(stack).to(haveResource('AWS::AutoScaling::AutoScalingGroup', {
      Tags: [
        {
          Key: "Name",
          PropagateAtLaunch: true,
          Value: "Stack/Cluster/Default"
        },
        {
          Key: { "Fn::Join": [ "", [ "kubernetes.io/cluster/", { Ref: "ClusterEB0386A7" } ] ] },
          PropagateAtLaunch: true,
          Value: "owned"
        }
      ]
    }));

    test.done();
  },

  'adding capacity correctly deduces maxPods and adds userdata'(test: Test) {
    // GIVEN
    const { stack, vpc } = testFixture();
    const cluster = new eks.Cluster(stack, 'Cluster', { vpc, kubectlEnabled: false });

    // WHEN
    cluster.addCapacity('Default', {
      instanceType: new ec2.InstanceType('t2.medium'),
    });

    // THEN
    expect(stack).to(haveResource('AWS::AutoScaling::LaunchConfiguration', {
      UserData: {
        "Fn::Base64": {
          "Fn::Join": [
            "",
            [
              "#!/bin/bash\nset -o xtrace\n/etc/eks/bootstrap.sh ",
              { Ref: "ClusterEB0386A7" },
              " --use-max-pods 17"
            ]
          ]
        }
      }
    }));

    test.done();
  },

  'exercise export/import'(test: Test) {
    // GIVEN
    const { stack: stack1, vpc, app } = testFixture();
    const stack2 = new cdk.Stack(app, 'stack2', { env: { region: 'us-east-1' } });
    const cluster = new eks.Cluster(stack1, 'Cluster', { vpc, kubectlEnabled: false });

    // WHEN
    const imported = eks.Cluster.fromClusterAttributes(stack2, 'Imported', {
      clusterArn: cluster.clusterArn,
      vpc: cluster.vpc,
      clusterEndpoint: cluster.clusterEndpoint,
      clusterName: cluster.clusterName,
      securityGroups: cluster.connections.securityGroups,
      clusterCertificateAuthorityData: cluster.clusterCertificateAuthorityData
    });

    // this should cause an export/import
    new CfnOutput(stack2, 'ClusterARN', { value: imported.clusterArn });

    // THEN
    expect(stack2).toMatch({
      Outputs: {
        ClusterARN: {
          Value: {
            "Fn::ImportValue": "Stack:ExportsOutputFnGetAttClusterEB0386A7Arn2F2E3C3F"
          }
        }
      }
    });
    test.done();
  },

  'disabled features when kubectl is disabled'(test: Test) {
    // GIVEN
    const { stack, vpc } = testFixture();
    const cluster = new eks.Cluster(stack, 'Cluster', { vpc, kubectlEnabled: false });
    const role = new iam.Role(stack, 'role', { assumedBy: new iam.AnyPrincipal() });
    const user = new iam.User(stack, 'user');

    test.throws(() => cluster.addMastersRole(role), /Cannot add IAM role mapping to a cluster with kubectl disabled/);
    test.throws(() => cluster.addManifest('foo', {}), /Cannot define a KubernetesManifest resource on a cluster with kubectl disabled/);
    test.throws(() => cluster.addUserMapping(user, { groups: [ 'a' ]}), /Cannot add IAM user mapping to a cluster with kubectl disabled/);
    test.throws(() => cluster.addRoleMapping(role, { groups: [ 'b' ]}), /Cannot add IAM role mapping to a cluster with kubectl disabled/);
    test.throws(() => cluster.addCapacity('boo', { instanceType: new ec2.InstanceType('r5d.24xlarge'), mapRole: true }),
      /Cannot map instance IAM role to BRAC if kubectl is disabled for the cluster/);
    test.done();
  },

  'mastersRole can be used to map an IAM role to "system:masters" (required kubectl)'(test: Test) {
    // GIVEN
    const { stack, vpc } = testFixture();
    const role = new iam.Role(stack, 'role', { assumedBy: new iam.AnyPrincipal() });

    // WHEN
    new eks.Cluster(stack, 'Cluster', { vpc, mastersRole: role });

    // THEN
    expect(stack).to(haveResource(KubernetesManifest.RESORUCE_TYPE, {
      Manifest: {
        "Fn::Join": [
          "",
          [
            "[{\"apiVersion\":\"v1\",\"kind\":\"ConfigMap\",\"metadata\":{\"name\":\"aws-auth\",\"namespace\":\"kube-system\"},\"data\":{\"mapRoles\":\"[{\\\"rolearn\\\":\\\"",
            {
              "Fn::GetAtt": [
                "roleC7B7E775",
                "Arn"
              ]
            },
            "\\\",\\\"groups\\\":[\\\"system:masters\\\"]}]\",\"mapUsers\":\"[]\"}}]"
          ]
        ]
      }
    }));

    test.done();
  },

  'addManifest can be used to apply k8s manifests on this cluster'(test: Test) {
    // GIVEN
    const { stack, vpc } = testFixture();
    const cluster = new eks.Cluster(stack, 'Cluster', { vpc });

    // WHEN
    cluster.addManifest('manifest1', { foo: 123 });
    cluster.addManifest('manifest2', { bar: 123 }, { boor: [ 1, 2, 3 ] });

    // THEN
    expect(stack).to(haveResource(KubernetesManifest.RESORUCE_TYPE, {
      Manifest: "[{\"foo\":123}]"
    }));

    expect(stack).to(haveResource(KubernetesManifest.RESORUCE_TYPE, {
      Manifest: "[{\"bar\":123},{\"boor\":[1,2,3]}]"
    }));

    test.done();
  },

  'addRoleMapping and addUserMapping can be used to define the aws-auth ConfigMap'(test: Test) {
    // GIVEN
    const { stack, vpc } = testFixture();
    const cluster = new eks.Cluster(stack, 'Cluster', { vpc });
    const role = new iam.Role(stack, 'role', { assumedBy: new iam.AnyPrincipal() });
    const user = new iam.User(stack, 'user');

    // WHEN
    cluster.addRoleMapping(role, { groups: [ 'role-group1' ], username: 'roleuser' });
    cluster.addRoleMapping(role, { groups: [ 'role-group2', 'role-group3' ] });
    cluster.addUserMapping(user, { groups: [ 'user-group1', 'user-group2' ] });
    cluster.addUserMapping(user, { groups: [ 'user-group1', 'user-group2' ], username: 'foo' });

    // THEN
    expect(stack).to(countResources(KubernetesManifest.RESORUCE_TYPE, 1));
    expect(stack).to(haveResource(KubernetesManifest.RESORUCE_TYPE, {
      Manifest: {
        "Fn::Join": [
          "",
          [
            "[{\"apiVersion\":\"v1\",\"kind\":\"ConfigMap\",\"metadata\":{\"name\":\"aws-auth\",\"namespace\":\"kube-system\"},\"data\":{\"mapRoles\":\"[{\\\"rolearn\\\":\\\"",
            {
              "Fn::GetAtt": [
                "roleC7B7E775",
                "Arn"
              ]
            },
            "\\\",\\\"username\\\":\\\"roleuser\\\",\\\"groups\\\":[\\\"role-group1\\\"]},{\\\"rolearn\\\":\\\"",
            {
              "Fn::GetAtt": [
                "roleC7B7E775",
                "Arn"
              ]
            },
            "\\\",\\\"groups\\\":[\\\"role-group2\\\",\\\"role-group3\\\"]}]\",\"mapUsers\":\"[{\\\"userarn\\\":\\\"arn:",
            {
              Ref: "AWS::Partition"
            },
            ":iam:us-east-1:",
            {
              Ref: "AWS::AccountId"
            },
            ":user/",
            {
              Ref: "user2C2B57AE"
            },
            "\\\",\\\"groups\\\":[\\\"user-group1\\\",\\\"user-group2\\\"]},{\\\"userarn\\\":\\\"arn:",
            {
              Ref: "AWS::Partition"
            },
            ":iam:us-east-1:",
            {
              Ref: "AWS::AccountId"
            },
            ":user/",
            {
              Ref: "user2C2B57AE"
            },
            "\\\",\\\"username\\\":\\\"foo\\\",\\\"groups\\\":[\\\"user-group1\\\",\\\"user-group2\\\"]}]\"}}]"
          ]
        ]
      }
    }));
    test.done();
  },

  'when kubectl is enabled (default) adding capacity will automatically map its IAM role'(test: Test) {
    // GIVEN
    const { stack, vpc } = testFixture();
    const cluster = new eks.Cluster(stack, 'Cluster', { vpc });

    // WHEN
    cluster.addCapacity('default', {
      instanceType: new ec2.InstanceType('t2.nano'),
    });

    // THEN
    expect(stack).to(haveResource(KubernetesManifest.RESORUCE_TYPE, {
      Manifest: {
        "Fn::Join": [
          "",
          [
            "[{\"apiVersion\":\"v1\",\"kind\":\"ConfigMap\",\"metadata\":{\"name\":\"aws-auth\",\"namespace\":\"kube-system\"},\"data\":{\"mapRoles\":\"[{\\\"rolearn\\\":\\\"",
            {
              "Fn::GetAtt": [
                "ClusterdefaultInstanceRoleF20A29CD",
                "Arn"
              ]
            },
            "\\\",\\\"username\\\":\\\"system:node:{{EC2PrivateDNSName}}\\\",\\\"groups\\\":[\\\"system:bootstrappers\\\",\\\"system:nodes\\\"]}]\",\"mapUsers\":\"[]\"}}]"
          ]
        ]
      }
    }));

    test.done();
  },

  'addCapacity will *not* map the IAM role if mapRole is false'(test: Test) {
    // GIVEN
    const { stack, vpc } = testFixture();
    const cluster = new eks.Cluster(stack, 'Cluster', { vpc });

    // WHEN
    cluster.addCapacity('default', {
      instanceType: new ec2.InstanceType('t2.nano'),
      mapRole: false
    });

    // THEN
    expect(stack).to(not(haveResource(KubernetesManifest.RESORUCE_TYPE)));
    test.done();
  },

  'addCapacity will *not* map the IAM role if kubectl is disabled'(test: Test) {
    // GIVEN
    const { stack, vpc } = testFixture();
    const cluster = new eks.Cluster(stack, 'Cluster', { vpc, kubectlEnabled: false });

    // WHEN
    cluster.addCapacity('default', {
      instanceType: new ec2.InstanceType('t2.nano')
    });

    // THEN
    expect(stack).to(not(haveResource(KubernetesManifest.RESORUCE_TYPE)));
    test.done();
  }

};

function testFixture() {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'Stack', { env: { region: 'us-east-1' }});
  const vpc = new ec2.Vpc(stack, 'VPC');

  return { stack, vpc, app };
}
