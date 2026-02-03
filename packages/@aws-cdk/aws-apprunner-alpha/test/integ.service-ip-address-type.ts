import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { IpAddressType, Service, Source } from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'integ-apprunner-ip-address-type');

const service = new Service(stack, 'Service', {
  serviceName: 'service',
  source: Source.fromEcrPublic({
    imageConfiguration: {
      port: 8000,
    },
    imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
  }),
  autoDeploymentsEnabled: false,
  ipAddressType: IpAddressType.DUAL_STACK,
});

new cdk.CfnOutput(stack, 'URL', { value: `https://${service.serviceUrl}` });

new integ.IntegTest(app, 'AppRunnerIpAddressType', {
  testCases: [stack],
  regions: ['ap-northeast-1', 'ap-south-1', 'ap-southeast-1', 'ap-southeast-2', 'eu-central-1', 'eu-west-1', 'eu-west-2', 'eu-west-3', 'us-east-1', 'us-east-2', 'us-west-2'],
});

app.synth();
