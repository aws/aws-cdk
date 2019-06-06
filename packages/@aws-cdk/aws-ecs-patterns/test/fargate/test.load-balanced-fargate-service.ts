import { expect, haveResourceLike } from '@aws-cdk/assert';
import { Certificate } from '@aws-cdk/aws-certificatemanager';
import ec2 = require('@aws-cdk/aws-ec2');
import ecs = require('@aws-cdk/aws-ecs');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import ecsPatterns = require('../../lib');

export = {
  'certificate requires an application load balancer'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // WHEN
    const cert = new Certificate(stack, 'Cert', { domainName: '*.example.com' });
    const toThrow = () => {
      new ecsPatterns.LoadBalancedFargateService(stack, 'Service', {
        cluster,
        certificate: cert,
        loadBalancerType: ecsPatterns.LoadBalancerType.Network,
        image: ecs.ContainerImage.fromRegistry("/aws/aws-example-app")
      });
    };

    // THEN
    test.throws(() => toThrow(), /Cannot add certificate to an NLB/);
    test.done();
  },

  'setting loadBalancerType to Network creates an NLB'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // WHEN
    new ecsPatterns.LoadBalancedFargateService(stack, 'Service', {
      cluster,
      loadBalancerType: ecsPatterns.LoadBalancerType.Network,
      image: ecs.ContainerImage.fromRegistry("/aws/aws-example-app")
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::ElasticLoadBalancingV2::LoadBalancer', {
      Type: 'network'
    }));

    test.done();
  },

  'setting vpc and cluster throws error'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // WHEN
    test.throws(() => new ecsPatterns.LoadBalancedFargateService(stack, 'Service', {
      cluster,
      vpc,
      loadBalancerType: ecsPatterns.LoadBalancerType.Network,
      image: ecs.ContainerImage.fromRegistry("/aws/aws-example-app")
    }));

    test.done();
  }

};