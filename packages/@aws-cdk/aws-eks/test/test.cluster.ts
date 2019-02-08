import { expect, haveResource, haveResourceLike } from '@aws-cdk/assert';
import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import eks = require('../lib');

export = {
  'a default cluster spans all subnets'(test: Test) {
    // GIVEN
    const [stack, vpc] = testFixture();

    // WHEN
    new eks.Cluster(stack, 'Cluster', { vpc });

    // THEN
    expect(stack).to(haveResourceLike('AWS::EKS::Cluster', {
      ResourcesVpcConfig: {
        SubnetIds: [
          { Ref: "VPCPublicSubnet1SubnetB4246D30" },
          { Ref: "VPCPublicSubnet2Subnet74179F39" },
          { Ref: "VPCPublicSubnet3Subnet631C5E25" },
          { Ref: "VPCPrivateSubnet1Subnet8BCA10E0" },
          { Ref: "VPCPrivateSubnet2SubnetCFCDAA7A" },
          { Ref: "VPCPrivateSubnet3Subnet3EDCD457" }
        ]
      }
    }));

    test.done();
  },

  'creating a cluster tags the private VPC subnets'(test: Test) {
    // GIVEN
    const [stack, vpc] = testFixture();

    // WHEN
    new eks.Cluster(stack, 'Cluster', { vpc });

    // THEN
    expect(stack).to(haveResource('AWS::EC2::Subnet', {
      Tags: [
        { Key: "Name", Value: "VPC/PrivateSubnet1" },
        { Key: "aws-cdk:subnet-name", Value: "Private" },
        { Key: "aws-cdk:subnet-type", Value: "Private" },
        { Key: "kubernetes.io/role/internal-elb", Value: "1" }
      ]
    }));

    test.done();
  },

  'adding capacity creates an ASG with tags'(test: Test) {
    // GIVEN
    const [stack, vpc] = testFixture();
    const cluster = new eks.Cluster(stack, 'Cluster', { vpc });

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
          Value: "Cluster/Default"
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
    const [stack, vpc] = testFixture();
    const cluster = new eks.Cluster(stack, 'Cluster', { vpc });

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
    const [stack1, vpc] = testFixture();
    const stack2 = new cdk.Stack();
    const cluster = new eks.Cluster(stack1, 'Cluster', { vpc });

    // WHEN
    const imported = eks.Cluster.import(stack2, 'Imported', cluster.export());

    // THEN
    test.deepEqual(stack2.node.resolve(imported.clusterArn), {
      'Fn::ImportValue': 'Stack:ClusterClusterArn00DCA0E0'
    });

    test.done();
  },
};

function testFixture(): [cdk.Stack, ec2.VpcNetwork] {
  const stack = new cdk.Stack(undefined, 'Stack', { env: { region: 'us-east-1' }});
  const vpc = new ec2.VpcNetwork(stack, 'VPC');

  return [stack, vpc];
}
