import { Template } from '@aws-cdk/assertions';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { Service, Source } from '../lib';
import { VpcIngressConnection } from '../lib/vpc-ingress-connection';

test('create a VpcIngressConnection with all properties', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');

  const vpc = new ec2.Vpc(stack, 'MyVpc', {
    ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
  });
  const vpcInterfaceEndpoint = new ec2.InterfaceVpcEndpoint(stack, 'MyVpcEndpoint', {
    vpc,
    service: new ec2.InterfaceVpcEndpointService('com.amazonaws.vpce.us-east-1.vpce-svc-uuddlrlrbastrtsvc', 443),
  });
  const service = new Service(stack, 'Service', {
    source: Source.fromEcrPublic({
      imageConfiguration: {
        port: 8000,
      },
      imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
    }),
  });

  // WHEN
  new VpcIngressConnection(stack, 'VpcIngressConnection', {
    vpc,
    vpcInterfaceEndpoint,
    service,
    vpcIngressConnectionName: 'MyVpcIngressConnection',
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::AppRunner::VpcIngressConnection', {
    IngressVpcConfiguration: {
      VpcEndpointId: {
        Ref: 'MyVpcEndpoint9E60B996',
      },
      VpcId: {
        Ref: 'MyVpcF9F0CA6F',
      },
    },
    ServiceArn: {
      'Fn::GetAtt': [
        'ServiceDBC79909',
        'ServiceArn',
      ],
    },
    VpcIngressConnectionName: 'MyVpcIngressConnection',
  });
});

test('create a vpcIngressConnection without a name', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');

  const vpc = new ec2.Vpc(stack, 'MyVpc', {
    ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
  });
  const vpcInterfaceEndpoint = new ec2.InterfaceVpcEndpoint(stack, 'MyVpcEndpoint', {
    vpc,
    service: new ec2.InterfaceVpcEndpointService('com.amazonaws.vpce.us-east-1.vpce-svc-uuddlrlrbastrtsvc', 443),
  });
  const service = new Service(stack, 'Service', {
    source: Source.fromEcrPublic({
      imageConfiguration: {
        port: 8000,
      },
      imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
    }),
  });

  // WHEN
  new VpcIngressConnection(stack, 'VpcIngressConnection', {
    vpc,
    vpcInterfaceEndpoint,
    service,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::AppRunner::VpcIngressConnection', {
    IngressVpcConfiguration: {
      VpcEndpointId: {
        Ref: 'MyVpcEndpoint9E60B996',
      },
      VpcId: {
        Ref: 'MyVpcF9F0CA6F',
      },
    },
    ServiceArn: {
      'Fn::GetAtt': [
        'ServiceDBC79909',
        'ServiceArn',
      ],
    },
  });
});