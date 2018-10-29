import { expect, haveResource } from '@aws-cdk/assert';
import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import ecs = require('../../lib');

export = {
  "When creating a Fargate Cluster": {
    "with only required properties set, it correctly sets default properties"(test: Test) {
      // GIVEN
      const stack =  new cdk.Stack();
      const vpc = new ec2.VpcNetwork(stack, 'MyVpc', {});
      new ecs.FargateCluster(stack, 'FargateCluster', {
        vpc,
      });

      expect(stack).to(haveResource("AWS::ECS::Cluster"));

      expect(stack).to(haveResource("AWS::EC2::VPC", {
        CidrBlock: '10.0.0.0/16',
        EnableDnsHostnames: true,
        EnableDnsSupport: true,
        InstanceTenancy: ec2.DefaultInstanceTenancy.Default,
        Tags: [
          {
            Key: "Name",
            Value: "MyVpc"
          }
        ]
      }));

      expect(stack).notTo(haveResource("AWS::EC2::SecurityGroup"));
      expect(stack).notTo(haveResource("AWS::AutoScaling::LaunchConfiguration"));
      expect(stack).notTo(haveResource("AWS::AutoScaling::AutoScalingGroup"));
      expect(stack).notTo(haveResource("AWS::IAM::Role"));
      expect(stack).notTo(haveResource("AWS::IAM::Policy"));

      test.done();
    },
  }
};
