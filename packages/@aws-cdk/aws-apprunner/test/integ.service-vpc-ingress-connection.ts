import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { Service, Source } from '../lib';
import { VpcIngressConnection } from '../lib/vpc-ingress-connection';


const app = new cdk.App();

const stack = new cdk.Stack(app, 'integ-apprunner');

// Scenario 8: Create the service from ECR public with a VPC Ingress Connection
const vpc = new ec2.Vpc(stack, 'Vpc', {
  ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
});

const vpcInterfaceEndpoint = new ec2.InterfaceVpcEndpoint(stack, 'VpcEndpoint', {
  vpc,
  service: new ec2.InterfaceVpcEndpointService('com.amazonaws.vpce.us-east-1.vpce-svc-uuddlrlrbastrtsvc', 443),
});

const service8 = new Service(stack, 'Service8', {
  source: Source.fromEcrPublic({
    imageConfiguration: {
      port: 8000,
    },
    imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
  }),
});
new cdk.CfnOutput(stack, 'URL8', { value: `https://${service8.serviceUrl}` });

const vpcIngressConnection = new VpcIngressConnection(stack, 'VpcIngressConnection', {
  service: service8,
  vpc,
  vpcInterfaceEndpoint,
  vpcIngressConnectionName: 'MyVpcIngressConnection',
});

new cdk.CfnOutput(stack, 'Vpc Ingress Connection Domain name', { value: `https://${vpcIngressConnection.domainName}` });
new cdk.CfnOutput(stack, 'Vpc Ingress Connection Status', { value: `https://${vpcIngressConnection.status}` });
