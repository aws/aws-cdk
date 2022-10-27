import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { Service, Source, VpcConnector } from '../lib';


const app = new cdk.App();

const stack = new cdk.Stack(app, 'integ-apprunner');

// Scenario 6: Create the service from ECR public with a VPC Connector
const vpc = new ec2.Vpc(stack, 'Vpc', {
  ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
});

const securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup', { vpc });

const vpcConnector = new VpcConnector(stack, 'VpcConnector', {
  vpc,
  vpcSubnets: vpc.selectSubnets({ subnetType: ec2.SubnetType.PUBLIC }),
  securityGroups: [securityGroup],
  vpcConnectorName: 'MyVpcConnector',
});

const service6 = new Service(stack, 'Service6', {
  source: Source.fromEcrPublic({
    imageConfiguration: {
      port: 8000,
    },
    imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
  }),
  vpcConnector,
});
new cdk.CfnOutput(stack, 'URL6', { value: `https://${service6.serviceUrl}` });

// Scenario 7: Create the service from ECR public and associate it with an existing VPC Connector

const service7 = new Service(stack, 'Service7', {
  source: Source.fromEcrPublic({
    imageConfiguration: {
      port: 8000,
    },
    imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
  }),
  vpcConnector: VpcConnector.fromVpcConnectorAttributes(stack, 'ImportedVpcConnector', {
    vpcConnectorArn: vpcConnector.vpcConnectorArn,
    vpcConnectorName: vpcConnector.vpcConnectorName,
    vpcConnectorRevision: vpcConnector.vpcConnectorRevision,
    securityGroups: [securityGroup],
  }),
});
new cdk.CfnOutput(stack, 'URL7', { value: `https://${service7.serviceUrl}` });