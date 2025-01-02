import * as cdk from 'aws-cdk-lib';
import { IpAddressType, Service, Source } from '../lib';
import * as integ from '@aws-cdk/integ-tests-alpha';

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
});

app.synth();
