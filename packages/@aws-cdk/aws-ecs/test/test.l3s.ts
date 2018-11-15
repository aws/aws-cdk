import { expect, haveResource } from '@aws-cdk/assert';
import { CertificateRef } from '@aws-cdk/aws-certificatemanager';
import ec2 = require('@aws-cdk/aws-ec2');
import { PublicHostedZone } from '@aws-cdk/aws-route53';
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
      image: ecs.ContainerImage.fromDockerHub('test'),
      desiredCount: 2
    });

    // THEN - stack containers a load balancer and a service
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::LoadBalancer'));

    expect(stack).to(haveResource("AWS::ECS::Service", {
      DesiredCount: 2,
      LaunchType: "EC2",
    }));

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
      image: ecs.ContainerImage.fromDockerHub('test'),
      desiredCount: 2
    });

    // THEN - stack contains a load balancer and a service
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::LoadBalancer'));

    expect(stack).to(haveResource("AWS::ECS::Service", {
      DesiredCount: 2,
      LaunchType: "FARGATE",
    }));

    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::Listener', {
      Port: 80
    }));

    test.done();
  },

  'test Fargateloadbalanced construct with TLS'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.VpcNetwork(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
    const zone = new PublicHostedZone(stack, 'HostedZone', { zoneName: 'example.com' });

    // WHEN
    new ecs.LoadBalancedFargateService(stack, 'Service', {
      cluster,
      image: ecs.ContainerImage.fromDockerHub('test'),
      domainName: 'api.example.com',
      domainZone: zone,
      certificate: CertificateRef.import(stack, 'Cert', { certificateArn: 'helloworld' })
    });

    // THEN - stack contains a load balancer and a service
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::LoadBalancer'));

    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::Listener', {
      Port: 443,
      Certificates: [{
        CertificateArn: "helloworld"
      }]
    }));

    expect(stack).to(haveResource("AWS::ECS::Service", {
      DesiredCount: 1,
      LaunchType: "FARGATE",
    }));

    expect(stack).to(haveResource('AWS::Route53::RecordSet', {
      Name: 'api.example.com.',
      HostedZoneId: {
        Ref: "HostedZoneDB99F866"
      },
      Type: 'A',
      AliasTarget: {
        HostedZoneId: { 'Fn::GetAtt': [ 'ServiceLBE9A1ADBC', 'CanonicalHostedZoneID' ] },
        DNSName: { 'Fn::GetAtt': [ 'ServiceLBE9A1ADBC', 'DNSName' ] },
      }
    }));

    test.done();
  },

  "errors when setting domainName but not domainZone"(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.VpcNetwork(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // THEN
    test.throws(() => {
      new ecs.LoadBalancedFargateService(stack, 'Service', {
        cluster,
        image: ecs.ContainerImage.fromDockerHub('test'),
        domainName: 'api.example.com'
      });
    });

    test.done();
  },

  'test Fargateloadbalanced applet'(test: Test) {
    // WHEN
    const app = new cdk.App();
    const stack = new ecs.LoadBalancedFargateServiceApplet(app, 'Service', {
      image: 'test',
      desiredCount: 2
    });

    // THEN - stack contains a load balancer and a service
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::LoadBalancer'));

    expect(stack).to(haveResource("AWS::ECS::Service", {
      DesiredCount: 2,
      LaunchType: "FARGATE",
    }));

    test.done();
  },

  'test Fargateloadbalanced applet with TLS'(test: Test) {
    // WHEN
    const app = new cdk.App();
    const stack = new ecs.LoadBalancedFargateServiceApplet(app, 'Service', {
      image: 'test',
      desiredCount: 2,
      domainName: 'api.example.com',
      domainZone: 'example.com',
      certificate: 'helloworld'
    });

    // THEN - stack contains a load balancer and a service
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::LoadBalancer'));

    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::Listener', {
      Port: 443,
      Certificates: [{
        CertificateArn: "helloworld"
      }]
    }));

    expect(stack).to(haveResource("AWS::ECS::Service", {
      DesiredCount: 2,
      LaunchType: "FARGATE",
    }));

    expect(stack).to(haveResource('AWS::Route53::RecordSet', {
      Name: 'api.example.com.',
      HostedZoneId: "/hostedzone/DUMMY",
      Type: 'A',
      AliasTarget: {
        HostedZoneId: { 'Fn::GetAtt': [ 'FargateServiceLBB353E155', 'CanonicalHostedZoneID' ] },
        DNSName: { 'Fn::GetAtt': [ 'FargateServiceLBB353E155', 'DNSName' ] },
      }
    }));

    test.done();
  },

  "errors when setting domainName but not domainZone on applet"(test: Test) {
    // THEN
    test.throws(() => {
      new ecs.LoadBalancedFargateServiceApplet(new cdk.App(), 'Service', {
        image: 'test',
        domainName: 'api.example.com'
      });
    });

    test.done();
  }
};
