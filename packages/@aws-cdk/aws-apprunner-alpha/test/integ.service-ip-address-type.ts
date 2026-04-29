import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { APPRUNNER_SUPPORTED_REGIONS } from './apprunner-supported-regions';
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
  regions: APPRUNNER_SUPPORTED_REGIONS,
});

app.synth();
