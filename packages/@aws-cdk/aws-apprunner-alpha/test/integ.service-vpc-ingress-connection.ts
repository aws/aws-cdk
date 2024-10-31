import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import { Service, Source } from '../lib';
import { VpcIngressConnection } from '../lib/vpc-ingress-connection';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'integ-apprunner-vpc-ingress-connection');

const vpc = new ec2.Vpc(stack, 'Vpc', {
  ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
});

const interfaceVpcEndpoint = new ec2.InterfaceVpcEndpoint(stack, 'VpcEndpoint', {
  vpc,
  service: ec2.InterfaceVpcEndpointAwsService.APP_RUNNER_REQUESTS,
  privateDnsEnabled: false,
});

const service = new Service(stack, 'Service', {
  source: Source.fromEcrPublic({
    imageConfiguration: {
      port: 8000,
    },
    imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
  }),
  isPubliclyAccessible: false,
});

const vpcIngressConnection = new VpcIngressConnection(stack, 'VpcIngressConnection', {
  service: service,
  vpc,
  interfaceVpcEndpoint,
  vpcIngressConnectionName: 'MyVpcIngressConnection',
});

new integ.IntegTest(app, 'AppRunnerVpcIngressConnection', {
  testCases: [stack],
});

new cdk.CfnOutput(stack, 'Vpc Ingress Connection Domain name', { value: `https://${vpcIngressConnection.domainName}` });
