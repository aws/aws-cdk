import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Service, Source, VpcConnector } from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'integ-apprunner-vpc-connector-new');

const vpc = new ec2.Vpc(stack, 'Vpc', {
  restrictDefaultSecurityGroup: false,
  ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
});

const securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup', { vpc });

const vpcConnector = new VpcConnector(stack, 'VpcConnector', {
  vpc,
  vpcSubnets: vpc.selectSubnets({ subnetType: ec2.SubnetType.PUBLIC }),
  securityGroups: [securityGroup],
  vpcConnectorName: 'MyVpcConnector',
});

const service = new Service(stack, 'Service', {
  source: Source.fromEcrPublic({
    imageConfiguration: {
      port: 8000,
    },
    imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
  }),
  vpcConnector: vpcConnector,
});
new cdk.CfnOutput(stack, 'ServiceURL', { value: `https://${service.serviceUrl}` });

// AppRunner is only available in specific regions
new integ.IntegTest(app, 'AppRunnerVpcConnector', {
  testCases: [stack],
  regions: ['ap-northeast-1', 'ap-south-1', 'ap-southeast-1', 'ap-southeast-2', 'eu-central-1', 'eu-west-1', 'eu-west-2', 'eu-west-3', 'us-east-1', 'us-east-2', 'us-west-2'],
});

app.synth();
