import { expect, haveResourceLike } from '@aws-cdk/assert';
import { Certificate } from '@aws-cdk/aws-certificatemanager';
import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import ecs = require('../lib');

export = {
  'certificate requires an application load balancer'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.VpcNetwork(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // WHEN
    const cert = new Certificate(stack, 'Cert', { domainName: '*.example.com' });
    const toThrow = () => {
      new ecs.LoadBalancedFargateService(stack, 'Service', {
        cluster,
        certificate: cert,
        loadBalancerType: ecs.LoadBalancerType.Network,
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
    const vpc = new ec2.VpcNetwork(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // WHEN
    new ecs.LoadBalancedFargateService(stack, 'Service', {
      cluster,
      loadBalancerType: ecs.LoadBalancerType.Network,
      image: ecs.ContainerImage.fromRegistry("/aws/aws-example-app")
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::ElasticLoadBalancingV2::LoadBalancer', {
      Type: 'network'
    }));

    test.done();
  }
};