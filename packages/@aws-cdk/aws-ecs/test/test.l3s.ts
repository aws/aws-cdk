import { expect, haveResource } from '@aws-cdk/assert';
import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import ecs = require('../lib');

export = {
  'test ECS loadbalanced construct'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.VpcNetwork(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
    cluster.addDefaultAutoScalingGroupCapacity({ instanceType: new ec2.InstanceType('t2.micro') });

    // WHEN
    new ecs.LoadBalancedEc2Service(stack, 'Service', {
      cluster,
      memoryLimitMiB: 1024,
      image: ecs.DockerHub.image('test')
    });

    // THEN - stack containers a load balancer
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::LoadBalancer'));

    test.done();
  },

  'test Fargateloadbalanced construct'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.VpcNetwork(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // WHEN
    new ecs.LoadBalancedFargateService(stack, 'Service', {
      cluster,
      image: ecs.DockerHub.image('test')
    });

    // THEN - stack containers a load balancer
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::LoadBalancer'));

    test.done();
  }
};
