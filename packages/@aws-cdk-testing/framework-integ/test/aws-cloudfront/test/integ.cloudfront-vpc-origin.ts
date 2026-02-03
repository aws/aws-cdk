import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-cloudfront-vpc-origin');

const vpc = new ec2.Vpc(stack, 'Vpc', {
  ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
  natGateways: 0,
  // VPC origin requires an internet gateway in VPC
  subnetConfiguration: [
    {
      name: 'public',
      subnetType: ec2.SubnetType.PUBLIC,
    },
    {
      name: 'isolated',
      subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
    },
  ],
});

// VPC origin for EC2 instance

const instance = new ec2.Instance(stack, 'Instance', {
  vpc,
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MICRO),
  machineImage: ec2.MachineImage.latestAmazonLinux2023(),
  vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
});
new cloudfront.VpcOrigin(stack, 'VpcOriginFromInstance', {
  endpoint: cloudfront.VpcOriginEndpoint.ec2Instance(instance),
});

// VPC origin for Application Load Balancer

const alb = new elbv2.ApplicationLoadBalancer(stack, 'ALB', {
  vpc,
  internetFacing: false,
  vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
});
alb.addListener('HTTP', {
  protocol: elbv2.ApplicationProtocol.HTTP,
  defaultAction: elbv2.ListenerAction.fixedResponse(400),
});
new cloudfront.VpcOrigin(stack, 'VpcOriginFromALB', {
  endpoint: cloudfront.VpcOriginEndpoint.applicationLoadBalancer(alb),
  protocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY,
});

// VPC origin for Network Load Balancer

const nlbSg = new ec2.SecurityGroup(stack, 'NLB-SG', { vpc });
const nlbTg = new elbv2.NetworkTargetGroup(stack, 'NLB-TG', { vpc, port: 80 });
const nlb = new elbv2.NetworkLoadBalancer(stack, 'NLB', {
  vpc,
  internetFacing: false,
  vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
  securityGroups: [nlbSg],
});
nlb.addListener('HTTP', {
  port: 80,
  defaultTargetGroups: [nlbTg],
});
new cloudfront.VpcOrigin(stack, 'VpcOriginFromNLB', {
  endpoint: cloudfront.VpcOriginEndpoint.networkLoadBalancer(nlb),
  protocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY,
});

new IntegTest(stack, 'cloudfront-vpc-origin-test', {
  testCases: [stack],
});
