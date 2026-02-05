import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Service, Source, VpcConnector } from '../lib';

const app = new cdk.App();

// Stack 1: Service with newly created VPC Connector
const stack1 = new cdk.Stack(app, 'integ-apprunner-vpc-connector-new');

const vpc1 = new ec2.Vpc(stack1, 'Vpc', {
  restrictDefaultSecurityGroup: false,
  ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
});

const securityGroup1 = new ec2.SecurityGroup(stack1, 'SecurityGroup', { vpc: vpc1 });

const vpcConnector1 = new VpcConnector(stack1, 'VpcConnector', {
  vpc: vpc1,
  vpcSubnets: vpc1.selectSubnets({ subnetType: ec2.SubnetType.PUBLIC }),
  securityGroups: [securityGroup1],
  vpcConnectorName: 'MyVpcConnector',
});

const service1 = new Service(stack1, 'Service', {
  source: Source.fromEcrPublic({
    imageConfiguration: {
      port: 8000,
    },
    imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
  }),
  vpcConnector: vpcConnector1,
});
new cdk.CfnOutput(stack1, 'ServiceURL', { value: `https://${service1.serviceUrl}` });

// Stack 2: Service with imported VPC Connector
const stack2 = new cdk.Stack(app, 'integ-apprunner-vpc-connector-imported');

const vpc2 = new ec2.Vpc(stack2, 'Vpc', {
  restrictDefaultSecurityGroup: false,
  ipAddresses: ec2.IpAddresses.cidr('10.1.0.0/16'),
});

const securityGroup2 = new ec2.SecurityGroup(stack2, 'SecurityGroup', { vpc: vpc2 });

const vpcConnector2 = new VpcConnector(stack2, 'VpcConnector', {
  vpc: vpc2,
  vpcSubnets: vpc2.selectSubnets({ subnetType: ec2.SubnetType.PUBLIC }),
  securityGroups: [securityGroup2],
  vpcConnectorName: 'MyImportedVpcConnector',
});

// Test importing an existing VPC Connector
const importedConnector = VpcConnector.fromVpcConnectorAttributes(stack2, 'ImportedVpcConnector', {
  vpcConnectorArn: vpcConnector2.vpcConnectorArn,
  vpcConnectorName: vpcConnector2.vpcConnectorName,
  vpcConnectorRevision: vpcConnector2.vpcConnectorRevision,
  securityGroups: [securityGroup2],
});

const service2 = new Service(stack2, 'Service', {
  source: Source.fromEcrPublic({
    imageConfiguration: {
      port: 8000,
    },
    imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
  }),
  vpcConnector: importedConnector,
});
new cdk.CfnOutput(stack2, 'ServiceURL', { value: `https://${service2.serviceUrl}` });

// AppRunner is only available in specific regions
new integ.IntegTest(app, 'AppRunnerVpcConnector', {
  testCases: [stack1, stack2],
  regions: ['ap-northeast-1', 'ap-south-1', 'ap-southeast-1', 'ap-southeast-2', 'eu-central-1', 'eu-west-1', 'eu-west-2', 'eu-west-3', 'us-east-1', 'us-east-2', 'us-west-2'],
});

app.synth();
