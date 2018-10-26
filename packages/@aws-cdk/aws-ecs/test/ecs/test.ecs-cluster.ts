import { expect, haveResource } from '@aws-cdk/assert';
import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import ecs = require('../../lib');

export = {
  "When creating an ECS Cluster": {
    "with only required properties set, it correctly sets default properties"(test: Test) {
      // GIVEN
      const stack =  new cdk.Stack();
      const vpc = new ec2.VpcNetwork(stack, 'MyVpc', {});
      new ecs.EcsCluster(stack, 'Cluster', {
        vpc,
      });

      // THEN
      expect(stack).to(haveResource('AWS::ECS::Cluster', {
          // Type: "AWS::EC2::VPC",
      }));
      //     Properties: {
      //       CidrBlock: '10.10.0.0/16',
      //       EnableDnsHostnames: true,
      //       EnableDnsSupport: true,
      //       InstanceTenancy: ec2.DefaultInstanceTenancy.Default,
      //       Tags: [
      //         {
      //           Key: "Name",
      //           Value: "MyVpc"
      //         }
      //       ]
      //     }
      // }));
      // expect(stack).toMatch({
      //   Resources: {
      //     Cluster: {
      //       Type: 'AWS::ECS::Cluster'
      //     }
      //   }
      // }, MatchStyle.SUPERSET);​

      test.done();
    },
  }
};
